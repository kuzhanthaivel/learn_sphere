import React, { useState } from "react";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import popularCourses from "../../assets/popuar Course.png";
import CoverImage1 from "../../assets/CoverImage1.png";
import CoverImage2 from "../../assets/CoverImage2.png";
import CoverImage3 from "../../assets/CoverImage3.png";

const CourseCard = ({ 
  category, 
  image, 
  isSelected, 
  onClick, 
  title = "Course Title", 
  description = "Various versions have evolved...", 
  price = "$500" 
}) => {
  return (
    <div
      className="bg-white p-2 shadow-lg cursor-pointer w-56 rounded-lg transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
          {category}
        </div>
        <img 
          src={image} 
          className="w-full h-32 object-cover" 
          alt={`${category} course cover`} 
        />
      </div>
      <div className="border-b border-gray-300 p-2">
        <p className="text-gray-400 line-clamp-1">{title}</p>
        <p className="text-gray-400 line-clamp-1">{description}</p>
        <div className="flex justify-start gap-2 items-center pt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        <span className="text-lg font-semibold">{price}</span>
        <BsArrowUpRightSquareFill
          className={`text-2xl w-6 h-6 rounded-md ${
            isSelected ? "bg-white text-green-500" : "bg-green-500 text-white"
          }`}
        />
      </div>
    </div>
  );
};

const PopularCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState("Design");

  const courses = [
    { category: "HTML", image: CoverImage1 },
    { category: "Design", image: CoverImage2 },
    { category: "Development", image: CoverImage3 }
  ];

  return (
    <section className="py-16 px-4 sm:px-8 md:px-16 lg:pl-60 lg:pr-32 bg-green-50 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <img 
          src={popularCourses} 
          className="w-52" 
          alt="Popular Courses Section" 
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.category}
            category={course.category}
            image={course.image}
            isSelected={selectedCourse === course.category}
            onClick={() => setSelectedCourse(course.category)}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularCourses;