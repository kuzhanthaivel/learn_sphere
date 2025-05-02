import React, { useState, useEffect } from 'react'
import learnSphere from '../assets/learnSphere.png'
import { FaGithub, FaLinkedinIn, FaTwitterSquare } from "react-icons/fa";
import { GiSpiderWeb } from "react-icons/gi";
import { BsArrowUpRightSquareFill } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import BgImage from '../assets/bgleaderboard.png';
import Badges from '../assets/badges and awards.png';
import level1 from '../assets/level1.png';
import level2 from '../assets/level2.png';
import level3 from '../assets/level3.png';
import level4 from '../assets/level4.png';
import level5 from '../assets/level5.png';
import level6 from '../assets/level6.png';
import level7 from '../assets/level7.png';
import level8 from '../assets/level8.png';
import level9 from '../assets/level9.png';
import level10 from '../assets/level10.png';
import level11 from '../assets/level11.png';
import level12 from '../assets/level12.png';
import level13 from '../assets/level13.png';
import level14 from '../assets/level14.png';
import level15 from '../assets/level15.png';
import CoverImage1 from "../assets/CoverImage1.png";
import Profile from "../assets/Profile.png";

const CourseCard = ({
  id,
  category,
  coverImage,
  isSelected,
  onClick,
  title,
  completedAt,
  certificateID
}) => {
  const imageUrl = coverImage
    ? `http://localhost:5001/${coverImage.replace(/\\/g, '/')}`
    : CoverImage1;
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
          src={imageUrl}
          className="w-full h-32 object-cover"
          alt={`${title} course cover`}
        />
      </div>
      <div className="border-b border-gray-300 p-2">
        <p className="text-gray-800 font-medium line-clamp-1">{title}</p>
        <div className="flex justify-start gap-1 items-center pt-2">
          <p className="text-xs text-gray-500">Completed: {new Date(completedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full pt-2">
        <span className="text-lg font-semibold">View Credential</span>
        <BsArrowUpRightSquareFill
          className={`text-2xl w-6 h-6 rounded-md ${isSelected ? "bg-white text-green-500" : "bg-green-500 text-white"
            }`}
        />
      </div>
    </div>
  );
};




export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (id) {
          const response = await fetch('http://localhost:5001/api/student/shareProfile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: id })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch shared profile data');
          }

          const data = await response.json();
          setProfileData(data);
        }
        else {
          const studentToken = localStorage.getItem('studentToken');
          if (!studentToken) {
            throw new Error('No authentication token found');
          }

          const response = await fetch('http://localhost:5001/api/student/profile', {
            headers: {
              'Authorization': `Bearer ${studentToken}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }

          const data = await response.json();
          setProfileData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const getBadgeImage = (level, isUnlocked) => {
    const badgeImages = {
      level1: level1,
      level2: level2,
      level3: level3,
      level4: level4,
      level5: level5,
      level6: level6,
      level7: level7,
      level8: level8,
      level9: level9,
      level10: level10,
      level11: level11,
      level12: level12,
      level13: level13,
      level14: level14,
      level15: level15
    };

    const badgeWidths = {
      level1: 'w-20 sm:w-28',
      level2: 'w-20 sm:w-28',
      level3: 'w-20 sm:w-28',
      level4: 'w-12 sm:w-16',
      level5: 'w-12 sm:w-16',
      level6: 'w-12 sm:w-16',
      level7: 'w-10 sm:w-14',
      level8: 'w-20 sm:w-28',
      level9: 'w-20 sm:w-28',
      level10: 'w-12 sm:w-16',
      level11: 'w-12 sm:w-16',
      level12: 'w-12 sm:w-16',
      level13: 'w-12 sm:w-16',
      level14: 'w-16 sm:w-24',
      level15: 'w-16 sm:w-24'
    };

    return (
      <img
        src={badgeImages[level]}
        alt={level}
        className={`${badgeWidths[level]} hover:scale-105 ${!isUnlocked ? 'filter grayscale' : ''}`}
      />
    );
  };

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans flex justify-center items-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen font-sans flex justify-center items-center">
        <div>No profile data found</div>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return Profile;

    if (typeof imagePath !== 'string') return Profile;

    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }

    const filename = imagePath.replace(/^.*[\\]/, '');
    return `http://localhost:5001/uploads/${filename}`;
  };
  return (
    <div className='px-4 sm:px-10 lg:px-20 pt-5 sm:pt-10 bg-[#F0FBFF] rounded-xl'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-16'>
          <a href="/">
            <img src={learnSphere} alt="Learn Sphere" className='w-32 sm:w-40' />
          </a>
          <div className="flex gap-2 text-[#20B486]">
            <a href={profileData.profile?.socialLinks?.github || "#"} className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md flex items-center justify-center">
              <FaGithub />
            </a>
            <a href={profileData.profile?.socialLinks?.linkedin || "#"} className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md flex items-center justify-center">
              <FaLinkedinIn />
            </a>
            <a href={profileData.profile?.socialLinks?.twitter || "#"} className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md flex items-center justify-center">
              <FaTwitterSquare />
            </a>
            <a href={profileData.profile?.socialLinks?.portfolio || "#"} className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md flex items-center justify-center">
              <GiSpiderWeb />
            </a>
          </div>
        </div>

        <div className="px-4 py-2 sm:px-10 sm:py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex justify-evenly space-x-4 sm:space-x-10 text-sm sm:text-base">
          <a href="#">About</a>
          <a href="#">Batches & Leaderboard</a>
          <a href="#">Certificates</a>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row justify-between items-center py-5 px-2 sm:px-10 gap-8'>
        <div className='flex flex-col justify-between gap-5 w-full lg:w-1/2'>
          <span className='text-2xl sm:text-3xl font-bold'>Hi, I am {profileData.username}.</span>
          <span className='text-gray-600 text-sm sm:text-base'>
            {profileData.profile?.bio || 'No bio available'}
          </span>
        </div>
        <div className='flex justify-center items-center min-w-48 min-h-48 sm:min-w-72 sm:min-h-72 border rounded-full'>
          <img
            src={getImageUrl(profileData.profile?.image) || Profile}
            alt="Profile"
            className='rounded-full w-48 h-48 sm:w-72 sm:h-72 object-cover'
          />
        </div>
      </div>

      <div className='flex flex-col lg:flex-row justify-center items-center py-5 px-2 gap-4'>
        <div className='flex flex-col justify-between px-3 pt-2 gap-10 rounded-lg relative overflow-hidden w-full sm:w-auto mb-4 lg:mb-0'>
          <div className="absolute inset-0 z-0">
            <img src={BgImage} alt="Leaderboard background" className="w-full h-full object-cover" />
            <div className="absolute inset-0"></div>
          </div>

          <div className='text-white text-lg font-semibold flex items-center justify-center relative z-10'>
            <p>leaderboard</p>
          </div>

          <div className='flex text-white items-end relative z-10 justify-center'>
            {profileData.leaderboard.length > 1 && (
              <div className='items-center flex justify-center flex-col mx-1'>
                <div className='items-center flex justify-center'>
                  <img
                    src={getImageUrl(profileData.leaderboard[1].image)}
                    alt="Profile"
                    className='w-10 sm:w-14 h-10 sm:h-14 rounded-full'
                  />
                </div>
                <div className='flex flex-col justify-between items-center p-2 bg-[#FDAE38] rounded-t-lg h-24 sm:h-36 w-16 sm:w-24'>
                  <div className='flex flex-col items-center'>
                    <p className='font-bold text-xs sm:text-base line-clamp-1'>
                      {profileData.leaderboard[1].name}
                    </p>
                    <p className='text-xs'>{profileData.leaderboard[1].score}</p>
                  </div>
                  <div className='text-xl sm:text-3xl'>
                    <p>{profileData.leaderboard[1].place}</p>
                  </div>
                </div>
              </div>
            )}

            {profileData.leaderboard.length > 0 && (
              <div className='items-center flex justify-center flex-col mx-1'>
                <div className='items-center flex justify-center'>
                  <img
                    src={getImageUrl(profileData.leaderboard[0].image)}
                    alt="Profile"
                    className='w-10 sm:w-14 h-10 sm:h-14 rounded-full'
                  />
                </div>
                <div className='flex flex-col justify-between items-center p-2 bg-[#F75435] rounded-t-lg h-28 sm:h-44 w-16 sm:w-24'>
                  <div className='flex flex-col items-center'>
                    <p className='font-bold text-sm sm:text-lg line-clamp-0'>
                      {profileData.leaderboard[0].name}
                    </p>
                    <p className='text-xs sm:text-base'>{profileData.leaderboard[0].score}</p>
                  </div>
                  <div className='text-2xl sm:text-4xl'>
                    <p>{profileData.leaderboard[0].place}</p>
                  </div>
                </div>
              </div>
            )}

            {profileData.leaderboard.length > 2 && (
              <div className='items-center flex justify-center flex-col mx-1'>
                <div className='items-center flex justify-center'>
                  <img
                    src={getImageUrl(profileData.leaderboard[2].image)}
                    alt="Profile"
                    className='w-10 sm:w-14 h-10 sm:h-14 rounded-full'
                  />
                </div>
                <div className='flex flex-col justify-between items-center p-2 bg-[#4FA3A5] rounded-t-lg h-20 sm:h-28 w-16 sm:w-24'>
                  <div className='flex flex-col items-center gap-1'>
                    <p className='font-bold line-clamp-1 text-xs sm:text-sm'>
                      {profileData.leaderboard[2].name}
                    </p>
                    <p className='text-xs'>{profileData.leaderboard[2].score}</p>
                  </div>
                  <div className='text-xl sm:text-2xl'>
                    <p>{profileData.leaderboard[2].place}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2 w-full sm:w-auto'>
          <div className='flex flex-wrap justify-center items-center gap-2'>
            <img src={Badges} alt="Badges" className='w-40 sm:w-52' />
            {['level1', 'level2', 'level3'].map(level => (
              profileData.badges?.[level] !== undefined && (
                <div key={level}>
                  {getBadgeImage(level, profileData.badges[level])}
                </div>
              )
            ))}
          </div>
          <div className='flex flex-wrap justify-center items-center gap-2'>
            {['level4', 'level5', 'level6', 'level7', 'level8', 'level9'].map(level => (
              profileData.badges?.[level] !== undefined && (
                <div key={level}>
                  {getBadgeImage(level, profileData.badges[level])}
                </div>
              )
            ))}
          </div>
          <div className='flex flex-wrap justify-center items-center gap-2'>
            {['level10', 'level11', 'level12', 'level13', 'level14', 'level15'].map(level => (
              profileData.badges?.[level] !== undefined && (
                <div key={level}>
                  {getBadgeImage(level, profileData.badges[level])}
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <div className='px-2 sm:px-10 py-5'>
        <h2 className="text-2xl font-bold mb-4">Completed Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-5">
          {profileData.completedCourses?.map((course) => (
            <div key={course.certificateID} className="flex justify-center">
              <CourseCard
                id={course.certificateID}
                title={course.title}
                coverImage={course.coverImage}
                category={course.category}
                isSelected={selectedCourse === course.certificateID}
                onClick={() => setSelectedCourse(course.certificateID)}
                completedAt={course.completedAt}
                certificateID={course.certificateID}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}