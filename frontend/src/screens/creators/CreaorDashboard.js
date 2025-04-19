import React, { useState } from 'react';
import { BsArrowUpRightSquareFill, BsPlusSquareFill } from "react-icons/bs";
import { FaStar, FaChartLine, FaUsers, FaMoneyBillWave, FaTrash, FaUsers as FaCommunity } from "react-icons/fa";
import Navbar from './components/Header'
import CoverImage1 from "../../assets/CoverImage1.png";
import CoverImage2 from "../../assets/CoverImage2.png";
import CoverImage3 from "../../assets/CoverImage3.png";

const CourseCard = ({ 
  id,
  category, 
  coverImage, 
  onClick, 
  title, 
  students,
  rating 
}) => {
  return (
    <div
      className="bg-white p-2 shadow-2xl cursor-pointer w-56 rounded-lg transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
          {category}
        </div>
        <img 
          src={coverImage} 
          className="w-full h-32 object-cover" 
          alt={`${title} course cover`} 
        />
      </div>
      <div className="border-b border-gray-300 p-2">
        <p className="text-gray-800 font-medium line-clamp-1">{title}</p>
<div className='flex justify-between items-center'>
<div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500 flex items-center">
            <FaUsers className="mr-1" /> {students}
          </span>
        </div>
        <div className="flex items-center mt-1">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-gray-600 text-sm">{rating}</span>
        </div>
</div>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center">
          <FaCommunity className="mr-1" /> Community
        </button>
       <div className='bg-green-100 p-2 rounded-lg border'>
       <FaTrash
          className="text-2xl w-4 h-4 rounded-md text-red-500 hover:text-red-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            // Add delete logic here
            console.log(`Delete course ${id}`);
          }}
        />
       </div> 
      </div>
    </div>
  );
};

const AddNewCourseCard = ({ onClick }) => {
  return (
    <div
      className="bg-white p-2 shadow-2xl cursor-pointer w-56 rounded-lg transition-transform hover:scale-105 flex flex-col items-center justify-center"
      onClick={onClick}
    >
      <BsPlusSquareFill className="text-4xl text-gray-400 mb-2" />
      <p className="text-gray-600 font-medium">Create New Course</p>
    </div>
  );
};

export default function CreatorDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const courses = [
    { 
      id: 1,
      title: "Introduction to Music Theory", 
      coverImage: CoverImage1,
      category: "Music", 
      students: 245,
      earnings: 1250,
      rating: 4.8
    },
    { 
      id: 2,
      title: "UI/UX Design Fundamentals", 
      coverImage: CoverImage2,
      category: "Design", 
      students: 189,
      earnings: 945,
      rating: 4.7
    },
    { 
      id: 3,
      title: "Web Development Bootcamp", 
      coverImage: CoverImage3,
      category: "Development", 
      students: 432,
      earnings: 2160,
      rating: 4.9
    },
    { 
      id: 4,
      title: "Advanced Photography", 
      coverImage: CoverImage1,
      category: "Photography", 
      students: 156,
      earnings: 780,
      rating: 4.6
    },
    { 
      id: 5,
      title: "Digital Marketing Masterclass", 
      coverImage: CoverImage2,
      category: "Marketing", 
      students: 321,
      earnings: 1605,
      rating: 4.5
    },
    { 
      id: 6,
      title: "Financial Planning Basics", 
      coverImage: CoverImage3,
      category: "Finance", 
      students: 278,
      earnings: 1390,
      rating: 4.7
    },
    { 
      id: 7,
      title: "Python for Data Science", 
      coverImage: CoverImage1,
      category: "Data Science", 
      students: 387,
      earnings: 1935,
      rating: 4.8
    },
    { 
      id: 8,
      title: "Mobile App Development", 
      coverImage: CoverImage2,
      category: "Development", 
      students: 210,
      earnings: 1050,
      rating: 4.6
    }
  ];

  const stats = [
    { title: "Total Students", value: "2,118", icon: <FaUsers className="text-2xl" />, change: "+12%", trend: "up" },
    { title: "Total Earnings", value: "$10,590", icon: <FaMoneyBillWave className="text-2xl" />, change: "+8%", trend: "up" },
    { title: "Average Rating", value: "4.7", icon: <FaStar className="text-2xl" />, change: "+0.2", trend: "up" },
    { title: "Courses Published", value: "8", icon: <BsArrowUpRightSquareFill className="text-2xl" />, change: "+2", trend: "up" }
  ];

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateNewCourse = () => {
    // Logic to create a new course
    console.log("Create new course clicked");
  };

  return (
    <div className="bg-[#E9F8F3] min-h-screen">
      <Navbar />

      <div className='flex p-20'>

        <div className="flex-1 ml-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            ))}
          </div>

          {/* Courses Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Courses</h2>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={handleCreateNewCourse}
              >
                <BsPlusSquareFill className="mr-2" />
                New Course
              </button>
            </div>

            <div className="grid grid-rows-1 grid-cols-4 gap-4">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  coverImage={course.coverImage}
                  category={course.category}
                  students={course.students}
                  earnings={course.earnings}
                  rating={course.rating}
                  isSelected={selectedCourse === course.id}
                  onClick={() => setSelectedCourse(course.id)}
                />
              ))}
            </div>

            {courses.length > coursesPerPage && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === number ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}