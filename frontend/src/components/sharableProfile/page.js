import React, {useState} from 'react'
import learnSphere from '../../assets/learnSphere.png'
import { FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance } from "react-icons/fa";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { FaSearch, FaStar, FaArrowUpRight } from "react-icons/fa";
import BgImage from '../../assets/bgleaderboard.png';
import Badges from '../../assets/badges and awards.png';
import level1 from '../../assets/level1.png';
import level2 from '../../assets/level2.png';
import level3 from '../../assets/level3.png';
import level4 from '../../assets/level4.png';
import level5 from '../../assets/level5.png';
import level6 from '../../assets/level6.png';
import level7 from '../../assets/level7.png';
import level8 from '../../assets/level8.png';
import level9 from '../../assets/level9.png';
import level10 from '../../assets/level10.png';
import level11 from '../../assets/level11.png';
import level12 from '../../assets/level12.png';
import level13 from '../../assets/level13.png';
import level14 from '../../assets/level14.png';
import level15 from '../../assets/level15.png';
import CoverImage1 from "../../assets/CoverImage1.png";
import CoverImage2 from "../../assets/CoverImage2.png";
import CoverImage3 from "../../assets/CoverImage3.png";
import Profile from "../../assets/Profile.png";
const CourseCard = ({ 
  id,
  category, 
  coverImage, 
  isSelected, 
  onClick, 
  title, 
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
        <div className="flex justify-start gap-1 items-center pt-2">
        </div>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        <span className="text-lg font-semibold">View Credetial</span>
        <BsArrowUpRightSquareFill
          className={`text-2xl w-6 h-6 rounded-md ${
            isSelected ? "bg-white text-green-500" : "bg-green-500 text-white"
          }`}
        />
      </div>
    </div>
  );
};

