import React, { useState } from 'react';
import { 
    PiPenNib, PiFileHtml, PiMicrophoneStageLight, PiBriefcaseLight, 
    PiSunHorizonLight, PiCameraLight, PiMusicNoteLight, PiDatabaseLight, 
    PiLightbulbLight, PiHeartbeatLight, PiGraphLight, PiDetectiveLight 
} from "react-icons/pi";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaSearch, FaStar, FaArrowUpRight } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/footer";
import Searchbackimage from '../assets/Searchbackimage.png';
import CoverImage1 from "../assets/CoverImage1.png";
import CoverImage2 from "../assets/CoverImage2.png";
import CoverImage3 from "../assets/CoverImage3.png";

const CourseCard = ({ 
  id,
  category, 
  coverImage, 
  isSelected, 
  onClick, 
  title, 
  description, 
  price,
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
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        <div className="flex justify-start gap-1 items-center pt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating}.0)</span>
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  const courses = [
    { 
      id: 1,
      title: "Introduction to Music Theory", 
      coverImage: CoverImage1,
      category: "Music", 
      description: "Learn the fundamentals of music theory and composition from industry professionals.", 
      price: "$49.99",
      rating: 4
    },
    { 
      id: 2,
      title: "UI/UX Design Fundamentals", 
      coverImage: CoverImage2,
      category: "Design", 
      description: "Master the principles of user interface and experience design with practical projects.", 
      price: "$59.99",
      rating: 5
    },
    { 
      id: 3,
      title: "Web Development Bootcamp", 
      coverImage: CoverImage3,
      category: "Development", 
      description: "Complete course covering HTML, CSS, JavaScript and modern frameworks.", 
      price: "$79.99",
      rating: 4
    },
    { 
      id: 4,
      title: "Advanced Photography Techniques", 
      coverImage: CoverImage1,
      category: "Photography", 
      description: "Take your photography skills to the next level with advanced techniques.", 
      price: "$39.99",
      rating: 3
    },
    { 
      id: 5,
      title: "Digital Marketing Masterclass", 
      coverImage: CoverImage2,
      category: "Marketing", 
      description: "Learn SEO, social media marketing, and content strategy from experts.", 
      price: "$69.99",
      rating: 4
    },
    { 
      id: 6,
      title: "Financial Planning Basics", 
      coverImage: CoverImage3,
      category: "Finance", 
      description: "Understand personal finance, investments, and retirement planning.", 
      price: "$45.99",
      rating: 5
    },
    { 
      id: 7,
      title: "Python for Data Science", 
      coverImage: CoverImage1,
      category: "Data Science", 
      description: "Learn Python programming and data analysis with real-world datasets.", 
      price: "$54.99",
      rating: 4
    },
    { 
      id: 8,
      title: "Mobile App Development with Flutter", 
      coverImage: CoverImage2,
      category: "Development", 
      description: "Build cross-platform mobile applications using Flutter framework.", 
      price: "$64.99",
      rating: 4
    },
    { 
      id: 9,
      title: "Graphic Design Mastery", 
      coverImage: CoverImage3,
      category: "Design", 
      description: "From basics to advanced techniques in Adobe Photoshop and Illustrator.", 
      price: "$49.99",
      rating: 5
    },
    { 
      id: 10,
      title: "Personal Productivity Workshop", 
      coverImage: CoverImage1,
      category: "Personal Develop", 
      description: "Boost your productivity with time management and organization skills.", 
      price: "$29.99",
      rating: 3
    },
    { 
      id: 11,
      title: "Yoga for Beginners", 
      coverImage: CoverImage2,
      category: "Health & Fitness", 
      description: "Start your yoga journey with basic poses and breathing techniques.", 
      price: "$34.99",
      rating: 4
    },
    { 
      id: 12,
      title: "Blockchain Fundamentals", 
      coverImage: CoverImage3,
      category: "Finance", 
      description: "Understand blockchain technology and cryptocurrency basics.", 
      price: "$59.99",
      rating: 4
    },
    { 
      id: 13,
      title: "Public Speaking Excellence", 
      coverImage: CoverImage1,
      category: "Personal Develop", 
      description: "Overcome stage fright and deliver powerful presentations.", 
      price: "$39.99",
      rating: 5
    },
    { 
      id: 14,
      title: "Machine Learning Basics", 
      coverImage: CoverImage2,
      category: "Data Science", 
      description: "Introduction to machine learning algorithms and applications.", 
      price: "$74.99",
      rating: 4
    },
    { 
      id: 15,
      title: "Video Editing with Premiere Pro", 
      coverImage: CoverImage3,
      category: "Photography", 
      description: "Professional video editing techniques for beginners.", 
      price: "$44.99",
      rating: 4
    },
    { 
      id: 16,
      title: "Entrepreneurship 101", 
      coverImage: CoverImage1,
      category: "Business", 
      description: "Learn how to start and grow your own business successfully.", 
      price: "$49.99",
      rating: 5
    },
    { 
      id: 17,
      title: "Nutrition for Weight Loss", 
      coverImage: CoverImage2,
      category: "Health & Fitness", 
      description: "Science-backed nutrition strategies for sustainable weight management.", 
      price: "$39.99",
      rating: 4
    },
    { 
      id: 18,
      title: "iOS App Development", 
      coverImage: CoverImage3,
      category: "Development", 
      description: "Build native iOS applications using Swift and Xcode.", 
      price: "$69.99",
      rating: 4
    },
    { 
      id: 19,
      title: "Content Writing Mastery", 
      coverImage: CoverImage1,
      category: "Marketing", 
      description: "Learn to create engaging content for websites and social media.", 
      price: "$34.99",
      rating: 3
    },
    { 
      id: 20,
      title: "Guitar for Beginners", 
      coverImage: CoverImage2,
      category: "Music", 
      description: "Start playing guitar with easy-to-follow lessons and exercises.", 
      price: "$29.99",
      rating: 4
    }
  ];

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

  // Filter courses by selected category
  const filteredCourses = courses.filter(course => 
    selectedCategory === "All" || course.category === selectedCategory
  );

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      
      <div className="p-4 px-40 mt-8">
        <div className="grid grid-cols-4 grid-rows-3 gap-8 h-[918px]">
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              coverImage={course.coverImage}
              category={course.category}
              description={course.description}
              price={course.price}
              rating={course.rating}
              isSelected={selectedCourse === course.id}
              onClick={() => setSelectedCourse(course.id)}
            />
          ))}
        </div>

        {/* Pagination controls */}
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
      </div>
      <Footer/>
    </div>
  );
}