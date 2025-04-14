import Navbar from "../components/Header";
import { useState } from "react";
import Footer from "../components/footer";
import { MdArrowBackIos } from "react-icons/md";
import Syllabus from '../assets/syllabus.png';

const courseData = {
  title: "Advanced React Development",
  shortDescription: "Master React hooks, context API, and advanced patterns",
  fullDescription: "This comprehensive course takes you through advanced React concepts including hooks, context API, performance optimization, and state management. You'll build real-world applications and learn best practices from industry experts.",
  category: "Development",
  rating: 4,
  reviewCount: 102,
  syllabus: [
    { id: 1, title: "React Fundamentals Recap" },
    { id: 2, title: "Deep Dive into React Hooks" },
    { id: 3, title: "Context API and State Management" },
    { id: 4, title: "Performance Optimization Techniques" },
    { id: 5, title: "Server-Side Rendering with Next.js" },
    { id: 6, title: "Testing React Applications" },
    { id: 7, title: "Building a Complete Project" }
  ]
};

export default function StreamingCourse() {
  const [checked, setChecked] = useState([]);

  const handleToggle = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
            <div className="py-5 px-6 ">
              <div className="flex items-center space-x-2 text-[#20B486] font-semibold text-xl mb-6">
                <button className="border border-gray-200 py-2 pl-3 pr-1  rounded-xl cursor-pointer text-black text-center "><MdArrowBackIos /></button>
                <span>{courseData.title}</span> 
                <span className=" border text-gray-700 text-sm py-2 px-4 border-gray-700 rounded-lg">{courseData.category}</span> 

              </div>
            </div>
      <div className="max-w-7xl mx-auto pb-6 px-4  grid grid-cols-1 lg:grid-cols-3 gap-9">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden shadow-xl rounded-xl" >
            <video
              controls
              className="w-full h-[400px] object-cover p-2 "
              poster="https://dummyimage.com/720x400"
            >
              <source src="/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 font-semibold">
              {courseData.shortDescription}
            </p>
            <p className="mt-2 text-lg font-medium text-gray-800">
              {courseData.fullDescription}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md w-[350px]">

                  <div className="flex items-center space-x-2 ">
                    <img src={Syllabus} alt="Learn Sphere" className="w-60" />
                  </div>

          <ul className="space-y-2">
            {courseData.syllabus.map((item) => (
              <li
                key={item.id}
                className={`flex border-t items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                  checked.includes(item.id) ? "bg-blue-100" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(item.id)}
                  onChange={() => handleToggle(item.id)}
                  id={`syllabus-${item.id}`}
                />
                <label htmlFor={`syllabus-${item.id}`} className="cursor-pointer">
                  {item.title}
                </label>
              </li>
            ))}
          </ul>
          <button className="mt-9 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
            Exchange
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}