import React from "react";
import learnSphere from '../assets/learnSphere.png'
import lock from '../assets/Lock.png'
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white border border-b-gray-300 rounded-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2 ">
      <a href="/">
        <img src={learnSphere} alt="Learn Sphere" width={120} height={40} /></a>
      </div>

      <div className="hidden space-x-6 text-gray-700 md:flex">
        <a href="/Home" className="font-medium text-green-600">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/Community">Community</a>
        <a href="/transaction">Chain Transaction</a>
        <a href="/Profile">Profile</a>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer rounded-xl  ">  <img src={lock} alt="lock" className="w-5 h-5" />         <a href="/signin">Login</a></button>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg cursor-pointer"><a href="/signup">Sign up</a></button>
        <div className="px-3 py-2 font-semibold bg-gradient-to-b from-[#C6EDE6] to-[#F2EFE4] rounded-lg bg-opacity-90">Coins: 1470</div>
      </div>
    </nav>
  );
};

export default Navbar;
