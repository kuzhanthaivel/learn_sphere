import { ethers } from "ethers";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_transactionId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_timestamp",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_courseCategory",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_transactionType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_paymentMethod",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_amount",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_exchangeId",
				"type": "string"
			}
		],
		"name": "addPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "transactionId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "timestamp",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "courseCategory",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "transactionType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "paymentMethod",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "amount",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "exchangeId",
				"type": "string"
			}
		],
		"name": "PaymentAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "transactionId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "timestamp",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "courseName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "courseCategory",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "transactionType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "paymentMethod",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "amount",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "exchangeId",
						"type": "string"
					}
				],
				"internalType": "struct PaymentDetails.Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contractAddress = "0xb6ed290c0882233c20d8993b7c06c3511750a72b";

export const getContract = () => {
	if (!window.ethereum) {
		alert("MetaMask is not installed!");
		return null;
	}

	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	return new ethers.Contract(contractAddress, contractABI, signer);
};

