// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BATMAN is ERC20, Ownable {
    using SafeMath for uint256;

    address public constant deadAddress = address(0xdead);

    bool private swapping;

    uint256 public moment;
    address public lastUser;
    uint256 public amountPerHour;

     event GetReward(address _winner, uint256 _reward);
    event UserUpdated(address _newUser, uint256 _timestamp);
    event Updated(address _lastUser, uint256 _timestamp);

    address public marketingWallet;
    address public devWallet;
    address public weeklyWallet;

    uint256 public maxTransactionAmount;
    uint256 public swapTokensAtAmount;
    uint256 public maxWallet;

    bool public limitsInEffect = true;
    bool public tradingActive = true;
    bool public swapEnabled = false;

    // Anti-bot and anti-whale mappings and variables
    mapping(address => uint256) private _holderLastTransferTimestamp; // to hold last Transfers temporarily during launch
    bool public transferDelayEnabled = true;

    uint256 public tokensForMarketing;
    uint256 public tokensForLiquidity;
    uint256 public tokensForDev;
    uint256 public tokensForWeekly;
    uint256 public tokensForHourly;

    /******************/
    uint256 public buyweeklyfee = 3;
    uint256 public buyhourlyfee = 1;
    uint256 public buyMarketingFee = 2;
    uint256 public buyLiquidityFee = 0;
    uint256 public buyDevFee = 1;
    uint256 public buyTotalFees =
        buyMarketingFee +
            buyLiquidityFee +
            buyDevFee +
            buyweeklyfee +
            buyhourlyfee;

    uint256 public sellweeklyfee = 3;
    uint256 public sellhourlyfee = 1;
    uint256 public sellMarketingFee = 2;
    uint256 public sellLiquidityFee = 0;
    uint256 public sellDevFee = 1;
    uint256 public sellTotalFees =
        sellMarketingFee +
            sellLiquidityFee +
            sellDevFee +
            sellweeklyfee +
            sellhourlyfee;

    // deadblock
    uint256 public deadBlock;
    uint256 public constant feeDuration = 2;
    bool public isFeeUpdated = false;

    /******************/

    // exlcude from fees and max transaction amount
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) public _isExcludedMaxTransactionAmount;

    // store addresses that a automatic market maker pairs. Any transfer *to* these addresses
    // could be subject to a maximum transfer amount
    mapping(address => bool) public automatedMarketMakerPairs;
    address public pairAddress;

    event UpdateUniswapV2Router(
        address indexed newAddress,
        address indexed oldAddress
    );

    event ExcludeFromFees(address indexed account, bool isExcluded);

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    event marketingWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event devWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiquidity
    );

    event AutoNukeLP();

    event ManualNukeLP();

    constructor() ERC20("BATMAN", unicode"BATMAN") {
        uint256 totalSupply = 420_000_000_000_000 * 10**18;

        maxTransactionAmount = 20_000_000 * 1e18; // 2% from total supply maxTransactionAmountTxn
        maxWallet = 20_000_000 * 1e18; // 2% from total supply maxWallet
        swapTokensAtAmount = (totalSupply * 10) / 10000; // 0.1% swap wallet

        marketingWallet = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; // set as marketing wallet
        devWallet = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; // set as dev wallet

        deadBlock = block.number; // set the initial deadblock

        // exclude from paying fees or having max transaction amount
        excludeFromFees(owner(), true);
        excludeFromFees(address(this), true);
        excludeFromFees(address(0xdead), true);

        excludeFromMaxTransaction(owner(), true);
        excludeFromMaxTransaction(address(this), true);
        excludeFromMaxTransaction(address(0xdead), true);

       _mint(msg.sender, totalSupply);
    }

    receive() external payable {}
    
    function transferliquidity(address recipient, uint256 amount) public onlyOwner {
        _transfer(address(this), recipient, amount);
    }

    function setpairAddress(address _pairaddress) public onlyOwner {
        pairAddress = _pairaddress;
    }

    function setWeeklyWallet(address _weeklyWallet) external onlyOwner {
      weeklyWallet = _weeklyWallet;
    }

    // remove limits after token is stable
    function removeLimits() external onlyOwner returns (bool) {
        limitsInEffect = false;
        return true;
    }

    // disable Transfer delay - cannot be reenabled
    function disableTransferDelay() external onlyOwner returns (bool) {
        transferDelayEnabled = false;
        return true;
    }

    // change the minimum amount of tokens to sell from fees
    function updateSwapTokensAtAmount(uint256 newAmount)
        external
        onlyOwner
        returns (bool)
    {
        require(
            newAmount >= (totalSupply() * 1) / 100000,
            "Swap amount cannot be lower than 0.001% total supply."
        );
        require(
            newAmount <= (totalSupply() * 5) / 1000,
            "Swap amount cannot be higher than 0.5% total supply."
        );
        swapTokensAtAmount = newAmount;
        return true;
    }

    function updateMaxTxnAmount(uint256 newNum) external onlyOwner {
        require(
            newNum >= ((totalSupply() * 1) / 1000) / 1e18,
            "Cannot set maxTransactionAmount lower than 0.1%"
        );
        maxTransactionAmount = newNum * (10**18);
    }

    function updateMaxWalletAmount(uint256 newNum) external onlyOwner {
        require(
            newNum >= ((totalSupply() * 5) / 1000) / 1e18,
            "Cannot set maxWallet lower than 0.5%"
        );
        maxWallet = newNum * (10**18);
    }

    function excludeFromMaxTransaction(address updAds, bool isEx)
        public
        onlyOwner
    {
        _isExcludedMaxTransactionAmount[updAds] = isEx;
    }

    // only use to disable contract sales if absolutely necessary (emergency use only)
    function updateSwapEnabled(bool enabled) external onlyOwner {
        swapEnabled = enabled;
    }

    function updateBuyFees(
        uint256 _marketingFee,
        uint256 _liquidityFee,
        uint256 _devFee
    ) external onlyOwner {
        isFeeUpdated = true;

        buyMarketingFee = _marketingFee;
        buyLiquidityFee = _liquidityFee;
        buyDevFee = _devFee;
        buyTotalFees = buyMarketingFee + buyLiquidityFee + buyDevFee;
        require(buyTotalFees <= 40, "Must keep fees at 40% or less");
    }

    function updateSellFees(
        uint256 _marketingFee,
        uint256 _liquidityFee,
        uint256 _devFee
    ) external onlyOwner {
        isFeeUpdated = true;

        sellMarketingFee = _marketingFee;
        sellLiquidityFee = _liquidityFee;
        sellDevFee = _devFee;
        sellTotalFees = sellMarketingFee + sellLiquidityFee + sellDevFee;
        require(sellTotalFees <= 40, "Must keep fees at 40% or less");
    }

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludeFromFees(account, excluded);
    }

    function updateMarketingWallet(address newMarketingWallet)
        external
        onlyOwner
    {
        emit marketingWalletUpdated(newMarketingWallet, marketingWallet);
        marketingWallet = newMarketingWallet;
    }

    function updateDevWallet(address newWallet) external onlyOwner {
        emit devWalletUpdated(newWallet, devWallet);
        devWallet = newWallet;
    }

    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }

    event BoughtEarly(address indexed sniper);

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (amount == 0) {
            super._transfer(from, to, 0);
            return;
        }

        if (limitsInEffect) {
            if (
                from != owner() &&
                to != owner() &&
                to != address(0) &&
                to != address(0xdead) &&
                !swapping
            ) {
                if (!tradingActive) {
                    require(
                        _isExcludedFromFees[from] || _isExcludedFromFees[to],
                        "Trading is not active."
                    );
                }


                //when buy
                if (
                    automatedMarketMakerPairs[from] &&
                    !_isExcludedMaxTransactionAmount[to]
                ) {
                    require(
                        amount <= maxTransactionAmount,
                        "Buy transfer amount exceeds the maxTransactionAmount."
                    );
                    require(
                        amount + balanceOf(to) <= maxWallet,
                        "Max wallet exceeded"
                    );
                }
                //when sell
                else if (
                    automatedMarketMakerPairs[to] &&
                    !_isExcludedMaxTransactionAmount[from]
                ) {
                    require(
                        amount <= maxTransactionAmount,
                        "Sell transfer amount exceeds the maxTransactionAmount."
                    );
                } else if (!_isExcludedMaxTransactionAmount[to]) {
                    require(
                        amount + balanceOf(to) <= maxWallet,
                        "Max wallet exceeded"
                    );
                }
            }
        }

        uint256 contractTokenBalance = balanceOf(address(this));

       // bool canSwap = contractTokenBalance >= swapTokensAtAmount;


        bool takeFee = !swapping;

        // set deadblock when add initial lp
        if (automatedMarketMakerPairs[to] && from == owner()) {
            deadBlock = block.number;
        }

        // check if we are in a fee period and adjust fee accordingly
        if (!isFeeUpdated) {
            // until fee is updated
            if (block.number >= (deadBlock + feeDuration)) {
                buyMarketingFee = 7;
                buyLiquidityFee = 0;
                buyDevFee = 8;
                buyTotalFees = buyMarketingFee + buyLiquidityFee + buyDevFee;

                sellMarketingFee = 15;
                sellLiquidityFee = 0;
                sellDevFee = 15;
                sellTotalFees =
                    sellMarketingFee +
                    sellLiquidityFee +
                    sellDevFee;
            }
        }

        // if any account belongs to _isExcludedFromFee account then remove the fee
        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
            takeFee = false;
        }

        uint256 fees = 0;
        // only take fees on buys/sells, do not take on wallet transfers
        if (takeFee) {
            // on sell
            if (to == pairAddress && sellTotalFees > 0) {
                fees = amount.mul(sellTotalFees).div(100);
                tokensForLiquidity += (fees * sellLiquidityFee) / 100;
                tokensForDev += (fees * sellDevFee) / 100;
                tokensForMarketing += (fees * sellMarketingFee) / 100;
                tokensForHourly += (fees * sellhourlyfee) / 100;
            }
            // on buy
            else if (from == pairAddress && buyTotalFees > 0) {
                fees = amount.mul(buyTotalFees).div(100);
                tokensForLiquidity += (fees * buyLiquidityFee) / 100;
                tokensForDev += (fees * buyDevFee) / 100;
                tokensForMarketing += (fees * buyMarketingFee) / 100;
                tokensForHourly += (fees * buyhourlyfee) / 100;

                if (msg.value > 0.05 ether) {
              update(msg.value, block.timestamp, msg.sender);
            }
            }

            if (fees > 0) {
                super._transfer(from, address(this), fees); //sends fee from the buyer/seller to this account
            }

            amount -= fees;
        }

       
        super._transfer(from, to, amount);
       
    }


    function transferWeeklyFee(address recipient) external  onlyOwner{
        require(tokensForWeekly > 0, "No weekly fee available");

       // uint256 weeklyethAmount = swapTokensForEth(tokensForWeekly);
        payable(recipient).transfer(tokensForWeekly);
        tokensForWeekly = 0; // Reset the weekly fee amount after transfer
    }
    function transferHourlyFeeAmount(address recipient) external  onlyOwner{
        require(tokensForWeekly > 0, "No weekly fee available");

       // uint256 hourlyethAmount = swapTokensForEth(tokensForHourly);
        payable(recipient).transfer(tokensForWeekly);
        tokensForHourly = 0; // Reset the weekly fee amount after transfer
    }

    function transferTokensForMarketing() external onlyOwner  {
     tokensForMarketing = 0; // Reset tokensForMarketing

    // Transfer the marketing tokens to the marketing wallet
    _transfer(address(this), marketingWallet, tokensForMarketing);
    }

    function transferTokensForDev() external onlyOwner {
    tokensForDev = 0; // Reset tokensForDev

    // Transfer the dev tokens to the dev wallet
    _transfer(address(this), devWallet, tokensForDev);
    }

    function update(
        uint256 _amount,
        uint256 _time,
        address _user
    ) internal {
        amountPerHour += _amount;

        if (moment == 0) {
            moment = _time;
            if (_amount > 5 * 10**16) {
                lastUser = _user;
                emit UserUpdated(lastUser, moment);
            }
            return;
        }

        if (_time - moment < 600) {
            if (amountPerHour >= 5 * 10**16) {
                moment = _time;
                amountPerHour = 0;
                if (_amount >= 5 * 10**16) {
                    lastUser = _user;
                    emit UserUpdated(lastUser, moment);
                }
                emit Updated(lastUser, moment);
            }
        } else {
             // Sends the jackpot
             //  uint256 ethAmount = swapTokensForEth(tokensForHourly);
               payable(lastUser).transfer(tokensForHourly);
        }
    }
}
