import Navbar from "../components/Header";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import { FaEthereum, FaDatabase, FaWallet, FaMoneyBillWave } from "react-icons/fa";
import { RiExchangeFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getContract } from "../contractIntegration/Transaction";

export default function ChainTransaction() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [payments, setPayments] = useState([]);
  const [web2Transactions, setWeb2Transactions] = useState([]);
  const [loading, setLoading] = useState({
    web3: true,
    web2: true
  });
  const [error, setError] = useState({
    web3: null,
    web2: null
  });
  const studentToken = localStorage.getItem('studentToken');

  // Connect wallet handler
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

  // Disconnect wallet handler
  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    setPayments([]);
  };

  // Fetch payments from blockchain
  const fetchPayments = async () => {
    try {
      setLoading(prev => ({...prev, web3: true}));
      const contract = getContract();
      if (contract) {
        const data = await contract.getAllPayments();
        
        const processedPayments = data.map(payment => ({
          transactionId: payment[0],
          user: payment[1],
          timestamp: payment[2],
          courseName: payment[3],
          courseCategory: payment[4],
          transactionType: payment[5],
          paymentMethod: payment[6],
          amount: payment[7],
          exchangeId: payment[8]
        }));
        
        setPayments(processedPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError(prev => ({...prev, web3: "Failed to load transactions from blockchain"}));
    } finally {
      setLoading(prev => ({...prev, web3: false}));
    }
  };

  // Fetch Web2 transactions from API using fetch
  const fetchWeb2Transactions = async () => {
    try {
      setLoading(prev => ({...prev, web2: true}));
      const response = await fetch('http://localhost:5001/api/fetchTransaction', {
        headers: {
          'Authorization': `Bearer ${studentToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setWeb2Transactions(data);
    } catch (error) {
      console.error("Error fetching Web2 transactions:", error);
      setError(prev => ({...prev, web2: "Failed to load transactions from server"}));
    } finally {
      setLoading(prev => ({...prev, web2: false}));
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "test") return "N/A";
    
    try {
      // If timestamp is a Unix timestamp (seconds)
      if (!isNaN(timestamp)) {
        return new Date(parseInt(timestamp) * 1000).toLocaleString();
      }
      
      // If it's already a date string or Date object
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp; // Return as-is if can't parse
    }
  };

  // Get row color based on transaction type
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

  // Get amount color based on transaction type
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

  // Filter payments by connected wallet address
  const filteredPayments = isConnected 
    ? payments.filter(payment => payment.user.toLowerCase() === walletAddress.toLowerCase())
    : [];

  // Load data on mount and when wallet connects
  useEffect(() => {
    fetchWeb2Transactions();
    
    if (isConnected) {
      fetchPayments();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl">
              <button 
                onClick={() => navigate(-1)}
                className="border border-gray-200 py-2 pl-3 pr-1 rounded-xl cursor-pointer text-black text-center hover:bg-gray-100 transition-colors"
              >
                <MdArrowBackIos />
              </button>
              <span>Transaction History</span>
            </div>
            <div>
              {isConnected ? (
                <div className="w-56">
                  <div className="px-3 h-11 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-evenly hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors">
                    <FaWallet className="text-green-800" />
                    <span className="text-sm font-medium text-green-800 truncate">
                      {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
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
                  <FaEthereum className="mr-2" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Blockchain Transactions Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#20B486] flex items-center">
              <FaEthereum className="text-white mr-2" />
              <h3 className="text-lg font-medium text-white">Blockchain Transactions</h3>
            </div>
            <div className="p-6">
              {error.web3 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error.web3}</p>
                    </div>
                  </div>
                </div>
              )}

              {loading.web3 && isConnected ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : !isConnected ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <FaWallet className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Wallet not connected</h3>
                  <p className="mt-1 text-sm text-gray-500">Please connect your wallet to view blockchain transactions</p>
                  <button
                    onClick={connectWallet}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#20B486] hover:bg-[#1a9c72] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20B486]"
                  >
                    <FaEthereum className="mr-2" />
                    Connect Wallet
                  </button>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <RiExchangeFill className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No blockchain transactions</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any transactions recorded on the blockchain yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exchange ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment, index) => (
                        <tr 
                          key={`web3-${index}`} 
                          className={`${getRowColor(payment.transactionType)} transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {payment.transactionId || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimestamp(payment.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.courseName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.courseCategory || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.transactionType === "Buy" ? "bg-green-100 text-green-800" :
                              payment.transactionType === "Exchange" ? "bg-purple-100 text-purple-800" :
                              payment.transactionType === "Rent" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {payment.transactionType || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.paymentMethod || "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAmountColor(payment.transactionType)}`}>
                            {payment.amount || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {payment.exchangeId 
    ? payment.exchangeId.length > 5
      ? `${payment.exchangeId.substring(0, 5)}...` 
      : payment.exchangeId
    : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Web2 Transactions Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#20B486] flex items-center justify-between">
  <div className="flex items-center">
    <FaDatabase className="text-white mr-2" />
    <h3 className="text-lg font-medium text-white">Traditional Transactions</h3>
  </div>
  {web2Transactions.length > 0 && (
    <div className="text-white font-medium">
      User: {web2Transactions[0].UserName || "N/A"}
    </div>
  )}
</div>
            <div className="p-6">
              {error.web2 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error.web2}</p>
                    </div>
                  </div>
                </div>
              )}

              {loading.web2 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : web2Transactions.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No traditional transactions</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any transactions recorded in our system yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exchange ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {web2Transactions.map((transaction, index) => (
                        <tr 
                          key={`web2-${index}`} 
                          className={`${getRowColor(transaction.transactionType)} transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {transaction.transactionId || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimestamp(transaction.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.courseName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.courseCategory || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.transactionType === "Buy" ? "bg-green-100 text-green-800" :
                              transaction.transactionType === "Exchange" ? "bg-purple-100 text-purple-800" :
                              transaction.transactionType === "Rent" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {transaction.transactionType || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.paymentMethod || "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAmountColor(transaction.transactionType)}`}>
                            {transaction.amount || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {transaction.exchangeId 
    ? transaction.exchangeId.length > 5
      ? `${transaction.exchangeId.substring(0, 5)}...` 
      : transaction.exchangeId
    : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}