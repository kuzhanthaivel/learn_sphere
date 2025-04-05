import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header";
import Footer from "../components/footer";

export default function Login() {
  const [formData, setFormData] = useState({
    wallet: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const connectWallet = () => {
    // Replace with actual MetaMask logic
    alert("Wallet connected (mock)");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add login authentication logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 flex justify-center items-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border">
          <h2 className="text-center text-3xl font-bold text-orange-500 mb-6">LOGIN</h2>

          <div className="flex justify-center mb-6">
            <button
              className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm hover:bg-green-200"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="wallet"
              value={formData.wallet}
              onChange={handleChange}
              placeholder="Your wallet address"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Please Enter Your Password here"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            If you haven't Registed yet?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-orange-500 cursor-pointer hover:underline"
            >
              Register Now
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
