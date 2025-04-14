import React from "react";
import landingImg3 from '../../assets/landingimg2.png'

const LearningJourney = () => {
  return (
    <div className="flex items-center justify-center py-16 bg-white px-44 ">
      <div className="flex flex-col md:flex-row items-center bg-white  rounded-xl space-y-6 gap-6 ">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/2">
          <img
            src={landingImg3} // Replace with your image URL
            alt="Learning Journey"
            className=""
          />
        </div>

        {/* Right Section - Content */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Start Your Learning Journey with a{" "}
            <span className="text-green-600">Smarter Platform</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Start your journey by registering now
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;
