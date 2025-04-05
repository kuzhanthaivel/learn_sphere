import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CourseCard from "./courseCard";
import { useState } from "react";

export default function CourseCarousel({ courses }) {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev >= courses.length - 4 ? prev : prev + 1));
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courses.slice(index, index + 4).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-3 mt-8">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={index >= courses.length - 4}
          className="p-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
