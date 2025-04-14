import Navbar from "../components/Header";
import Footer from "../components/footer";
import Image from "../assets/CoverImage1.png";
import React, { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';

export default function CourseExchange() {
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
              className="px-4 py-1 text-green-600 border-b-2 border-green-500 font-medium"
            >
              Exchange
            </button>
          </div>

          <div className="flex-col flex gap-3 ">
          <p className="text-sm mb-4 text-center font-bold">Unlock the full course and gain lifetime access to all materials.</p>
          <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                Your Exchange code
                </label>
                <p
                  className="w-full bg-transparent outline-none appearance-none"
                >Ab12fgLP</p>
              </div>
          <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                your friend exchange code
                </label>
                <input
                  className="w-full bg-transparent outline-none appearance-none"
                  placeholder=""
                />
              </div>
              <button className="w-full bg-[#20B486] text-white p-3 rounded hover:bg-green-600 transition-all duration-200">
                 Exchange
              </button>
          </div>

             

        </div>
      </div>
      <Footer />
    </div>
  )
}
