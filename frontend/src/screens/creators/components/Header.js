import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import learnSphere from '../../../assets/learnSphere.png';
import lock from '../../../assets/Lock.png';
import defaultProfile from '../../../assets/defaultProfile.png';

const Navbar = () => {
  const [authStatus, setAuthStatus] = useState('loading');
  const [creatorData, setCreatorData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkCreatorAuthStatus = async () => {
      const creatorToken = localStorage.getItem('creatorToken');
    
      if (!creatorToken) {
        clearCreatorAuth();
        setAuthStatus('loggedOut');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:5001/api/creator/me', {
          headers: {
            'Authorization': `Bearer ${creatorToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          clearCreatorAuth();
          setAuthStatus('loggedOut');
          return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setCreatorData(data.creator);
        setAuthStatus('loggedIn');
        localStorage.setItem('isCreatorLoggedIn', 'true');
      } catch (error) {
        console.error('Error checking auth status:', error);
        clearCreatorAuth();
        setAuthStatus('loggedOut');
      }
    };
    
    checkCreatorAuthStatus();
  }, []);

  const clearCreatorAuth = () => {
    localStorage.removeItem('creatorToken');
    localStorage.removeItem('isCreatorLoggedIn');
    setCreatorData(null);
  };

  const handleLogout = () => {
    clearCreatorAuth();
    setAuthStatus('loggedOut');
    window.location.href = '/signin';
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
      <nav className="flex items-center justify-between px-20 py-3 bg-white border border-b-gray-300 rounded-lg">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={learnSphere} alt="Learn Sphere" width={120} height={40} />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white border border-b-gray-300 rounded-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={learnSphere} alt="Learn Sphere" width={120} height={40} />
        </Link>
      </div>

      {/* Navigation Links */}
      {authStatus === 'loggedIn' && (
        <div className="hidden space-x-6 text-gray-700 md:flex">
          <Link to="/CreateCourse" className="font-medium text-green-600">Create Course</Link>
          <Link to="/CreaorDashboard">Dashboard</Link>
          <Link to="/Community">Community</Link>
        </div>
      )}

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {authStatus === 'loggedIn' ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img 
                  src={getImageUrl(creatorData?.profile?.image)} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
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
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer rounded-xl">
              <Link to="/CreatorSignin" className="flex items-center gap-2">
                <img src={lock} alt="lock" className="w-5 h-5" />
                Login
              </Link>
            </button>
            <button className="px-4 py-2 text-white bg-green-500 rounded-lg cursor-pointer">
              <Link to="/CreatorSignup">Sign up</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;