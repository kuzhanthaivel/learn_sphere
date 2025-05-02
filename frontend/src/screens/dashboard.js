import React, { useState, useEffect } from 'react';
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaUsers as FaCommunity } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/footer";
import CoverImage1 from "../assets/CoverImage1.png";
import Mycourse from '../assets/MyCourse.png';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({
  id,
  category,
  coverImage,
  title,
  description,
  community,
  onCommunityClick
}) => {
  const imageUrl = coverImage
    ? `http://localhost:5001/${coverImage.replace(/\\/g, '/')}`
    : CoverImage1;

  return (
    <div className="bg-white p-2 shadow-md hover:shadow-lg cursor-pointer w-full sm:w-56 rounded-lg transition-transform hover:scale-[1.02]">
      <div className="relative">
        <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50 text-xs sm:text-sm">
          {category}
        </div>
        <img
          src={imageUrl}
          className="w-full h-32 sm:h-36 object-cover rounded-t-lg"
          alt={`${title} course cover`}
          onError={(e) => {
            e.target.src = CoverImage1;
          }}
        />
      </div>
      <div className="border-b border-gray-200 p-2">
        <p className="text-gray-800 font-medium text-sm sm:text-base line-clamp-1">{title}</p>
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">{description}</p>
      </div>
      <div className="flex justify-between items-center w-full p-2">
        <button
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onCommunityClick(community);
          }}
        >
          <FaCommunity className="mr-1" /> Community
        </button>
        <BsArrowUpRightSquareFill
          className="text-xl sm:text-2xl w-6 h-6 rounded-md hover:bg-white hover:text-green-500 bg-green-500 text-white transition-colors"
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  useEffect(() => {
    const fetchOwnedCourses = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await fetch('http://localhost:5001/api/students/studentDashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setCourses(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedCourses();
  }, [navigate]);

  const handleCommunityClick = (communityId) => {
    if (communityId) {
      navigate(`/community/${communityId}`);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/streamingcourse/${courseId}`);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading your courses...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#E9F8F3] min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mb-8">
          <div className="flex-shrink-0">
            <img
              src={Mycourse}
              className="w-40 md:w-52"
              alt="My Courses"
            />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Learning Dashboard</h1>
            <p className="text-gray-600 mt-2">Continue your learning journey</p>
          </div>
        </div>

        <div className="container mx-auto px-0">
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">You don't have any courses yet.</p>
              <button
                onClick={() => navigate('/courses')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentCourses.map((course) => (
                  <div 
                    key={course.id} 
                    onClick={() => handleCourseClick(course.id)}
                    className="transition-transform hover:scale-[1.02]"
                  >
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      coverImage={course.coverImage}
                      category={course.category}
                      description={course.shortDescription}
                      community={course.community}
                      onCommunityClick={handleCommunityClick}
                    />
                  </div>
                ))}
              </div>

              {courses.length > coursesPerPage && (
                <div className="flex justify-center mt-8 overflow-x-auto">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 sm:px-4 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 sm:px-4 sm:py-2 border-t border-b border-gray-300 text-xs sm:text-sm font-medium ${currentPage === pageNum ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 sm:px-4 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}