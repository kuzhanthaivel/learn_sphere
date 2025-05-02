import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verifyPassword: '',
    username: '',
    walletAddress: '',
    bio: '',
    image: null,
    github: '',
    linkedin: '',
    twitter: '',
    portfolio: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setWalletError('');

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }

        const walletAddress = accounts[0];
        setFormData(prev => ({ ...prev, walletAddress }));
      } else {
        throw new Error("MetaMask not installed");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletError(
        error.message === "MetaMask not installed"
          ? "Please install MetaMask to connect your wallet!"
          : "Failed to connect wallet. Please try again."
      );

      if (error.message === "MetaMask not installed") {
        window.open("https://metamask.io/download.html", "_blank");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.password !== formData.verifyPassword) {
      setSubmitError("Passwords don't match!");
      return;
    }

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('walletAddress', formData.walletAddress);
      formDataToSend.append('bio', formData.bio);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      formDataToSend.append('github', formData.github);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('twitter', formData.twitter);
      formDataToSend.append('portfolio', formData.portfolio);

      const response = await fetch('http://localhost:5001/api/students/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }
      console.log('Signup successful:', result);
      navigate('/signin');
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex justify-center flex-grow px-4 py-20">
        <div className="bg-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-2xl border relative h-[880px]">
          <div className="absolute bg-white w-full max-w-2xl p-8 rounded-2xl shadow-lg -top-4 -left-4 border-gray-200 border">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#FF7F00] mb-2">SIGN UP</h1>
              <p className="text-gray-600">Create your developer profile</p>
            </div>

            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {submitError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Username*</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="devUser123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email*</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password*</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Verify Password*</label>
                  <input
                    name="verifyPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.verifyPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                  <div className="flex gap-2">
                    <input
                      name="walletAddress"
                      type="text"
                      placeholder="0x..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="whitespace-nowrap bg-[#FF7F00] hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                  </div>
                  {walletError && (
                    <p className="text-red-500 text-xs mt-1">{walletError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">GitHub</label>
                  <input
                    name="github"
                    type="url"
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    name="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    name="twitter"
                    type="url"
                    placeholder="https://twitter.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Portfolio</label>
                  <input
                    name="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={formData.portfolio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#FF7F00] hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="font-semibold text-[#FF7F00] hover:underline transition-colors">
                Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;