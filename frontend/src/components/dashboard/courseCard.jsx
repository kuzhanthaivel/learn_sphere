import { FaArrowRight } from "react-icons/fa";
import Image from "../../assets/CoverImage3.png"

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 relative hover:shadow-lg transition">
      <span className="absolute top-3 left-3 bg-white px-3 py-1 text-xs rounded-full font-semibold text-gray-700 shadow">
        {course.category}
      </span>
      <img
        src={Image}
        alt={course.title}
        className="rounded-lg mt-6 h-40 w-full object-cover"
      />
      <h4 className="mt-4 font-medium text-sm text-gray-700 truncate">
        {/* {course.title} */} Introduction  to Web Development
      </h4>
      <div className="flex items-center mt-2 space-x-1 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(course.rating) ? "★" : "☆"}</span>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 bg-green-500 text-white rounded-full p-1 cursor-pointer hover:bg-green-600">
        <FaArrowRight size={14} />
      </div>
    </div>
  );
}
