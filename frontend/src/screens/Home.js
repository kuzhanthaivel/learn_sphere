import React, { useState, useEffect } from 'react';
import {
  PiPenNib, PiFileHtml, PiMicrophoneStageLight, PiBriefcaseLight,
  PiSunHorizonLight, PiCameraLight, PiMusicNoteLight, PiDatabaseLight,
  PiLightbulbLight, PiHeartbeatLight, PiGraphLight, PiDetectiveLight
} from "react-icons/pi";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaSearch, FaStar, FaExclamationTriangle } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/footer";
import Searchbackimage from '../assets/Searchbackimage.png';
import CoverImage1 from "../assets/CoverImage1.png";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const coursesPerPage = 12;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/fetchAllCoures');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = [
    { title: "All", icon: PiLightbulbLight },
    { title: "Design", icon: PiPenNib },
    { title: "Development", icon: PiFileHtml },
    { title: "Marketing", icon: PiMicrophoneStageLight },
    { title: "Business", icon: PiBriefcaseLight },
    { title: "Lifestyle", icon: PiSunHorizonLight },
    { title: "Photography", icon: PiCameraLight },
    { title: "Music", icon: PiMusicNoteLight },
    { title: "Data Science", icon: PiDatabaseLight },
    { title: "Personal Develop", icon: PiLightbulbLight },
    { title: "Health & Fitness", icon: PiHeartbeatLight },
    { title: "Finance", icon: PiGraphLight },
    { title: "Teaching", icon: PiDetectiveLight },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const CourseCard = React.memo(({
    id,
    category,
    coverImage,
    title,
    shortDescription,
    price,
    rating
  }) => {
    const imageUrl = coverImage
      ? `http://localhost:5001/${coverImage.replace(/\\/g, '/')}`
      : CoverImage1;

    return (
      <div
        className="bg-white p-3 shadow-md hover:shadow-lg cursor-pointer w-full rounded-lg transition-transform hover:scale-[1.02] scale-90"
        onClick={() => navigate(`/CourseBuying/${id}`)}
      >
        <div className="relative">
          <div className="absolute bg-white left-2 top-2 px-2 py-1 rounded-lg bg-opacity-75 border text-xs sm:text-sm">
            {category}
          </div>
          <img
            src={imageUrl}
            className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
            alt={`${title} course cover`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = CoverImage1;
            }}
          />
        </div>
        <div className="border-b border-gray-200 p-3">
          <p className="text-gray-800 font-medium text-sm sm:text-base line-clamp-1">{title}</p>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">{shortDescription}</p>
          <div className="flex justify-start gap-1 items-center pt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-xs sm:text-sm ${i < (rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full pt-2 px-2 pb-1">
          <span className="text-base sm:text-lg font-semibold">₹{price}</span>
          <BsArrowUpRightSquareFill
            className="text-xl sm:text-2xl w-6 h-6 rounded-md bg-green-500 text-white hover:bg-white hover:text-green-500 transition-colors"
          />
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm sm:text-lg text-[#20B486] font-medium p-2">
          Empowering Learning, One Step at a Time
        </h2>
        <p className="text-base sm:text-xl font-semibold text-gray-800 max-w-3xl mt-2">
          Discover the future of education with course rentals, gamified learning
          experiences, community-driven collaboration, shareable profiles, and
          blockchain-secured credentials all in one platform.
        </p>
      </div>

      {/* Search Section */}
      <section className="pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute inset-x-0 -top-5 flex justify-center">
          <img src={Searchbackimage} alt="Search background" className="w-32 sm:w-44" />
        </div>
        <div className="text-center mb-8 relative">
          <div className="bg-white mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-between max-w-md sm:max-w-lg mx-auto shadow-lg z-20 border">
            <input
              type="text"
              placeholder="Search for courses..."
              className="bg-transparent outline-none w-full placeholder-[#6D737A] text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="text-gray-400 ml-2" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.title;
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedCategory(category.title);
                  setCurrentPage(1);
                }}
                className={`flex justify-between items-center p-2 sm:p-3 w-full rounded-lg shadow-sm sm:shadow-md transition 
                  ${isSelected ? "border-2 border-green-500 bg-white" : "bg-white"} 
                  hover:shadow-lg`}
              >
                <div className="flex gap-2 items-center">
                  <category.icon className="text-xl sm:text-2xl text-gray-500" />
                  <span className="text-xs sm:text-sm md:text-base">{category.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex justify-center items-center p-4 " >
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center max-w-md w-full ">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 mt-4">Loading courses...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex-grow flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center max-w-md w-full text-red-500">
            <FaExclamationTriangle className="text-3xl mb-3" />
            <p className="text-lg font-medium">Error loading courses</p>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {error.message || "Please try again later"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow p-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 mt-6 sm:mt-8 mx-12 ">
          {currentCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    id={course._id}
                    title={course.title}
                    coverImage={course.coverImage}
                    category={course.category}
                    shortDescription={course.shortDescription}
                    price={course.price}
                    rating={course.rating}
                  />
                ))}
              </div>

              {filteredCourses.length > coursesPerPage && (
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
          ) : (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
              <div className="text-center p-6">
                <p className="text-gray-600 mb-4">No courses found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;