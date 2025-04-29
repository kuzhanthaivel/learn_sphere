import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import learnSphere from '../assets/learnSphere.png';
import lock from '../assets/Lock.png';
import defaultProfile from '../assets/defaultProfile.png';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [authStatus, setAuthStatus] = useState('loading'); 
  const [studentData, setStudentData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStudentAuthStatus = async () => {
      const studentToken = localStorage.getItem('studentToken');
    
      if (!studentToken) {
        clearStudentAuth();
        setAuthStatus('loggedOut');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:5001/api/students/me', {
          headers: {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': 'application/json'
          }
        });
          
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setStudentData(data.student);
        setAuthStatus('loggedIn');
        localStorage.setItem('isStudentLoggedIn', 'true');
      } catch (error) {
        console.error('Error checking auth status:', error);
        clearStudentAuth();
        setAuthStatus('loggedOut');
      }
    };
    
    checkStudentAuthStatus();
  }, []);

  const clearStudentAuth = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('isStudentLoggedIn');
    setStudentData(null);
  };

  const handleLogout = () => {
    clearStudentAuth();
    setAuthStatus('loggedOut');
    navigate('/signin');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultProfile;
    
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const filename = imagePath.replace(/^.*[\\\/]/, '');
    
    return `http://localhost:5001/uploads/${filename}`;
  };

  if (authStatus === 'loading') {
    return (
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300 rounded-lg md:px-20">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={learnSphere} alt="Learn Sphere" width={120} height={40} />
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300 rounded-lg md:px-20">

      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={learnSphere} alt="Learn Sphere" width={120} height={40} />
        </Link>
      </div>

      <button 
        className="md:hidden focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )   :  (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {authStatus === 'loggedIn' && (
        <div className="hidden space-x-6 text-gray-700 md:flex">
          <NavLink to="/Home"       className={({ isActive }) => 
        isActive ? "font-medium text-green-600" : "font-medium text-gray-700"
      }>Home</NavLink>
          <NavLink to="/dashboard"       className={({ isActive }) => 
        isActive ? "font-medium text-green-600" : "font-medium text-gray-700"
      }>Dashboard</NavLink>
          <NavLink to="/Community"       className={({ isActive }) => 
        isActive ? "font-medium text-green-600" : "font-medium text-gray-700"
      }>Community</NavLink>
          <NavLink to="/transaction"       className={({ isActive }) => 
        isActive ? "font-medium text-green-600" : "font-medium text-gray-700"
      }>Chain Transaction</NavLink>
          <NavLink to="/Profile"       className={({ isActive }) => 
        isActive ? "font-medium text-green-600" : "font-medium text-gray-700"
      }>Profile</NavLink>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 z-20 flex flex-col items-center py-4 mt-2 space-y-4 bg-white border-b border-gray-200 top-16 md:hidden">
          {authStatus === 'loggedIn' && (
            <>
              <Link to="/Home" className="font-medium text-green-600" onClick={() => setMobileMenuOpen(false)} >Home</Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/Community" onClick={() => setMobileMenuOpen(false)}>Community</Link>
              <Link to="/transaction" onClick={() => setMobileMenuOpen(false)}>Chain Transaction</Link>
              <Link to="/Profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            </>
          )}
          {authStatus === 'loggedIn' ? (
            <button onClick={handleLogout} className="text-red-500">Sign Out</button>
          ) : (
            <>
              <Link to="/signin" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img src={lock} alt="lock" className="w-5 h-5" />
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600" onClick={() => setMobileMenuOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}

      <div className="items-center hidden space-x-4 md:flex">
        {authStatus === 'loggedIn' ? (
          <div className="flex items-center space-x-4">
            <div className="px-3 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg">
              Coins: {studentData?.coins || 0}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User profile"
              >
                <img 
                  src={getImageUrl(studentData?.profile?.image)} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
                <span className="hidden md:inline">
                  {studentData?.name || studentData?.username || 'Student'}
                </span>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to="/signin" className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">
              <img src={lock} alt="lock" className="w-5 h-5" />
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;