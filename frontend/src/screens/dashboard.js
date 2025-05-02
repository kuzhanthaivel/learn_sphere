import React, { useState, useEffect } from 'react';
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaUsers as FaCommunity } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/footer";
import CoverImage1 from "../assets/CoverImage1.png";
import Mycourse from '../assets/MyCourse.png'
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
    <div className="bg-white p-2 shadow-2xl cursor-pointer w-56 rounded-lg transition-transform hover:scale-105">
      <div className="relative">
        <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-50">
          {category}
        </div>
        <img
          src={imageUrl}
          className="w-full h-32 object-cover"
          alt={`${title} course cover`}
        />
      </div>
      <div className="border-b border-gray-300 p-2">
        <p className="text-gray-800 font-medium line-clamp-1">{title}</p>
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        <button
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onCommunityClick(community);
          }}
        >
          <FaCommunity className="mr-1" /> Community
        </button>
        <BsArrowUpRightSquareFill
          className="text-2xl w-6 h-6 rounded-md hover:bg-white hover:text-green-500 bg-green-500 text-white"
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
          throw new Error('No authentication token found');
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
          throw new Error('Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedCourses();
  }, []);

  const handleCommunityClick = (communityId) => {
    console.log('Community ID:', communityId);
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
      <div className="bg-[#E9F8F3] min-h-screen">
        <Header />
        <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E9F8F3] min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

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
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p>You don't have any courses yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-rows-1 grid-cols-4 gap-10">
                {currentCourses.map((course) => (
                  <div key={course.id} onClick={() => handleCourseClick(course.id)}>
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
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}