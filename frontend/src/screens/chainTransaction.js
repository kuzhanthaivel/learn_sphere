import Navbar from "../components/Header";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import { toast } from 'react-toastify';
import React, { useState, useEffect } from "react";
const courses = [
  { 
    id: 1,
    title: "Introduction to Music Theory", 
    category: "Music", 
  },
  { 
    id: 2,
    title: "UI/UX Design Fundamentals", 
    category: "Design", 
  },
  { 
    id: 3,
    title: "Web Development Bootcamp", 
    category: "Development", 
  },
  { 
    id: 4,
    title: "Advanced Photography", 
    category: "Photography", 
  },
  { 
    id: 5,
    title: "Digital Marketing Masterclass", 
    category: "Marketing", 
  },
  { 
    id: 6,
    title: "Financial Planning Basics", 
    category: "Finance", 
  },
  { 
    id: 7,
    title: "Python for Data Science", 
    category: "Data Science", 
  },
  { 
    id: 8,
    title: "Mobile App Development", 
    category: "Development", 
  }
];

export default function ChainTransaction() {
  const data = [
    {
      id: 1,
      walletAddress: "0x71C7...3d4f",
      transactionDate: "2023-05-15 14:32",
      courseId: 3, 
      transactionType: "Buy",
      paymentMethod: "Token",
      amount: "50 EDU",
      transactionIdChain: "0x9a2b...7c1e",
      exchange: null
    },
    {
      id: 2,
      walletAddress: "0x71C7...3d4f",
      transactionDate: "2023-05-18 09:15",
      courseId: 2,
      transactionType: "Buy",
      paymentMethod: "Fiat",
      amount: "$99.00",
      transactionIdChain: "0x4e5f...2a9d",
      exchange: null
    },
    {
      id: 3,
      walletAddress: "0x71C7...3d4f",
      counterpartyWallet: "0x89AB...1e2f",
      transactionDate: "2023-05-20 16:48",
      courseId: 5, 
      counterpartyCourseId: 1,
      transactionType: "Exchange",
      paymentMethod: "None",
      amount: "Free",
      transactionIdChain: "0x1b3c...8d2e",
      exchange: {
        userExchangeCode: "EX12345",
        counterpartyExchangeCode: "EX67890"
      }
    },
    {
      id: 4,
      walletAddress: "0x71C7...3d4f",
      transactionDate: "2023-05-22 11:05",
      courseId: 8, 
      transactionType: "Rent",
      paymentMethod: "Token",
      amount: "15 EDU",
      transactionIdChain: "0x7f8e...5c3d",
      exchange: null
    },
    {
      id: 5,
      walletAddress: "0x71C7...3d4f",
      counterpartyWallet: "0x34CD...5f6g",
      transactionDate: "2023-05-25 13:27",
      courseId: 1, 
      counterpartyCourseId: 4,
      transactionType: "Exchange",
      paymentMethod: "None",
      amount: "Free",
      transactionIdChain: "0x3a4b...9e1f",
      exchange: {
        userExchangeCode: "EX54321",
        counterpartyExchangeCode: "EX09876"
      }
    },
    {
      id: 6,
      walletAddress: "0x71C7...3d4f",
      transactionDate: "2023-05-28 18:33",
      courseId: 7, 
      transactionType: "Buy",
      paymentMethod: "Token",
      amount: "30 EDU",
      transactionIdChain: "0x5c6d...0f2a",
      exchange: null
    },
    {
      id: 7,
      walletAddress: "0x71C7...3d4f",
      transactionDate: "2023-05-30 10:12",
      courseId: 4, 
      transactionType: "Rent",
      paymentMethod: "Token",
      amount: "10 EDU",
      transactionIdChain: "0x2e3f...4d5c",
      exchange: null
    }
  ];
  const studentToken = localStorage.getItem('studentToken');
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setWalletAddress(newAccounts[0]);
          } else {
            setWalletAddress("");
            setIsConnected(false);
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        
      } catch (error) {
        console.error("User rejected request:", error);
        if (error.code === 4001) {
          toast.error("Please connect to MetaMask to continue.");
        }
      }
    } else {
      toast.error("MetaMask is not installed. Please install it to use this feature.");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
  };

  const getCourseDetails = (id) => {
    return courses.find(course => course.id === id) || { title: "Unknown Course", category: "Unknown" };
  };

  const getRowColor = (type) => {
    switch (type) {
      case "Buy":
        return "bg-green-50 hover:bg-green-100";
      case "Exchange":
        return "bg-purple-50 hover:bg-purple-100";
      case "Rent":
        return "bg-blue-50 hover:bg-blue-100";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  const getAmountColor = (type) => {
    switch (type) {
      case "Buy":
        return "text-green-600";
      case "Exchange":
        return "text-purple-600";
      case "Rent":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className=" flex justify-between">
          <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
            <button className="border border-gray-200 py-2 pl-3 pr-1 rounded-xl cursor-pointer text-black text-center hover:bg-gray-100 transition-colors">
              <MdArrowBackIos />
            </button>
            <span>Your Transactions</span>
          </div>
          <div>
          {isConnected ? (
            <div className=" w-56">
              <div className="px-3 h-11 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-evenly hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors">
                <span className="text-sm font-medium text-green-800 truncate">
                  {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                </span>
                <button 
                  onClick={disconnectWallet}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="px-3 py-2 font-semibold w-56 h-11 bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center justify-center hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors"
            >
              Connect Wallet
            </button>
          )}
          </div>
          </div>


          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#20B486]">
                <tr className="text-sm text-white">
                  <th className="p-4 font-semibold">S.No</th>
                  <th className="p-4 font-semibold">Wallet Add</th>
                  <th className="p-4 font-semibold">Transaction Date</th>
                  <th className="p-4 font-semibold">Course Name</th>
                  <th className="p-4 font-semibold">Course Category</th>
                  <th className="p-4 font-semibold">Transaction Type</th>
                  <th className="p-4 font-semibold">Payment Method</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Exchange Codes</th>
                  <th className="p-4 font-semibold">Transaction Id in Chain</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  const course = getCourseDetails(row.courseId);
                  const counterpartyCourse = row.counterpartyCourseId ? getCourseDetails(row.counterpartyCourseId) : null;
                  
                  return (
                    <tr 
                      key={row.id} 
                      className={`border-b border-gray-200 text-sm transition-colors ${getRowColor(row.transactionType)}`}
                    >
                      <td className="p-4 font-medium text-gray-700">{row.id}</td>
                      <td className="p-4 text-gray-600 font-mono">
                        {row.transactionType === "Exchange" ? (
                          <div className="space-y-1">
                            <div>You: {row.walletAddress}</div>
                            <div>Other: {row.counterpartyWallet}</div>
                          </div>
                        ) : row.walletAddress}
                      </td>
                      <td className="p-4 text-gray-600">{row.transactionDate}</td>
                      <td className="p-4 font-medium text-gray-800">
                        {row.transactionType === "Exchange" ? (
                          <div className="space-y-1">
                            <div>You: {course.title}</div>
                            <div>Other: {counterpartyCourse.title}</div>
                          </div>
                        ) : course.title}
                      </td>
                      <td className="p-4 text-gray-600">
                        {row.transactionType === "Exchange" ? (
                          <div className="space-y-1">
                            <div>You: {course.category}</div>
                            <div>Other: {counterpartyCourse.category}</div>
                          </div>
                        ) : course.category}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.transactionType === "Buy" ? "bg-green-100 text-green-800" :
                          row.transactionType === "Exchange" ? "bg-purple-100 text-purple-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {row.transactionType}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {row.transactionType === "Exchange" ? "None" : row.paymentMethod}
                      </td>
                      <td className={`p-4 font-medium ${
                        row.transactionType === "Exchange" ? "text-gray-500" : getAmountColor(row.transactionType)
                      }`}>
                        {row.amount}
                      </td>
                      <td className="p-4 text-gray-600 text-xs">
                        {row.exchange ? (
                          <div>
                            <div>Code 1: {row.exchange.userExchangeCode}</div>
                            <div>Code 2: {row.exchange.counterpartyExchangeCode}</div>
                          </div>
                        ) : "Direct"}
                      </td>
                      <td className="p-4 text-gray-600 font-mono hover:text-[#20B486] cursor-pointer">
                        {row.transactionIdChain}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}