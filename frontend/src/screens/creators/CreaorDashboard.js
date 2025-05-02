import React, { useState, useEffect } from 'react';
import { BsArrowUpRightSquareFill, BsPlusSquareFill } from "react-icons/bs";
import { FaStar, FaUsers, FaTrash, FaUsers as FaCommunity } from "react-icons/fa";
import Navbar from './components/Header';
import CoverImage1 from "../../assets/CoverImage1.png";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const CourseCard = ({
  id,
  category,
  coverImage,
  title,
  students,
  rating,
  onDelete
}) => {
  const imageUrl = coverImage
    ? `${API_BASE_URL}/${coverImage.replace(/\\/g, '/')}`
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
        <div className='flex justify-between items-center mt-2'>
          <div className="flex items-center text-xs sm:text-sm">
            <FaUsers className="mr-1 text-gray-500" />
            <span className="text-gray-500">{students}</span>
          </div>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-600 text-xs sm:text-sm">{rating}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full p-2">
        <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center transition-colors">
          <FaCommunity className="mr-1" /> Community
        </button>
        <div className='bg-green-100 p-2 rounded-lg border hover:bg-green-200 transition-colors'>
          <FaTrash
            className="text-red-500 hover:text-red-700 cursor-pointer text-sm sm:text-base"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function CreatorDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const coursesPerPage = 4;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('creatorToken');
        if (!token) {
          navigate('/CreatorSignin');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/creator/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          const transformedCourses = data.data.courses.map(course => ({
            id: course.courseId,
            title: course.title,
            coverImage: course.coverImage,
            category: course.category,
            students: course.studentsCount,
            rating: course.rating.toFixed(1)
          }));

          const transformedStats = [
            {
              title: "Total Students",
              value: data.data.stats.totalStudents.toLocaleString(),
              icon: <FaUsers className="text-xl sm:text-2xl" />,
              color: "bg-blue-100 text-blue-600"
            },
            {
              title: "Average Rating",
              value: data.data.stats.averageRating.toFixed(1),
              icon: <FaStar className="text-xl sm:text-2xl" />,
              color: "bg-yellow-100 text-yellow-600"
            },
            {
              title: "Courses Published",
              value: data.data.stats.totalCourses,
              icon: <BsArrowUpRightSquareFill className="text-xl sm:text-2xl" />,
              color: "bg-green-100 text-green-600"
            }
          ];

          setCourses(transformedCourses);
          setStats(transformedStats);
        } else {
          throw new Error(data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);

        setStats([
          { 
            title: "Total Students", 
            value: "0", 
            icon: <FaUsers className="text-xl sm:text-2xl" />,
            color: "bg-blue-100 text-blue-600"
          },
          { 
            title: "Average Rating", 
            value: "0.0", 
            icon: <FaStar className="text-xl sm:text-2xl" />,
            color: "bg-yellow-100 text-yellow-600"
          },
          { 
            title: "Courses Published", 
            value: "0", 
            icon: <BsArrowUpRightSquareFill className="text-xl sm:text-2xl" />,
            color: "bg-green-100 text-green-600"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch(`${API_BASE_URL}/api/creator/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateNewCourse = () => {
    navigate('/CreateCourse');
  };

  if (loading) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen">
        <Navbar />
        <div className="p-4 md:p-20">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E9F8F3] min-h-screen">
      <Navbar />

      <div className='p-4 md:p-8 lg:p-12 xl:p-20'>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg shadow flex-1 min-w-[200px] ${stat.color || 'bg-white'} transition-transform hover:scale-[1.02]`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold">Your Courses</h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center transition-colors"
                onClick={handleCreateNewCourse}
              >
                <BsPlusSquareFill className="mr-2" />
                <span className="text-sm sm:text-base">New Course</span>
              </button>
            </div>

            {courses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      onDelete={handleDeleteCourse}
                    />
                  ))}
                </div>

                {courses.length > coursesPerPage && (
                  <div className="flex justify-center mt-8 overflow-x-auto">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        «
                      </button>
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 sm:px-4 py-1 sm:py-2 border-t border-b border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Prev
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
                            className={`px-3 sm:px-4 py-1 sm:py-2 border-t border-b border-gray-300 text-xs sm:text-sm font-medium ${currentPage === pageNum ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 sm:px-4 py-1 sm:py-2 border-t border-b border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-1 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        »
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any courses yet</p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
                  onClick={handleCreateNewCourse}
                >
                  <BsPlusSquareFill className="mr-2" />
                  Create Your First Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}