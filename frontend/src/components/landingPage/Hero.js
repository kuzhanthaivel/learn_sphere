import React from "react";
import Heroimage from "../../assets/landingimg1.png";

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse items-center px-4 py-8 bg-white md:flex-row md:justify-evenly md:px-8 lg:px-10 lg:py-16">
      <div className="max-w-full md:max-w-lg mt-8 md:mt-0">
        <h3 className="text-lg font-semibold text-green-600 md:text-xl">
          Empowering Learning, One Step at a Time
        </h3>
        <p className="mt-3 text-lg font-medium leading-relaxed text-gray-800 md:text-xl">
          Discover the future of education with course rentals, gamified
          learning experiences, community-driven collaboration, shareable
          profiles, and blockchain-secured credentials — all in one platform.
        </p>
        <button className="px-4 py-2 mt-4 text-white transition duration-300 bg-green-500 rounded-lg shadow-lg md:px-6 md:py-3 md:mt-6 hover:bg-green-600">
          Get Started
        </button>
      </div>

      <div className="relative flex justify-center w-full md:w-auto">
        <img 
          src={Heroimage} 
          alt="Learn Sphere" 
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[600px]" 
        />
      </div>
    </section>
  );
};

export default HeroSection;