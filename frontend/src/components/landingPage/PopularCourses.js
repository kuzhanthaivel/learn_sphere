import React, { useState } from "react";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import popularCourses from "../../assets/popuar Course.png";
import CoverImage1 from "../../assets/CoverImage1.png";
import CoverImage2 from "../../assets/CoverImage2.png";
import CoverImage3 from "../../assets/CoverImage3.png";


const PopularCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState("Design");

  return (
    <section className="py-16 pl-60 bg-green-50 flex items-center justify-between  pr-32">
      <div className="">
        <img src={popularCourses} className="w-52" alt="Popular Courses" />
      </div>

 <div className="flex flex-row gap-6 ">
            <div
              className="bg-white p-2 shadow-lg cursor-pointer w-56 gap-6 rounded-lg"
              onClick={() => setSelectedCourse("HTML")}
            >
              <div className="relative">
                <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
                  HTML
                </div>
                <img src={CoverImage1} className="w-52" alt="Course Cover" />
              </div>
              <div className="border-b border-gray-300 p-2">
              <p className="text-gray-400 line-clamp-1">
                  Course Title
                </p>
                <p className="text-gray-400 line-clamp-1">
                  Various versions have evolved...
                </p>
                <div className="flex justify-start gap-2 items-center pt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center w-full pt-2">
                    <span className="text-lg font-semibold">$500</span>
                    <BsArrowUpRightSquareFill
                      className={`text-2xl w-6 h-6 rounded-md ${
                        selectedCourse === "HTML"
                          ? "bg-white text-green-500"
                          : "bg-green-500 text-white"
                      }`}
                    />
                  </div>
            </div>

            <div
              className="bg-white p-2 shadow-lg cursor-pointer w-56 gap-6 rounded-lg"
              onClick={() => setSelectedCourse("Design")}
            >
              <div className="relative">
                <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
                  Design
                </div>
                <img src={CoverImage2} className="w-52" alt="Course Cover" />
              </div>
              <div className="border-b border-gray-300 p-2">
              <p className="text-gray-400 line-clamp-1">
                  Course Title
                </p>
                <p className="text-gray-400 line-clamp-1">
                  Various versions have evolved...
                </p>
                <div className="flex justify-start gap-2 items-center pt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center w-full pt-2">
                    <span className="text-lg font-semibold">$500</span>
                    <BsArrowUpRightSquareFill
                      className={`text-2xl w-6 h-6 rounded-md ${
                        selectedCourse === "Design"
                          ? "bg-white text-green-500"
                          : "bg-green-500 text-white"
                      }`}
                    />
                  </div>
            </div>

            <div
              className="bg-white p-2 shadow-lg cursor-pointer w-56 gap-6 rounded-lg"
              onClick={() => setSelectedCourse("Development")}
            >
              <div className="relative">
                <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
                  Development
                </div>
                <img src={CoverImage3} className="w-52" alt="Course Cover" />
              </div>
              <div className="border-b border-gray-300 p-2">
              <p className="text-gray-400 line-clamp-1">
                  Course Title
                </p>
                <p className="text-gray-400 line-clamp-1">
                  Various versions have evolved...
                </p>
                <div className="flex justify-start gap-2 items-center pt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center w-full pt-2">
                    <span className="text-lg font-semibold">$500</span>
                    <BsArrowUpRightSquareFill
                      className={`text-2xl w-6 h-6 rounded-md ${
                        selectedCourse === "Development"
                          ? "bg-white text-green-500"
                          : "bg-green-500 text-white"
                      }`}
                    />
                  </div>
            </div>

 </div>
    </section>
  );
};

export default PopularCourses;
