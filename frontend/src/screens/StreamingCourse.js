import Navbar from "../components/Header";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';
import { useParams, useNavigate } from 'react-router-dom';
import Image from '../assets/CoverImage1.png'

export default function StreamingCourse() {
  const [checked, setChecked] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const studentToken = localStorage.getItem('studentToken');

  const fetchCompletedSyllabus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/student/fetchCourseProgress', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch course progress');
      }

      const data = await response.json();
      if (data.courseProgress && data.courseProgress.syllabus) {
        const completedItems = data.courseProgress.syllabus
          .filter(item => item.Status === "Completed")
          .map(item => item.S_no);
        setChecked(completedItems);
        const allCompleted = data.courseProgress.syllabus.every(item => item.Status === "Completed");
        setCourseCompleted(allCompleted);
      }
    } catch (error) {
      console.error('Error fetching completed syllabus:', error);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/StreamCourse/${id}`, {
          headers: {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch course data');
        }

        const data = await response.json();
        setCourseData(data);
        
        await fetchCompletedSyllabus();

        if (data.syllabus && data.syllabus.length > 0) {
          setCurrentVideo(data.syllabus[0]);
        }
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Authorization') || err.message.includes('token')) {
          navigate('/signin');
        } else if (err.message.includes('access')) {
          navigate(`/CourseBuying/${id}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (studentToken) {
      fetchCourseData();
    } else {
      setError('You need to log in to view this course');
      setLoading(false);
      navigate('/signin');
    }
  }, [id, studentToken, navigate]);

  const handleToggle = async (item) => {
    if (checked.includes(item.S_no)) {
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/student/update-progress', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: id,
          S_no: item.S_no,
          title: item.title
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update progress');
      }
  
      const result = await response.json();
      
      setChecked(prev => [...prev, item.S_no]);

      if (courseData?.syllabus?.every(syllabusItem => 
        [...checked, item.S_no].includes(syllabusItem.S_no)
      )) {
        setCourseCompleted(true);
        alert('Congratulations! You have completed the entire course!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress: ' + error.message);
    }
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <div className="animate-pulse text-gray-600">Loading course data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <div className="text-red-500">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <div className="text-gray-600">Course not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = courseData.coverImage 
    ? `http://localhost:5001/${courseData.coverImage.replace(/\\/g, '/')}`
    : Image;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="py-5 px-6">
        <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="border border-gray-200 py-2 pl-3 pr-1 rounded-xl cursor-pointer text-black text-center"
          >
            <MdArrowBackIos />
          </button>
          <span>{courseData.title}</span> 
          {courseCompleted && (
            <span className="bg-green-500 text-white text-sm py-1 px-3 rounded-full">
              Completed
            </span>
          )}
          <span className="border text-gray-700 text-sm py-2 px-4 border-gray-700 rounded-lg">
            {courseData.category}
          </span> 
          {courseData.rentedCourse && (
            <span className="text-sm text-orange-500">
              (Rental expires: {new Date(courseData.expiryDate).toLocaleDateString()})
            </span>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto pb-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-9">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden shadow-xl">
            {currentVideo?.videoUrl && extractYouTubeID(currentVideo.videoUrl) ? (
              <iframe
                className="w-full h-[400px]"
                src={`https://www.youtube.com/embed/${extractYouTubeID(currentVideo.videoUrl)}?modestbranding=0&controls=0`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                controls
                className="w-full h-[400px] object-cover p-2"
                poster={imageUrl}
              >
                {currentVideo?.videoFile && (
                  <source src={currentVideo.videoFile} type="video/mp4" />
                )}
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 font-semibold">
              {courseData.shortDescription}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-800">
              {courseData.fullDescription}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md w-[350px]">
          <div className="flex items-center space-x-2">
            <img src={Syllabus} alt="Learn Sphere" className="w-60" />
          </div>

          <ul className="space-y-2">
            {courseData.syllabus.map((item) => (
              <li
                key={item.S_no}
                className={`flex border-t items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                  checked.includes(item.S_no) ? "bg-blue-100" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(item.S_no)}
                  onChange={() => handleToggle(item)}
                  id={`syllabus-${item.S_no}`}
                  disabled={checked.includes(item.S_no)}
                />
                <label 
                  htmlFor={`syllabus-${item.S_no}`} 
                  className="cursor-pointer"
                  onClick={() => setCurrentVideo(item)}
                >
                  {item.title}
                </label>
              </li>
            ))}
          </ul>
          {courseCompleted && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
              You've completed this course!
            </div>
          )}
<div className="relative mt-9">
  <button 
    className={`w-full py-2 rounded transition-colors ${
      courseData.rentedCourse || !courseCompleted
        ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
        : 'bg-green-500 hover:bg-green-600 text-white'
    }`}
    disabled={courseData.rentedCourse || !courseCompleted}
    onClick={() => {
      navigate(`/CourseExchange/${id}`);
      console.log('Exchange initiated for course:', id);
    }}
  >
    {courseData.rentedCourse 
      ? 'Already Rented' 
      : courseCompleted 
        ? 'Exchange' 
        : 'Complete Course to Exchange'}
  </button>
  
  {!courseData.rentedCourse && !courseCompleted && (
    <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
      Complete all lessons to exchange this course
    </div>
  )}
</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}