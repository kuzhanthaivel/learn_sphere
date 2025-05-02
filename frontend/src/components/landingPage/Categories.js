import React, { useState } from "react";
import Categoriesimg from "../../assets/Categoriesimg.png";
import {
  PiPenNib, PiFileHtml, PiMicrophoneStageLight, PiBriefcaseLight,
  PiSunHorizonLight, PiCameraLight, PiMusicNoteLight, PiDatabaseLight,
  PiLightbulbLight, PiHeartbeatLight, PiGraphLight, PiDetectiveLight
} from "react-icons/pi";
import { BsArrowUpRightSquareFill } from "react-icons/bs";

const CategoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Design");

  const categories = [
    { title: "Design", icon: PiPenNib },
    { title: "Development", icon: PiFileHtml },
    { title: "Marketing", icon: PiMicrophoneStageLight },
    { title: "Business", icon: PiBriefcaseLight },
    { title: "Lifestyle", icon: PiSunHorizonLight },
    { title: "Photography", icon: PiCameraLight },
    { title: "Music", icon: PiMusicNoteLight },
    { title: "Data Science", icon: PiDatabaseLight },
    { title: "Personal Develop", icon: PiLightbulbLight },
    { title: "Health & Fitness", icon: PiHeartbeatLight },
    { title: "Finance", icon: PiGraphLight },
    { title: "Teaching", icon: PiDetectiveLight },
  ];

  return (
    <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 xl:px-60 bg-white">
      <div className="flex flex-col items-center sm:items-start">
        <img src={Categoriesimg} className="w-64 sm:w-80 md:w-96" alt="Categories" />
        <p className="text-gray-400 text-sm sm:text-base mt-2 text-center sm:text-left">
          Various versions have evolved over the years, sometimes by accident.
        </p>
      </div>
      <div className="mt-8 sm:mt-14 ">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.title;
            return (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.title)}
                className={`flex justify-between items-center p-3  rounded-lg shadow-md transition w-56
                  ${isSelected ? "border border-green-500 bg-white" : "bg-white"} 
                  hover:shadow-lg`}
              >
                <div className="flex gap-2 items-center">
                  <category.icon className="text-4xl text-gray-500 w-6 h-6" />
                  <span className="text-sm sm:text-base">{category.title}</span>
                </div>
                <BsArrowUpRightSquareFill
                  className={`text-2xl w-6 h-6 rounded-md 
                    ${isSelected ? "bg-white text-green-500" : "bg-green-500 text-white"}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;