export default function Page() {
    const [selectedCourse, setSelectedCourse] = useState(null);
      const courses = [
        { 
          id: 1,
          title: "Introduction to Music Theory", 
          coverImage: CoverImage1,
          category: "Music", 
        },
        { 
          id: 2,
          title: "UI/UX Design Fundamentals", 
          coverImage: CoverImage2,
          category: "Design", 
        },
        { 
          id: 3,
          title: "Web Development Bootcamp", 
          coverImage: CoverImage3,
          category: "Development", 
        },
        { 
          id: 4,
          title: "Advanced Photography Techniques", 
          coverImage: CoverImage1,
          category: "Photography", 
        },
        { 
          id: 5,
          title: "Digital Marketing Masterclass", 
          coverImage: CoverImage2,
          category: "Marketing", 
        },
        { 
          id: 6,
          title: "Financial Planning Basics", 
          coverImage: CoverImage3,
          category: "Finance",
        },

      ];
  return (
    <div className='px-20 pt-10 bg-[#F0FBFF] rounded-xl'>
              {/*Navbar */}
      <div className='flex justify-between items-center  ' >
         <div className='flex items-center justify-between gap-16 ' >
            <a href="/">
              <img src={learnSphere} alt="Learn Sphere" className='w-40' />
            </a>
            <div className="flex gap-2  text-[#20B486]">
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaFacebookF /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaDribbble /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaLinkedinIn /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaInstagram /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaBehance /> </a>
         </div>
         </div>

         <div className="px-10 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex justify-evenly space-x-10">
             <a href="#">About</a>
             <a href="#">Batches & Leaderboard</a>
             <a href="#">Certificates</a>
         </div>
      </div>
              {/*profile */}
      <div className='flex justify-between items-center py-5 px-10 gap-8 '>   
         <div className='flex flex-col justify-between gap-5 w-1/2'>
            <span className='text-3xl font-bold'>Hi, I am Kuzhanthaivelu.</span>     
            <span className='text-gray-600 '>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</span>
         </div>
         <div className='flex justify-center items-center min-w-72 min-h-72 border rounded-full'>
         <img src={Profile} alt="Learn Sphere" className='rounded-full w-72 h-72 ' />
         </div>
      </div>
              {/*leaderboard and badges */}
      <div className='flex justify-center  items-center py-5 px-2 gap-4'>
          <div className='flex flex-col justify-between px-3 pt-2 gap-10 rounded-lg relative overflow-hidden '>
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
              <img src={BgImage} alt="Leaderboard background" className="w-full h-full object-cover" />
              <div className="absolute inset-0"></div>
            </div>
            
            <div className='text-white text-lg font-semibold flex items-center justify-center relative z-10'>
              <p>leaderboard</p>
            </div>
            <div className='flex text-white items-end relative z-10'>

              <div className='items-center flex justify-center  flex-col'>  
                    <div className='items-center flex justify-center '>
                       <img src={Profile} alt="Learn Sphere" className='w-14 h-14 rounded-full' />
                    </div>
                     <div className='flex flex-col justify-between items-center p-2 bg-[#FDAE38] rounded-t-lg h-36 w-24' >
                     <div className='flex flex-col items-center '>
                  <p className='font-bold '>One Piece</p>
                  <p className='text-sm'>1340 T</p>
                </div>
                <div className='text-3xl'>
                  <p>2</p>
                </div>
                     </div>
              </div>
              <div className='items-center flex justify-center  flex-col'>  
                    <div className='items-center flex justify-center '>
                       <img src={Profile} alt="Learn Sphere" className='w-14 h-14 rounded-full' />
                    </div>
                    <div className='flex flex-col justify-between items-center p-2 bg-[#F75435] rounded-t-lg h-44 w-24'>
                <div className='flex flex-col items-center '>
                  <p className='font-bold text-lg'>Naruto</p>
                  <p className='text-base'>1470 T</p>
                </div>
                <div className='text-4xl'>
                  <p>1</p>
                </div>
              </div>
              </div>
              <div className='items-center flex justify-center  flex-col'>  
                    <div className='items-center flex justify-center '>
                       <img src={Profile} alt="Learn Sphere" className='w-14 h-14 rounded-full' />
                    </div>
                    <div className='flex flex-col justify-between items-center p-2 bg-[#4FA3A5] rounded-t-lg h-28 w-24'>
                <div className='flex flex-col items-center gap-1 '>
                  <p className='font-bold line-clamp-1 text-sm'>Dragon Ball</p>
                  <p className='text-xs'>1340 T</p>
                </div>
                <div className='text-2xl'>
                  <p>3</p>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-evenly items-center '>
             <img src={Badges} alt="Learn Sphere" className='w-52' />
             <img src={level1} alt="Learn Sphere" className='w-28 ' />
             <img src={level2} alt="Learn Sphere" className='w-28 ' />
             <img src={level3} alt="Learn Sphere" className='w-28 ' />
             </div>
           <div className='flex justify-evenly items-center'>
             <img src={level4} alt="Learn Sphere" className='w-16 ' />
             <img src={level5} alt="Learn Sphere" className='w-16 ' />
             <img src={level6} alt="Learn Sphere" className='w-16 ' />
             <img src={level7} alt="Learn Sphere" className='w-14 ' />
             <img src={level8} alt="Learn Sphere" className='w-28 ' />
             <img src={level9} alt="Learn Sphere" className='w-28 ' />
             </div>
            <div className='flex justify-evenly items-center'>
             <img src={level10} alt="Learn Sphere" className='w-16  ' />
             <img src={level11} alt="Learn Sphere" className='w-16  ' />
             <img src={level12} alt="Learn Sphere" className='w-16  ' />
             <img src={level13} alt="Learn Sphere" className='w-16  ' />
             <img src={level14} alt="Learn Sphere" className='w-24  ' />
             <img src={level15} alt="Learn Sphere" className='w-24  ' />
             </div>
          </div>
      </div>
              {/*certificates */}
      <div className='px-10 py-5'>
      <div className="grid grid-cols-3  gap-8 h-[760px] mt-5 items-center ">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              coverImage={course.coverImage}
              category={course.category}
              price={course.price}
              isSelected={selectedCourse === course.id}
              onClick={() => setSelectedCourse(course.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}