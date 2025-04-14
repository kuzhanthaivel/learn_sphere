import React, { useState } from 'react';
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/footer";
import CoverImage1 from "../assets/CoverImage1.png";
import CoverImage2 from "../assets/CoverImage2.png";
import CoverImage3 from "../assets/CoverImage3.png";
import Mycourse from '../assets/MyCourse.png'

const CourseCard = ({ 
  id,
  category, 
  coverImage, 
  isSelected, 
  onClick, 
  title, 
  description, 
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
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        {/* progressBar */}
        <BsArrowUpRightSquareFill
          className={`text-2xl w-6 h-6 rounded-md ${
            isSelected ? "bg-white text-green-500" : "bg-green-500 text-white"
          }`}

        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const courses = [
    { 
      id: 1,
      title: "Introduction to Music Theory", 
      coverImage: CoverImage1,
      category: "Music", 
      description: "Learn the fundamentals of music theory and composition.", 
    },
    { 
      id: 2,
      title: "UI/UX Design Fundamentals", 
      coverImage: CoverImage2,
      category: "Design", 
      description: "Master the principles of user interface design.", 
    },
    { 
      id: 3,
      title: "Web Development Bootcamp", 
      coverImage: CoverImage3,
      category: "Development", 
      description: "Complete course covering HTML, CSS, JavaScript.", 
    },
    { 
      id: 4,
      title: "Advanced Photography", 
      coverImage: CoverImage1,
      category: "Photography", 
      description: "Take your photography skills to the next level.", 
    },
    { 
      id: 5,
      title: "Digital Marketing Masterclass", 
      coverImage: CoverImage2,
      category: "Marketing", 
      description: "Learn SEO, social media marketing strategies.", 
    },
    { 
      id: 6,
      title: "Financial Planning Basics", 
      coverImage: CoverImage3,
      category: "Finance", 
      description: "Understand personal finance and investments.", 
    },
    { 
      id: 7,
      title: "Python for Data Science", 
      coverImage: CoverImage1,
      category: "Data Science", 
      description: "Learn Python programming and data analysis.", 
    },
    { 
      id: 8,
      title: "Mobile App Development", 
      coverImage: CoverImage2,
      category: "Development", 
      description: "Build cross-platform mobile applications.", 
    }
  ];

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-[#E9F8F3]">
      <Header />

           <div className='flex p-20 '>
           <div className='items-center flex'>
        <img 
          src={Mycourse} 
          className="w-52" 
          alt="my Courses Section" 
        />
      </div>

      <div className="container px-4 py-8 ">        
        <div className="grid grid-rows-1 grid-cols-4 gap-4">
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              coverImage={course.coverImage}
              category={course.category}
              description={course.description}
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

      <Footer />
    </div>
  );
}