import React from "react";
import learnSphere from '../assets/learnSphere.png'
import lock from '../assets/Lock.png'
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white border border-b-gray-300 rounded-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2 ">
      <Link href="/">
        <img src={learnSphere} alt="Learn Sphere" width={120} height={40} /></Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden space-x-6 text-gray-700 md:flex">
        <Link href="/Home" className="font-medium text-green-600">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/">Profile</Link>
        <Link href="/Community">Community</Link>
        <Link href="/transaction">Chain Transaction</Link>
        <Link href="/">Setting</Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer rounded-xl "> <img src={lock} alt="Learn Sphere" className="w-5 h-5" />Login</button>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg cursor-pointer">Sign up</button>
        <div className="px-3 py-2 font-semibold bg-gradient-to-b from-[#20B486] to-[#FFC27A] rounded-lg bg-opacity-90">Tokens: 1470</div>
      </div>
    </nav>
  );
};

export default Navbar;
