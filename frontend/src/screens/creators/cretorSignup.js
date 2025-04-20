import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Header';
import { FiTwitter, FiInstagram, FiYoutube, FiGlobe, FiUpload } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';

export default function CreatorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    professionalName: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
    bio: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      website: ''
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      checkWalletConnection();
    }
  }, []);

  const checkWalletConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setFormData(prev => ({
          ...prev,
          walletAddress: accounts[0]
        }));
      }
    } catch (err) {
      console.error("Failed to check wallet connection:", err);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setFormData(prev => ({
          ...prev,
          walletAddress: accounts[0]
        }));
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialMedia = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialMedia]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.professionalName.trim()) {
      newErrors.professionalName = 'Professional name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('professionalName', formData.professionalName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('walletAddress', formData.walletAddress);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      
      if (profileImage) {
        formDataToSend.append('image', profileImage);
      }
      
      const response = await fetch('http://localhost:5001/api/creators/signup', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      navigate('/CreatorSignin');
    } catch (error) {
      console.error('Signup error:', error.message);
      setErrors(prev => ({
        ...prev,
        apiError: error.message || 'An error occurred during signup. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

<Navbar/>
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Creator Sign Up</h1>
            </div>
            
            <div className="p-6">
              {errors.apiError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
                  {errors.apiError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Name*</label>
                      <input
                        type="text"
                        name="professionalName"
                        value={formData.professionalName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your professional name"
                      />
                      {errors.professionalName && (
                        <p className="text-red-500 text-xs mt-1">{errors.professionalName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="walletAddress"
                          value={formData.walletAddress}
                          onChange={handleChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          readOnly={isWalletConnected}
                          placeholder="0x..."
                        />
                        <button
                          type="button"
                          onClick={connectWallet}
                          disabled={isWalletConnected}
                          className={`px-4 py-2 rounded-r-lg flex items-center ${isWalletConnected ? 'bg-green-100 text-green-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          <FaEthereum className="mr-1" />
                          {isWalletConnected ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            name="profileImage"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Social Links</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                            <FiTwitter className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="socialLinks.twitter"
                            value={formData.socialLinks.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                            <FiInstagram className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="socialLinks.instagram"
                            value={formData.socialLinks.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                            <FiYoutube className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="socialLinks.youtube"
                            value={formData.socialLinks.youtube}
                            onChange={handleChange}
                            placeholder="https://youtube.com/username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                            <FiGlobe className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="socialLinks.website"
                            value={formData.socialLinks.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/creator/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}