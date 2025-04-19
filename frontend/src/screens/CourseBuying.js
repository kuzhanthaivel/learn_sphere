import Navbar from "../components/Header";
import Footer from "../components/footer";
import Image from "../assets/CoverImage1.png";
import React, { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';

export default function CourseBinding() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [duration, setDuration] = useState("");
  const [rentalCost, setRentalCost] = useState(0);
  const [tokenCost, setTokenCost] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [activeTab, setActiveTab] = useState("buy"); 

  const courseData = {
    title: "Advanced React Development",
    shortDescription: "Master React hooks, context API, and advanced patterns",
    fullDescription: "This comprehensive course takes you through advanced React concepts including hooks, context API, performance optimization, and state management. You'll build real-world applications and learn best practices from industry experts.",
    fullPrice: 120,
    discount: 20,
    category: "Development",
    syllabus: [
      { id: 1, title: "React Fundamentals Recap" },
      { id: 2, title: "Deep Dive into React Hooks" },
      { id: 3, title: "Context API and State Management" },
      { id: 4, title: "Performance Optimization Techniques" },
      { id: 5, title: "Server-Side Rendering with Next.js" },
      { id: 6, title: "Testing React Applications" },
      { id: 7, title: "Building a Complete Project" }
    ]
  };
 
  const durationOptions = {
    "1 Day": { percentage: 5, tokenMultiplier: 0.2 }, 
    "3 Days": { percentage: 8, tokenMultiplier: 0.35 },
    "1 Month": { percentage: 20, tokenMultiplier: 0.7},
    "3 Months": { percentage: 35, tokenMultiplier: 1 },
    "6 Months": { percentage: 50, tokenMultiplier: 1.5 }
  };

  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setDuration(selectedDuration);

    if (selectedDuration) {
      const durationData = durationOptions[selectedDuration];
      // Calculate money cost as percentage of full price
      const moneyCost = (courseData.fullPrice * durationData.percentage) / 100;
      // Calculate token cost (assuming $1 = 10 tokens)
      const tokensCost = Math.round((courseData.fullPrice * 10) * (durationData.tokenMultiplier / 10));
      
      setRentalCost(moneyCost);
      setTokenCost(tokensCost);
      
      // Set total payment based on selected payment method
      if (paymentMethod === "tokens") {
        setTotalPayment(tokensCost);
      } else {
        setTotalPayment(moneyCost);
      }
    }
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    
    // Update total payment when payment method changes
    if (duration) {
      if (method === "tokens") {
        setTotalPayment(tokenCost);
      } else {
        setTotalPayment(rentalCost);
      }
    }
  };

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="py-5 px-6 ">
        <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
          <button className="border border-gray-200 py-2 pl-3 pr-1  rounded-xl cursor-pointer text-black text-center "><MdArrowBackIos /></button>
          <span>{courseData.title}</span>
          <span className=" border text-gray-700 text-sm py-2 px-4 border-gray-700 rounded-lg">{courseData.category}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6 ">
        {/* Left Side - Course Description & Syllabus */}
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
              {courseData.syllabus.map((item) => (
                <div key={item.id} className="flex text-sm text-gray-800 border-b pb-2 mb-2">
                  <div className="w-1/4 font-bold">{item.id}</div>
                  <div className="w-3/4 font-bold">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Payment Options */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-80">
          <img
            src={Image}
            alt="Course"
            className="w-full rounded-md mb-4"
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
          <button className="px-3 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-center">Connect Wallet</button>

          {activeTab === "buy" ? (
            <div className="p-4">
              <p className="text-sm mb-4 text-center font-bold">Unlock the full course and gain lifetime access to all materials.</p>
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <p className="my-4">Course Amount: </p> 
                  <p className="font-semibold">${courseData.fullPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="my-4">Discount Applied: </p>
                  <span className="font-semibold">${courseData.discount}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center gap-8">
                  <p className="my-4 text-base font-bold">Total Payment: </p>
                  <p className="font-bold text-green-600">${courseData.fullPrice - courseData.discount}</p>
                </div>
              </div>
              <button className="w-full mt-5 bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-200">
                Purchase Course
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
                  <option value="tokens">Pay with Tokens</option>
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
                    <p className="my-4">{paymentMethod === "tokens" ? "Token Cost" : "Rental Cost"}: </p> 
                    <p className="font-semibold">
                      {paymentMethod === "tokens" ? 
                        `${tokenCost} tokens` : 
                        `$${rentalCost.toFixed(2)} (${durationOptions[duration].percentage}%)`}
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
                      {paymentMethod === "tokens" ? `${totalPayment} tokens` : `$${totalPayment.toFixed(2)}`}
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