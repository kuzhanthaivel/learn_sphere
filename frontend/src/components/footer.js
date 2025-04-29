import React from "react";
import learnSphere from '../assets/learnSphere.png'
import { FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-50 py-10 px-6 md:px-20 lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
         <img src={learnSphere} alt="Learn Sphere" width={120} height={40} />
          <h3 className="font-semibold mt-3">Contact Us</h3>
          <p className="text-gray-600 text-sm">Call: +1108 21 104 044</p>
          <p className="text-gray-600 text-sm">CTH road, Prakash Nagar, Nemilichery, Chennai - 602 024</p>
          <p className="text-gray-600 text-sm">Email: example@mail.com</p>
         <div className="flex gap-2 mt-4 text-[#20B486]">
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaFacebookF /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaDribbble /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaLinkedinIn /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaInstagram /> </a>
             <a href="https://facebook.com" className="text-xl cursor-pointer bg-[#E9F8F3] p-2 rounded-md  flex items-center justify-center"> <FaBehance /> </a>
         </div>
        </div>
        
        <div>
          <h3 className="font-semibold">Explore</h3>
          <ul className="text-gray-600 text-sm space-y-2 mt-3">
            <li>Home</li>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Community</li>
            <li>Chain Transaction</li>
            <li>Setting</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Category</h3>
          <ul className="text-gray-600 text-sm space-y-2 mt-3">
            <li>Design</li>
            <li>Development</li>
            <li>Marketing</li>
            <li>Business</li>
            <li>Lifestyle</li>
            <li>Photography</li>
            <li>Music</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Subscribe</h3>
          <p className="text-gray-600 text-sm mt-3">Join our mailing list to receive updates, course notifications, and exclusive insights right in your inbox.</p>
          <input type="email" placeholder="Email here" className="mt-3 p-2 w-full border rounded-md bg-gray-100 outline-none" />
          <button className="mt-3 bg-green-500 text-white py-2 px-4 rounded-md ">Subscribe Now</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
