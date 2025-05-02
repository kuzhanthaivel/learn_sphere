import { ethers } from "ethers";

const contractABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "string", "name": "_userName", "type": "string"},
      {"internalType": "string", "name": "_profileImage", "type": "string"},
      {"internalType": "string", "name": "_courseTitle", "type": "string"},
      {"internalType": "string", "name": "_courseCategory", "type": "string"},
      {"internalType": "string", "name": "_completionDate", "type": "string"},
      {"internalType": "string", "name": "_certificateId", "type": "string"}
    ],
    "name": "addCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "userName", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "profileImage", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "courseTitle", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "courseCategory", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "completionDate", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "certificateId", "type": "string"}
    ],
    "name": "CertificateAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllCertificates",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "string", "name": "userName", "type": "string"},
          {"internalType": "string", "name": "profileImage", "type": "string"},
          {"internalType": "string", "name": "courseTitle", "type": "string"},
          {"internalType": "string", "name": "courseCategory", "type": "string"},
          {"internalType": "string", "name": "completionDate", "type": "string"},
          {"internalType": "string", "name": "certificateId", "type": "string"}
        ],
        "internalType": "struct CertificateDetails.Certificate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = "0x2bade7cace305ec03e4686aa32525bf40c00e87e";

export const getCertificateContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};