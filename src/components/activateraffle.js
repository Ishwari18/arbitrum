const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/fb42577745e24d429d936f65b43cca0b"); // Replace with your RPC URL
const privateKey = "fdc3d7a7ef1129116fbf4d565cff4ce9f86570e67ed6a7cf84281acab26986fc"; // Replace with your private key
const stakingcontractAddress = "0x0D53f5e5c2B8fEd6C90AE22472D9E419F2ba66d8"; // Replace with the address of the StakingContract
const stakingcontractAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_minimumDurationInDays",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_batman",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "JackpotWon",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Unstaked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "activateRaffle",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "batman",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getJackpotBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minimumDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stakers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "stakedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

async function activateRaffle() {
    const wallet = new ethers.Wallet(privateKey, provider);
    const signer = wallet.connect(provider);
    const contract = new ethers.Contract(stakingcontractAddress, stakingcontractAbi, signer);

  try {
    const gasLimit = 3000000; // Set your desired gas limit value
    const transaction = await contract.activateRaffle({ gasLimit });
    await transaction.wait();
    console.log("Raffle activated!");
  } catch (error) {
    console.error("Error activating raffle:", error);
  }
}

// Set the interval to 7 days (in milliseconds)
//const interval = 7 * 24 * 60 * 60 * 1000;
const interval = 10 * 1000; // 7 secnds

// Call activateRaffle initially
activateRaffle();

// Set up the interval to call activateRaffle every 7 days
setInterval(activateRaffle, interval);
