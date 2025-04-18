import React from "react";
import Navbar from "../components/Header";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import Image from "../assets/CoverImage1.png";
import SharableProfile from "../components/sharableProfile/page"

const ProfilePage = () => {
  return (
    <div className=" min-h-screen font-sans">
        <Navbar/>
                     <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6 px-6 py-5">
                       <button className="border border-gray-200 py-2 pl-3 pr-1  rounded-xl cursor-pointer text-black text-center "><MdArrowBackIos /></button>
                       <span className="">Your Sharable Profile</span>
                     </div>
            
        <div className=" px-24">
        <SharableProfile/>
        </div>
      
<div className="flex items-center justify-center py-6">
<button className="bg-red-400 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-500 transition">
      Copy the URL to share your profile in the socials
    </button>
</div>
          
        <Footer/>

    </div>
  );
};

export default ProfilePage;
