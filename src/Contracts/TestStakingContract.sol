// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingContract {
    using SafeMath for uint256;

    address public owner;
    uint256 public minimumDuration;
    //uint256 public jackpotBalance;
    uint256 public lastActivationTime; 
    uint256 public totalTokensStaked; 
    address public tokenAdress;
    //uint256 public constant TICKETS_PER_TOKEN = 10;

    struct Staker {
        uint256 stakedAmount;
        uint256 timestamp;
    }

    mapping(address => Staker) public stakers;
    address[] private stakerAddresses;

    event Received(address, uint256);
    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event JackpotWon(address indexed winner, uint256 amount);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }
    modifier onlyWithinDuration() {
    require(
        block.timestamp >= stakers[msg.sender].timestamp.add(minimumDuration),
        "The raffle cannot be activated before the minimum duration."
    );
    _;
}

    constructor(uint256 _minimumDurationInDays, address _tokenAdress) {
        owner = msg.sender;
        minimumDuration = _minimumDurationInDays * 1 minutes;
        tokenAdress = _tokenAdress;
    }

    function getJackpotBalance() external view onlyWithinDuration returns (uint256) {
        return address(this).balance;
    }

    function stake(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero.");

        IERC20 token = IERC20(tokenAdress);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance.");
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Contract not authorized to transfer tokens."
        );

        token.transferFrom(msg.sender, address(this), amount);

        if (stakers[msg.sender].stakedAmount > 0) {
            stakers[msg.sender].stakedAmount += amount;
        } else {
            stakers[msg.sender] = Staker(amount, block.timestamp);
            stakerAddresses.push(msg.sender);
        }
         totalTokensStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake() external payable {
        require(
            stakers[msg.sender].stakedAmount > 0,
            "You have no tokens staked."
        );
        require(
            block.timestamp >=
                stakers[msg.sender].timestamp.add(minimumDuration),
            "Tokens are locked."
        );

        uint256 amount = stakers[msg.sender].stakedAmount;
        delete stakers[msg.sender];

        IERC20 token = IERC20(tokenAdress);
        token.transfer(msg.sender, amount);
        
         totalTokensStaked -= amount;
        emit Unstaked(msg.sender, amount);
    }

    function activateRaffle() external payable onlyOwner {
        require(block.timestamp >= lastActivationTime + 20 minutes, "Please wait at least 7 seconds before calling this function again.");

        uint256 winnerIndex = getRandomNumber();
        address winner = getAddressFromIndex(winnerIndex);
        uint256 jackpotAmount = address(this).balance;
        payable(winner).transfer(jackpotAmount);
        emit JackpotWon(winner, jackpotAmount);
        lastActivationTime = block.timestamp;

    }

    function getRandomNumber() private view returns (uint256) {
        uint256 eligibleStakerCount = getEligibleStakerCount();
        require(eligibleStakerCount > 0, "No eligible stakers available.");

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    eligibleStakerCount
                )
            )
        );
        return randomNumber % eligibleStakerCount;
    }

    function getAddressFromIndex(uint256 index) private view returns (address) {
        return stakerAddresses[index];
    }

    function getEligibleStakerCount() private view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            address stakerAddress = stakerAddresses[i];
            if (
                stakers[stakerAddress].stakedAmount > 0 &&
                isStakeEligible(stakerAddress)
            ) {
                count++;
            }
        }
        return count;
    }

    function isStakeEligible(address staker) private view returns (bool) {
        return
            block.timestamp >= stakers[staker].timestamp.add(minimumDuration);
    }

    function getStakerAddresses() external view returns (address[] memory) {
        address[] memory addresses = new address[](getTotalStakers());
        uint256 count = 0;
        for (uint256 i = 0; i < addresses.length; i++) {
            if (stakers[getAddressFromIndex(i)].stakedAmount > 0) {
                addresses[count] = getAddressFromIndex(i);
                count++;
            }
        }
        return addresses;
    }

    function getTotalStakers() private view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            if (stakers[stakerAddresses[i]].stakedAmount > 0) {
                count++;
            }
        }
        return count;
    }

    function withdraw() public onlyOwner{
        require(msg.sender == owner, "Only the contract owner can withdraw funds");
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
