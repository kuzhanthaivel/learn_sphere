import React from "react";
import featuresImg from "../../assets/features.png";

const FeaturesSection = () => {
  return (
    <section className="py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-40 bg-[#FFFAF5]">
      <div className="flex">
        <img src={featuresImg} className="w-96" alt="Features" />
      </div>

      <div className="mt-8 md:mt-14 space-y-8 md:space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="max-w-full md:max-w-xl order-2 md:order-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Course <span className="text-green-500">Renting</span>, Exchange, and Purchase
            </h3>
            <p className="text-gray-600 mt-2 text-base sm:text-lg md:text-xl">
              A unique platform that allows learners to rent, exchange, or buy courses based on their needs and budget, fostering affordability and accessibility.
            </p>
          </div>
          <div className="flex justify-center items-center w-40 md:w-80 h-16 md:h-24 order-1 md:order-2">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-[#33C1EE] to-[#cfd5d7] bg-clip-text text-transparent">
              1
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex justify-center items-center w-40 md:w-80 h-16 md:h-24 order-1">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-[#33C1EE] to-[#cfd5d7] bg-clip-text text-transparent">
              2
            </span>
          </div>
          <div className="max-w-full md:max-w-xl order-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-green-500">Gamification</span> in Education
            </h3>
            <p className="text-gray-600 mt-2 text-base sm:text-lg md:text-xl">
              Engage and motivate learners with leaderboards, badges, and tokens awarded for activities. Tokens can be reused for renting courses, creating a rewarding ecosystem.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="max-w-full md:max-w-xl order-2 md:order-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Integrated <span className="text-green-500">Community</span> Platform
            </h3>
            <p className="text-gray-600 mt-2 text-base sm:text-lg md:text-xl">
              Automatically join a course-specific community upon enrollment, enabling real-time discussions and collaboration with peers and instructors.
            </p>
          </div>
          <div className="flex justify-center items-center w-40 md:w-80 h-16 md:h-24 order-1 md:order-2">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-[#33C1EE] to-[#cfd5d7] bg-clip-text text-transparent">
              3
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex justify-center items-center w-40 md:w-80 h-16 md:h-24 order-1">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-[#33C1EE] to-[#cfd5d7] bg-clip-text text-transparent">
              4
            </span>
          </div>
          <div className="max-w-full md:max-w-xl order-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Shareable <span className="text-green-500">Profiles</span> for Achievements
            </h3>
            <p className="text-gray-600 mt-2 text-base sm:text-lg md:text-xl">
              Showcase your milestones, badges, and completed courses through a personalized, shareable profile, enhancing your online presence and credibility.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="max-w-full md:max-w-xl order-2 md:order-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Blockchain-Powered <span className="text-green-500">Security</span>
            </h3>
            <p className="text-gray-600 mt-2 text-base sm:text-lg md:text-xl">
              Ensure transparency and reliability in course transactions and achievement verification using blockchain technology.
            </p>
          </div>
          <div className="flex justify-center items-center w-40 md:w-80 h-16 md:h-24 order-1 md:order-2">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-[#33C1EE] to-[#cfd5d7] bg-clip-text text-transparent">
              5
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;