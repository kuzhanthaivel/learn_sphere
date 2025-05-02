import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCertificateContract } from "../contractIntegration/Certificates";
import Navbar from "../components/Header";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';
import Image from '../assets/CoverImage1.png';

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
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState(null);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);

        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setWalletAddress(newAccounts[0]);
          } else {
            setWalletAddress("");
            setIsConnected(false);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        console.error("User rejected request:", error);
        if (error.code === 4001) {
          toast.error("Please connect to MetaMask to continue.");
        }
      }
    } else {
      toast.error("MetaMask is not installed. Please install it to use this feature.");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
  };

  const fetchCompletedSyllabus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/student/fetchCourseProgress', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: id })
      });

      if (!response.ok) throw new Error('Failed to fetch course progress');

      const data = await response.json();
      if (data.courseProgress?.syllabus) {
        const completedItems = data.courseProgress.syllabus
          .filter(item => item.Status === "Completed")
          .map(item => item.S_no);
        setChecked(completedItems);
        setCourseCompleted(data.courseProgress.syllabus.every(item => item.Status === "Completed"));
      }
    } catch (error) {
      console.error('Error fetching completed syllabus:', error);
    }
  };

  useEffect(() => {
    checkWalletConnection();
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/StreamCourse/${id}`, {
          headers: { 'Authorization': `Bearer ${studentToken}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch course data');
        }

        const data = await response.json();
        setCourseData(data);
        await fetchCompletedSyllabus();

        if (data.syllabus?.length > 0) {
          setCurrentVideo(data.syllabus[0]);
        }
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Authorization')) {
          navigate('/signin');
        } else if (err.message.includes('access')) {
          navigate(`/CourseBuying/${id}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (studentToken) fetchCourseData();
    else {
      setError('You need to log in to view this course');
      setLoading(false);
      navigate('/signin');
    }
  }, [id, studentToken, navigate]);

  const handleToggle = async (item) => {
    if (checked.includes(item.S_no)) return;

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

      if (result.courseCompleted) {
        setCourseCompleted(true);
        setCertificateDetails(result.certificateDetails);
        toast.success('Congratulations! You have completed the course!');

        if (isConnected) {
          await mintCertificateOnBlockchain(result.certificateDetails);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress: ' + error.message);
    }
  };

  const mintCertificateOnBlockchain = async (details) => {
    if (!details || !isConnected) return;

    setBlockchainLoading(true);
    try {
      const contract = await getCertificateContract();
      if (!contract) throw new Error("Failed to connect to blockchain");

      const tx = await contract.addCertificate(
        walletAddress,
        details.userName,
        details.profileImage || '',
        details.courseTitle,
        details.courseCategory,
        Math.floor(new Date(details.completionDate).getTime() / 1000),
        details.certificateId
      );

      await tx.wait();
      toast.success(`Certificate minted on blockchain! TX Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Blockchain transaction failed:", error);
      toast.warning("Certificate generated but not recorded on blockchain");
    } finally {
      setBlockchainLoading(false);
    }
  };

  const handleViewCertificate = () => {
    if (certificateDetails) {
      navigate(`/certificate/${certificateDetails.certificateId}`);
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
                src={`https://www.youtube.com/embed/${extractYouTubeID(currentVideo.videoUrl)}?modestbranding=1&controls=1`}
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
            <h2 className="text-xl font-bold mb-2">{currentVideo?.title || 'Course Content'}</h2>
            <p className="text-sm text-gray-600 font-semibold">
              {courseData.shortDescription}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-800">
              {courseData.fullDescription}
            </p>
          </div>
        </div>


        <div className="bg-white p-4 rounded-xl shadow-md w-full lg:w-[350px]">

          <div className="mt-4 border-t pt-4">
            {isConnected ? (
              <div className="mb-4 w-full ">
                <div className="px-3 h-12 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-evenly hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors">
                  <span className="text-sm font-medium text-green-800 truncate">
                    {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-3 mb-4 h-12 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90 flex items-center w-full justify-center hover:from-[#B0E5DB] hover:to-[#E5E2D4] transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <img src={Syllabus} alt="Syllabus" className="w-56" />
          </div>

          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {courseData.syllabus.map((item) => (
              <li key={item.S_no} className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors ${checked.includes(item.S_no) ? "bg-blue-50" : ""
                } ${currentVideo?.S_no === item.S_no ? "border-l-4 border-[#20B486]" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked.includes(item.S_no)}
                  onChange={() => handleToggle(item)}
                  disabled={checked.includes(item.S_no) || blockchainLoading}
                  className="h-4 w-4 rounded border-gray-300 text-[#20B486] focus:ring-[#20B486]"
                />
                <label
                  htmlFor={`syllabus-${item.S_no}`}
                  className="cursor-pointer flex-1"
                  onClick={() => setCurrentVideo(item)}
                >
                  <span className="font-medium">{item.S_no}. {item.title}</span>
                </label>
              </li>
            ))}
          </ul>

          {courseCompleted && (
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                <p className="font-semibold">Course Completed!</p>
                <p className="text-sm mt-1">You can now exchange this course</p>
                {certificateDetails && (
                  <button
                    onClick={handleViewCertificate}
                    className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    View Certificate
                  </button>
                )}
              </div>

              {!isConnected && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
                  <p className="text-sm">Connect your wallet to mint a blockchain certificate</p>
                </div>
              )}

              {blockchainLoading && (
                <div className="p-2 bg-blue-50 text-blue-800 text-sm rounded-lg text-center">
                  Processing blockchain transaction...
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <button
              className={`w-full py-2 rounded transition-colors mb-3 ${courseData.rentedCourse || !courseCompleted
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-[#20B486] hover:bg-[#1a9c72] text-white'
                }`}
              disabled={courseData.rentedCourse || !courseCompleted}
              onClick={() => navigate(`/CourseExchange/${id}`)}
            >
              {courseData.rentedCourse
                ? 'Already Rented'
                : courseCompleted
                  ? 'Exchange Course'
                  : 'Complete Course to Exchange'}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}