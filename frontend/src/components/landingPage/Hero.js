import React from "react";
import Heroimage from "../../assets/landingimg1.png";
const HeroSection = () => {
  return (
    <section className="flex items-center px-10 py-16 bg-white justify-evenly ">

      <div className="max-w-lg">
        <h3 className="text-xl font-semibold text-green-600">
          Empowering Learning, One Step at a Time
        </h3>
        <p className="mt-3 text-2xl font-medium leading-relaxed text-gray-800">
          Discover the future of education with course rentals, gamified
          learning experiences, community-driven collaboration, shareable
          profiles, and blockchain-secured credentials — all in one platform.
        </p>
        <button className="px-6 py-3 mt-6 text-white transition duration-300 bg-green-500 rounded-lg shadow-lg hover:bg-green-600">
          Get Started
        </button>
      </div>

      <div className="relative flex mt-10 space-x-6 lg:mt-0">
          <img src={Heroimage} alt="Learn Sphere" className="w-[600px] " />
      </div>
    </section>
  );
};

export default HeroSection;
