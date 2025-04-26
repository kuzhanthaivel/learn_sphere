import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Header";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/creators/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      localStorage.setItem('creatorToken', data.token); 
      localStorage.setItem('isCreatorLoggedIn', true);

      navigate('/CreaorDashboard'); 

    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex justify-center flex-grow px-4 py-16">
        <div className="bg-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-md border relative h-[490px]">
          <div className="absolute bg-white w-full max-w-md p-10 rounded-2xl shadow-lg -top-4 -left-4 border-gray-200 border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#FF7F00] mb-2">LOG IN</h1>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-[#FF7F00] hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF7F00] hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/CretorSignup" className="font-semibold text-[#FF7F00] hover:underline transition-colors">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;