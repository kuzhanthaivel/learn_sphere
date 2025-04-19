import React, { useState } from "react";
import {
  FiUpload,
  FiBook,
  FiFileText,
  FiDollarSign,
  FiStar,
  FiPercent,
  FiList,
  FiUsers,
  FiPlus,
  FiCheck,
  FiTrash2
} from "react-icons/fi";

import Navbar from "./components/Header";

const categories = [
  { title: "Design"},
  { title: "Development"},
  { title: "Marketing"},
  { title: "Business"},
  { title: "Lifestyle"},
  { title: "Photography"},
  { title: "Music"},
  { title: "Data Science" },
  { title: "Personal Develop", },
  { title: "Health & Fitness", },
  { title: "Finance"},
  { title: "Teaching" },
];

const UploadCourseForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    price: "",
    rating: "",
    discount: "",
    syllabus: [{ sno: 1, title: "", videoUri: "" }],
    communityName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const updatedSyllabus = [...formData.syllabus];
    updatedSyllabus[index][field] = value;
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
  };

  const addSyllabusItem = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { sno: prev.syllabus.length + 1, title: "", videoUri: "" }]
    }));
  };

  const removeSyllabusItem = (index) => {
    if (formData.syllabus.length > 1) {
      const updatedSyllabus = formData.syllabus.filter((_, i) => i !== index);
      const renumberedSyllabus = updatedSyllabus.map((item, idx) => ({
        ...item,
        sno: idx + 1
      }));
      setFormData(prev => ({ ...prev, syllabus: renumberedSyllabus }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Submit to backend
  };

  return (
<div>
    

       <Navbar/>
       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FiBook className="mr-2" />
              Upload New Course
            </h1>
          </div>
          
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiBook className="mr-2 text-indigo-600" />
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiFileText className="mr-2 text-indigo-600" />
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  placeholder="Brief summary of the course"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiFileText className="mr-2 text-indigo-600" />
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  placeholder="Detailed description of the course"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUpload className="mr-2 text-indigo-600" />
                Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Category, Price, Rating, Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiList className="mr-2 text-indigo-600" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c.title !== "All").map((category) => {
                    const Icon = category.icon;
                    return (
                      <option key={category.title} value={category.title}>
                        {category.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiDollarSign className="mr-2 text-indigo-600" />
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiStar className="mr-2 text-indigo-600" />
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  placeholder="4.5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiPercent className="mr-2 text-indigo-600" />
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  placeholder="0"
                  value={formData.discount}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Syllabus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiList className="mr-2 text-indigo-600" />
                Course Syllabus
              </label>
              <div className="space-y-3">
                {formData.syllabus.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full">
                      <label className="block text-xs text-gray-500 mb-1">Lecture {index + 1}</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number"
                          value={item.sno}
                          readOnly
                          className="w-16 p-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                        <input
                          type="text"
                          placeholder="Lecture title"
                          value={item.title}
                          onChange={(e) => handleSyllabusChange(index, "title", e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Video URL"
                          value={item.videoUri}
                          onChange={(e) => handleSyllabusChange(index, "videoUri", e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSyllabusItem(index)}
                      className="mt-6 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center"
                      disabled={formData.syllabus.length <= 1}
                    >
                      <FiTrash2 className="mr-1" />
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSyllabusItem}
                  className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg flex items-center hover:bg-indigo-200 transition"
                >
                  <FiPlus className="mr-2" />
                  Add Lecture
                </button>
              </div>
            </div>

            {/* Community */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUsers className="mr-2 text-indigo-600" />
                Community Name
              </label>
              <input
                type="text"
                name="communityName"
                placeholder="Enter community name (optional)"
                value={formData.communityName}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                <FiCheck className="mr-2" />
                Submit Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UploadCourseForm;