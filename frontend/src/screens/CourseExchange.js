import Navbar from "../components/Header";
import Footer from "../components/footer";
import Image from "../assets/CoverImage1.png";
import React, { useState, useEffect } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseExchange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentToken = localStorage.getItem('studentToken');
  const [courseData, setCourseData] = useState(null);
  const [exchangeCode, setExchangeCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeLoading, setCodeLoading] = useState(true);
  const [codeError, setCodeError] = useState(null);
  const [friendCode, setFriendCode] = useState('');
  const [exchangeStatus, setExchangeStatus] = useState({
    loading: false,
    error: null,
    success: null
  });
  const [exchangeRequest, setExchangeRequest] = useState(null);
  const [requestLoading, setRequestLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await fetch(`http://localhost:5001/api/fetchById/${id}`);
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course data');
        }
        const courseData = await courseResponse.json();
        setCourseData(courseData);

        if (studentToken) {
          try {
            const codeResponse = await fetch(`http://localhost:5001/api/student/fetchMYExchangeCode/${id}`, {
              headers: {
                'Authorization': `Bearer ${studentToken}`
              }
            });
            
            const codeData = await codeResponse.json();
            
            if (!codeResponse.ok) {
              throw new Error(codeData.error || 'Failed to fetch exchange code');
            }
            
            if (codeData.success) {
              setExchangeCode(codeData.code);
            } else {
              setExchangeCode(null);
            }

            const requestResponse = await fetch(`http://localhost:5001/api/fetchExchangeRequest?code=${codeData.code || ''}`, {
              headers: {
                'Authorization': `Bearer ${studentToken}`
              }
            });

            const requestData = await requestResponse.json();
            
            if (!requestResponse.ok) {
              throw new Error(requestData.error || 'Failed to fetch exchange requests');
            }

            const relevantRequest = requestData.find(req => 
              req.initiatorCode === codeData.code || req.receiverCode === codeData.code
            );
            
            setExchangeRequest(relevantRequest || null);
          } catch (err) {
            setCodeError(err.message);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setCodeLoading(false);
        setRequestLoading(false);
      }
    };

    fetchData();
  }, [id, studentToken, exchangeStatus.success]);

  const handleExchangeRequest = async () => {
    if (!exchangeCode || !friendCode) {
      setExchangeStatus({
        loading: false,
        error: 'Both codes are required',
        success: null
      });
      return;
    }

    setExchangeStatus({
      loading: true,
      error: null,
      success: null
    });

    try {
      const response = await fetch('http://localhost:5001/api/createExchangeRequst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          initiatorCode: exchangeCode,
          receiverCode: friendCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create exchange request');
      }

      setExchangeStatus({
        loading: false,
        error: null,
        success: 'Exchange request created successfully!'
      });
      setFriendCode('');
    } catch (err) {
      setExchangeStatus({
        loading: false,
        error: err.message,
        success: null
      });
    }
  };
  
  const isInitiator = exchangeRequest?.isInitiator;

  const handleCancelRequest = async () => {
    if (!exchangeRequest) return;
  
    setExchangeStatus({
      loading: true,
      error: null,
      success: null
    });
  
    try {
      const response = await fetch('http://localhost:5001/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          requestId: exchangeRequest._id,
          userType: isInitiator ? 'initiator' : 'receiver',
          status: 'Canceled'
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel exchange request');
      }
  
      setExchangeStatus({
        loading: false,
        error: null,
        success: 'Exchange request canceled successfully!'
      });

      setExchangeRequest({ ...exchangeRequest, status: 'Canceled' });
    } catch (err) {
      setExchangeStatus({
        loading: false,
        error: err.message,
        success: null
      });
    }
  };
  
  const handleAcceptRequest = async () => {
    if (!exchangeRequest) return;
  
    setExchangeStatus({
      loading: true,
      error: null,
      success: null
    });
  
    try {
      const response = await fetch('http://localhost:5001/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          requestId: exchangeRequest._id,
          userType: 'receiver', 
          status: 'Accepted'
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept exchange request');
      }
  
      setExchangeStatus({
        loading: false,
        error: null,
        success: 'Course exchange completed successfully!'
      });

      setExchangeRequest(null);

       navigate('dashboard'); 
    } catch (err) {
      setExchangeStatus({
        loading: false,
        error: err.message,
        success: null
      });
    }
  };

  if (loading) return (
    <div className="w-full mx-auto bg-white p-4 rounded-lg scale-95 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading data...</span>
    </div>
  );
  
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!courseData) return <div className="text-center py-10">Course not found</div>;

  const imageUrl = courseData.coverImage 
    ? `http://localhost:5001/${courseData.coverImage.replace(/\\/g, '/')}`
    : Image;

  const showRequestUI = exchangeRequest && exchangeRequest.status === 'notResponded';

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="py-5 px-6 ">
        <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="border border-gray-200 py-2 pl-3 pr-1 rounded-xl cursor-pointer text-black text-center"
          >
            <MdArrowBackIos />
          </button>
          <span>{courseData.title}</span>
          <span className="border text-gray-700 text-sm py-2 px-4 border-gray-700 rounded-lg">
            {courseData.category}
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-xs text-gray-500 font-semibold mb-2">
              {courseData.shortDescription}
            </p>
            <p className="text-lg font-semibold">
              {courseData.fullDescription}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <img src={Syllabus} alt="Syllabus" className="w-60" />
            </div>
            <div className="flex flex-col">
              <div className="flex text-gray-600 border-b pb-2 mb-2">
                <div className="w-1/4 font-semibold">S.No</div>
                <div className="w-3/4 font-semibold">Title</div>
              </div>
              {courseData.syllabus.map((item, index) => (
                <div key={index} className="flex text-sm text-gray-800 border-b pb-2 mb-2">
                  <div className="w-1/4 font-bold">{item.S_no || index + 1}</div>
                  <div className="w-3/4 font-bold">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-80">
          <img
            src={imageUrl}
            alt="Course"
            className="w-full rounded-md mb-4"
          />
          <div className="flex justify-evenly mb-3">
            <button className="px-4 py-1 text-green-600 border-b-2 border-green-500 font-medium">
              Exchange
            </button>
          </div>

          <div className="flex-col flex gap-3">
            <p className="text-sm mb-4 text-center font-bold">
              Unlock the full course and gain lifetime access to all materials.
            </p>
            
            <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
              <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                Your Exchange code
              </label>
              {codeLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : codeError ? (
                <p className="text-red-500 text-sm">{codeError}</p>
              ) : exchangeCode ? (
                <p className="w-full bg-transparent outline-none appearance-none">
                  {exchangeCode}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">No exchange code available</p>
              )}
            </div>
            
            {showRequestUI && (
              <>
                <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                  <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                    {isInitiator ? "Receiver's code" : "Initiator's code"}
                  </label>
                  <p className="w-full bg-transparent outline-none appearance-none">
                    {isInitiator ? exchangeRequest.receiverCode : exchangeRequest.initiatorCode}
                  </p>
                </div>

                <div className="flex gap-2">
                  {isInitiator ? (
                    <button 
                      className={`w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-all duration-200 ${
                        exchangeStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={exchangeStatus.loading}
                      onClick={handleCancelRequest}
                    >
                      {exchangeStatus.loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Cancel Request'
                      )}
                    </button>
                  ) : (
                    <>
                      <button 
                        className={`flex-1 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-all duration-200 ${
                          exchangeStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={exchangeStatus.loading}
                        onClick={handleCancelRequest}
                      >
                        Cancel
                      </button>
                      <button 
                        className={`flex-1 bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-all duration-200 ${
                          exchangeStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={exchangeStatus.loading}
                        onClick={handleAcceptRequest}
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {!showRequestUI && (
              <>
                <div className="mb-4 border relative rounded-lg border-2 p-2 mt-3">
                  <label className="block text-sm font-medium text-gray-700 absolute bg-white -top-3 px-1">
                    Your friend exchange code
                  </label>
                  <input
                    className="w-full bg-transparent outline-none appearance-none"
                    placeholder="Enter friend's code"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value)}
                  />
                </div>
                
                {exchangeStatus.error && (
                  <div className="text-red-500 text-sm mb-2">{exchangeStatus.error}</div>
                )}
                {exchangeStatus.success && (
                  <div className="text-green-500 text-sm mb-2">{exchangeStatus.success}</div>
                )}
                
                <button 
                  className={`w-full bg-[#20B486] text-white p-3 rounded hover:bg-green-600 transition-all duration-200 ${
                    !exchangeCode || exchangeStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!exchangeCode || exchangeStatus.loading}
                  onClick={handleExchangeRequest}
                >
                  {exchangeStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Exchange'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}