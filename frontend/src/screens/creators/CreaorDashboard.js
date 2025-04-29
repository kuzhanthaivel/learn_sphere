import React, { useState, useEffect } from 'react';
import { BsArrowUpRightSquareFill, BsPlusSquareFill } from "react-icons/bs";
import { FaStar, FaUsers, FaTrash, FaUsers as FaCommunity } from "react-icons/fa";
import Navbar from './components/Header'
import CoverImage1 from "../../assets/CoverImage1.png";

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
    ? `http://localhost:5001/${coverImage.replace(/\\/g, '/')}`
    : CoverImage1;
  return (
    <div className="bg-white p-2 shadow-2xl cursor-pointer w-full rounded-lg transition-transform hover:scale-105">
      <div className="relative">
        <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
          {category}
        </div>
        <img 
          src={imageUrl} 
          className="w-full h-32 object-cover" 
          alt={`${title} course cover`} 
          onError={(e) => {
            e.target.src = CoverImage1;
          }}
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
  
  const coursesPerPage = 4;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('creatorToken');
        if (!token) {
          throw new Error('No creator token found');
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
            rating: course.rating
          }));

          const transformedStats = [
            { 
              title: "Total Students", 
              value: data.data.stats.totalStudents.toLocaleString(), 
              icon: <FaUsers className="text-2xl" />, 
              color: "bg-blue-100 text-blue-600"
            },
            { 
              title: "Average Rating", 
              value: data.data.stats.averageRating, 
              icon: <FaStar className="text-2xl" />,
              color: "bg-yellow-100 text-yellow-600"
            },
            { 
              title: "Courses Published", 
              value: data.data.stats.totalCourses, 
              icon: <BsArrowUpRightSquareFill className="text-2xl" />,
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
          { title: "Total Students", value: "0", icon: <FaUsers className="text-2xl" /> },
          { title: "Average Rating", value: "0.0", icon: <FaStar className="text-2xl" /> },
          { title: "Courses Published", value: "0", icon: <BsArrowUpRightSquareFill className="text-2xl" /> }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
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
      alert('Failed to delete course');
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateNewCourse = () => {
    console.log("Navigate to course creation");
  };

  if (loading) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E9F8F3] min-h-screen">
      <Navbar />

      <div className='p-4 md:p-20'>
        <div className="flex-1 ml-0 md:ml-8">
          <div className="flex flex-wrap gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg shadow flex-1 min-w-[200px] ${stat.color || 'bg-white'}`}>
                <div className="flex justify-between items-center gap-6">
                  <div>
                    <p className="text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-bold mb-4 md:mb-0">Your Courses</h2>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={handleCreateNewCourse}
              >
                <BsPlusSquareFill className="mr-2" />
                New Course
              </button>
            </div>

            {courses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      coverImage={course.coverImage}
                      category={course.category}
                      students={course.students}
                      rating={course.rating}
                      onDelete={handleDeleteCourse}
                    />
                  ))}
                </div>

                {courses.length > coursesPerPage && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        «
                      </button>
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
                        className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
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