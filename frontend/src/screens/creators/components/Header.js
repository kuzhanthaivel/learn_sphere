import React from "react";
import learnSphere from '../../../assets/learnSphere.png'
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white border border-b-gray-300 rounded-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2 ">
      <a href="/">
        <img src={learnSphere} alt="Learn Sphere" width={120} height={40} /></a>
      </div>

      <div className="hidden space-x-6 text-gray-700 md:flex">
        <a href="/CreateCourse" className="font-medium text-green-600">Create course</a>
        <a href="/CreaorDashboard">Dashboard</a>
        <a href="/Community">Community</a>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer rounded-xl  ">  <a href="/CreatorSignin">Login</a></button>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg cursor-pointer"><a href="/CretorSignup">Sign up</a></button>
      </div>
    </nav>
  );
};

export default Navbar;
