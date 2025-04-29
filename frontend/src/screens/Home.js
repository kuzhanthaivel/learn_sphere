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

  const filteredCourses = courses.filter(course => 
    selectedCategory === "All" || course.category === selectedCategory
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const CourseCard = ({ 
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
        className="bg-white p-2 shadow-2xl cursor-pointer w-56 rounded-lg transition-transform hover:scale-110 scale-105"
        onClick={() => navigate(`/CourseBuying/${id}`)} 
      >
        <div className="relative">
          <div className="absolute bg-white left-1 top-1 px-2 py-1 rounded-lg bg-opacity-75 border ">
            {category}
          </div>
          <img 
            src={imageUrl} 
            className="w-full h-32 object-cover" 
            alt={`${title} course cover`} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = CoverImage1;
            }}
          />
        </div>
        <div className="border-b border-gray-300 p-2">
          <p className="text-gray-800 font-medium line-clamp-1">{title}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{shortDescription}</p>
          <div className="flex justify-start gap-1 items-center pt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-sm ${i < (rating || 0) ? "text-yellow-400" : "text-gray-300"}`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full pt-2">
          <span className="text-lg font-semibold">₹{price}</span>
          <BsArrowUpRightSquareFill
            className="text-2xl w-6 h-6 rounded-md bg-green-500 text-white hover:bg-white hover:text-green-500"
          />
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center text-center pt-8 px-4">
        <h2 className="text-lg text-[#20B486] font-medium p-2">
          Empowering Learning, One Step at a Time
        </h2>
        <p className="text-xl font-semibold text-gray-800 max-w-3xl mt-2">
          Discover the future of education with course rentals, gamified learning
          experiences, community-driven collaboration, shareable profiles, and
          blockchain-secured credentials all in one platform.
        </p>
      </div>

      <section className="pt-16 px-4 md:px-24 relative z-10">
        <div className="absolute inset-x-0 -top-5 flex justify-center">
          <img src={Searchbackimage} alt="Searchbackimage" className="w-44" />
        </div>
        <div className="text-center mb-8 relative">
          <div className="bg-white mt-6 px-6 py-3 rounded-lg flex items-center justify-between max-w-lg mx-auto shadow-xl z-20 border">
            <input
              type="text"
              placeholder="Search for assets..."
              className="bg-transparent outline-none w-full placeholder-[#6D737A]"
            />
            <FaSearch className="text-gray-400 ml-2" />
          </div>
        </div>
      </section>
      
      <div className="mt-28 px-4 md:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.title;
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedCategory(category.title);
                  setCurrentPage(1);
                }}
                className={`flex justify-between items-center p-3 w-full rounded-lg shadow-md transition 
                  ${isSelected ? "border-2 border-green-500 bg-white" : "bg-white"} 
                  hover:shadow-lg`}
              >
                <div className="flex gap-2 items-center">
                  <category.icon className="text-4xl text-gray-500 w-6 h-6" />
                  <span className="text-sm md:text-base">{category.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      

      {loading ? (
              <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading data...</span>
              </div>
            ) : error ? (
              <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex flex-col justify-center items-center h-64 text-red-500">
                <FaExclamationTriangle className="text-3xl mb-3" />
                <p className="text-lg font-medium">Error loading data</p>
                <p className="text-sm text-gray-600 mt-1">{error.message || "Please try again later"}</p>
              </div>
            ) : (
              <div className="p-4 px-40 mt-8">
              {currentCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-4 grid-rows-3 gap-8 h-[918px]">
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
                    <div className="flex justify-center mt-8">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${currentPage === number ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p>No courses found in this category.</p>
                </div>
              )}
            </div>
            )}





      <Footer />
    </div>
  );
};

export default Home;