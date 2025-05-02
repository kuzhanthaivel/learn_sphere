import React from "react";
import landingImg3 from '../../assets/landingimg2.png';

const LearningJourney = () => {
  return (
    <div className="flex items-center justify-center py-8 sm:py-12 md:py-16 bg-[#F0FBF7] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-44">
      <div className="flex flex-col md:flex-row items-center justify-between rounded-xl gap-6 w-full max-w-7xl">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={landingImg3} 
            alt="Learning Journey"
            className="w-full max-w-md lg:max-w-lg xl:max-w-xl"
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left space-y-3 sm:space-y-4 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Start Your Learning Journey with a{" "}
            <span className="text-green-600">Smarter Platform</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Start your journey by registering now
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors duration-300 text-sm sm:text-base">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningJourney;