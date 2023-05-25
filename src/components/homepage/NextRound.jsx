import { React, useState, useEffect } from "react";
import networks from "./networks.jsx";
const { ethers, BigNumber } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(networks.sepolia.rpcUrl);

const styles = {
  NextRound:
    "w-full p-9 my-4 md:my-0 rounded-3xl relative bg-[color:var(--red)]",
  h1: "text-[1.8em]",
  time: "text-[1.8em] font-bold my-8 mx-0 p-4 bg-[#1F1F1F] rounded-3xl text-center",
};

export default function NextRound() {
  const [timeLeft, setTimeLeft] = useState(0);

  const stakingcontractAddress = "0x2C4E19b1B46857caa94CF4d219A82dc38C865220";
const stakingcontractABI = [
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
		"name": "getStakerAddresses",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastActivationTime",
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
		"name": "totalTokensStaked",
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
		"name": "unstake",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

  useEffect(() => {
	const checkJackpotWon = async () => {
		try {
		  const contract = new ethers.Contract(stakingcontractAddress, stakingcontractABI, provider);
		  const filter = contract.filters.JackpotWon(); // Assuming the event name is JackpotWon
	
		  // Check if the JackpotWon event is triggered in the contract
		  const events = await contract.queryFilter(filter);
	
		  if (events.length > 0) {
			// If the event is triggered, start the timer
			fetchTimeLeft();
		  }
		} catch (error) {
		  console.error('Error checking JackpotWon event:', error);
		}
	  };
	
	  checkJackpotWon();
    let isMounted = true;

    const fetchTimeLeft = async () => {
      try {
        const contract = new ethers.Contract(stakingcontractAddress, stakingcontractABI, provider);
        const lastActivationTime = await contract.lastActivationTime();
		//console.log(lastActivationTime);
        const currentTime = Math.floor(Date.now() / 1000);
        const countdown = 20 * 60; // 7 days in seconds
        const timeSinceLastActivation = currentTime - lastActivationTime.toNumber();
        const remainingTime = countdown - (timeSinceLastActivation % countdown);

        if (isMounted) {
          setTimeLeft(remainingTime);
        }
      } catch (error) {
        console.error('Error fetching time left:', error);
      }
    };

    

    return () => {
      isMounted = false;
    };
  }, [stakingcontractAddress, stakingcontractABI]);

  

  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };


  return (
    <div className={styles.NextRound}>
      <h1 className={styles.h1}>Next Round</h1>
      {/* <div className={styles.time}>
        <span>5 Days 1 : </span>
        <span>59</span>
      </div> */}
      <div>
      Time left until next raffle: {formatTime(timeLeft)}
    </div>
    </div>
  );
}
