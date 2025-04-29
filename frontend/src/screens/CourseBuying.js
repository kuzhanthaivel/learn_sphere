import Navbar from "../components/Header";
import Footer from "../components/footer";
import Image from "../assets/CoverImage1.png";
import React, { useState, useEffect } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function CourseBinding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentToken = localStorage.getItem('studentToken');
  const [paymentMethod, setPaymentMethod] = useState("");
  const [duration, setDuration] = useState("");
  const [rentalCost, setRentalCost] = useState(0);
  const [coinsCost, setCoinsCost] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [activeTab, setActiveTab] = useState("buy");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/fetchById/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course data');
      }
      const data = await response.json();
      setCourseData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

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

  const durationOptions = {
    "1 Day": { percentage: 5, coinsMultiplier: 10 }, 
    "3 Days": { percentage: 8, coinsMultiplier: 16 },
    "1 Week": { percentage: 15, coinsMultiplier: 30 },
    "2 Weeks": { percentage: 20, coinsMultiplier: 40 },
    "1 Month": { percentage: 35, coinsMultiplier: 70 },
    "3 Months": { percentage: 50, coinsMultiplier: 100 },
    "6 Months": { percentage: 70, coinsMultiplier: 140 }
  };

  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);

    if (selectedDuration && courseData) {
      const durationData = durationOptions[selectedDuration];
      const moneyCost = (courseData.price * durationData.percentage) / 100;
      const calculatedCoinsCost = Math.round((courseData.price * durationData.coinsMultiplier) / 100);
      
      setRentalCost(moneyCost);
      setCoinsCost(calculatedCoinsCost);
      
      if (paymentMethod === "coins") {
        setTotalPayment(calculatedCoinsCost);
      } else {
        setTotalPayment(moneyCost);
      }
    }
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    
    if (duration && courseData) {
      if (method === "coins") {
        setTotalPayment(coinsCost);
      } else {
        setTotalPayment(rentalCost);
      }
    }
  };

  const handlePurchase = async () => {
    if (!studentToken) {
      toast.error("Please login to purchase the course");
      navigate('/login');
      return;
    }

    setIsPurchasing(true);
    try {
      const finalPrice = courseData.price - ((courseData.price * courseData.discount) / 100);
      
      const response = await fetch('http://localhost:5001/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          courseId: id,
          amount: finalPrice
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed');
      }

      toast.success('Course purchased successfully!');
      console.log('Purchase response:', data);
      
      navigate('/dashboard')

    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to purchase course');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex flex-col justify-center items-center h-64 text-red-500">
        <FaExclamationTriangle className="text-3xl mb-3" />
        <p className="text-lg font-medium">Error loading data</p>
        <p className="text-sm text-gray-600 mt-1">{error.message || "Please try again later"}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Course not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = courseData.coverImage 
    ? `http://localhost:5001/${courseData.coverImage.replace(/\\/g, '/')}`
    : Image; 

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="py-5 px-6 ">
        <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="border border-gray-200 py-2 pl-3 pr-1 rounded-xl cursor-pointer text-black text-center"
          >
            <MdArrowBackIos />
          </button>
          <span>{courseData.title}</span>
          <span className="border text-gray-700 text-sm py-2 px-4 border-gray-700 rounded-lg">
            {courseData.category}
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6 ">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-xs text-gray-500 font-semibold mb-2">
              {courseData.shortDescription}
            </p>
            <p className="text-lg font-semibold">
              {courseData.fullDescription}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 ">
              <img src={Syllabus} alt="Learn Sphere" className="w-60" />
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 border-b pb-2 mb-2">
                <div className="w-1/4 font-semibold">S.No</div>
                <div className="w-3/4 font-semibold">Title</div>
              </div>
              {courseData.syllabus.map((item, index) => (
                <div key={index} className="flex text-sm text-gray-800 border-b pb-2 mb-2">
                  <div className="w-1/4 font-bold">{item.S_no || index + 1}</div>
                  <div className="w-3/4 font-bold">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-auto lg:w-80 lg:h-auto">
          <img
            src={imageUrl}
            alt="Course"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <div className="flex justify-evenly mb-3">
            <button 
              className={`px-4 py-1 ${activeTab === "buy" ? "text-green-600 border-b-2 border-green-500" : "text-gray-500"} font-medium`}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </button>
            <button 
              className={`px-4 py-1 ${activeTab === "rent" ? "text-green-600 border-b-2 border-green-500" : "text-gray-500"} font-medium`}
              onClick={() => setActiveTab("rent")}
            >
              Rentals
            </button>
          </div>
          {isConnected ? (
            <div className="mb-4">
              <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
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
              className="px-3 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-center hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors"
            >
              Connect Wallet
            </button>
          )}

          {activeTab === "buy" ? (
            <div className="p-4">
              <p className="text-sm mb-4 text-center font-bold">Unlock the full course and gain lifetime access to all materials.</p>
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <p className="my-4">Course Amount: </p> 
                  <p className="font-semibold">₹{courseData.price}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="my-4">Discount Applied: </p>
                  <span className="font-semibold">₹{(courseData.price * courseData.discount)/100}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center gap-8">
                  <p className="my-4 text-base font-bold">Total Payment: </p>
                  <p className="font-bold text-green-600">
                    ₹{(courseData.price - ((courseData.price * courseData.discount)/100)).toFixed(2)}
                  </p>
                </div>
              </div>
              <button 
                onClick={handlePurchase}
                disabled={isPurchasing}
                className={`w-full mt-5 bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-200 ${
                  isPurchasing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isPurchasing ? 'Processing...' : 'Purchase Course'}
              </button>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm mb-4 text-center font-bold">Choose a rental plan that fits your needs and budget.</p>
              <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  <option className="bg-transparent" value="">Select Payment Method</option>
                  <option value="money">Pay with Money</option>
                  <option value="coins">Pay with coins</option>
                </select>
              </div>

              <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={handleDurationChange}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  <option value="">Select Duration</option>
                  {Object.keys(durationOptions).map((dur) => (
                    <option key={dur} value={dur}>
                      {dur} 
                    </option>
                  ))}
                </select>
              </div>

              {duration && (
                <div className="mb-4 p-3 rounded">
                  <div className="flex justify-between items-center"> 
                    <p className="my-4">{paymentMethod === "coins" ? "coins Cost" : "Rental Cost"}: </p> 
                    <p className="font-semibold">
                      {paymentMethod === "coins" ? 
                        `${coinsCost} coins` : 
                        `₹${rentalCost.toFixed(2)} (${durationOptions[duration].percentage}%)`}
                    </p> 
                  </div>
                  <div className="flex justify-between items-center"> 
                    <p className="my-4">Duration:</p> 
                    <p className="font-semibold">{duration}</p> 
                  </div>

                  <hr className="my-4" />
                  <div className="flex justify-between items-center gap-8">
                    <p className="my-4 text-base font-bold">Total Payment: </p>
                    <p className="font-bold text-green-600">
                      {paymentMethod === "coins" ? `${totalPayment} coins` : `₹${totalPayment.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              )}

              <button className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-200">
                Rent Course
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}