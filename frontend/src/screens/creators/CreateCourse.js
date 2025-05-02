import React, { useState } from "react";
import { FiUpload, FiBook, FiFileText, FiDollarSign, FiStar, FiPercent, FiList, FiUsers, FiPlus, FiCheck, FiTrash2, FiLink } from "react-icons/fi";
import Navbar from "./components/Header";

const categories = [
  { title: "Design" },
  { title: "Development" },
  { title: "Marketing" },
  { title: "Business" },
  { title: "Lifestyle" },
  { title: "Photography" },
  { title: "Music" },
  { title: "Data Science" },
  { title: "Personal Develop" },
  { title: "Health & Fitness" },
  { title: "Finance" },
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
    syllabus: [{ sno: 1, title: "", videoUrl: "", videoFile: null }],
    communityName: "",
    coverImage: null
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadMethod, setUploadMethod] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const updatedSyllabus = [...formData.syllabus];
    updatedSyllabus[index][field] = value;
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
  };

  const handleFileUpload = (index, file) => {
    const updatedSyllabus = [...formData.syllabus];
    updatedSyllabus[index].videoFile = file;
    updatedSyllabus[index].videoUrl = "";
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));

    setUploadMethod(prev => ({ ...prev, [index]: 'file' }));

    setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[index] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [index]: 100 };
        }
        return { ...prev, [index]: newProgress };
      });
    }, 200);
  };

  const handleCoverImageUpload = (file) => {
    setFormData(prev => ({ ...prev, coverImage: file }));
  };

  const addSyllabusItem = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { sno: prev.syllabus.length + 1, title: "", videoUrl: "", videoFile: null }]
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

      const newProgress = { ...uploadProgress };
      delete newProgress[index];
      setUploadProgress(newProgress);

      const newMethods = { ...uploadMethod };
      delete newMethods[index];
      setUploadMethod(newMethods);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const creatorToken = localStorage.getItem('creatorToken');
      if (!creatorToken) {
        throw new Error('Creator not authenticated. Please sign in.');
      }

      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('fullDescription', formData.fullDescription);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('communityName', formData.communityName);

      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      formDataToSend.append('syllabus', JSON.stringify(
        formData.syllabus.map(item => ({
          title: item.title,
          videoUrl: item.videoUrl
        }))
      ));

      formData.syllabus.forEach((item, index) => {
        if (item.videoFile) {
          formDataToSend.append('videos', item.videoFile);
        }
      });

      const response = await fetch('http://localhost:5001/api/createCourse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${creatorToken}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
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
              {submitSuccess && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                  Course created successfully!
                </div>
              )}
              {submitError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}

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
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleCoverImageUpload(e.target.files[0])}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {formData.coverImage && (
                      <p className="text-sm text-green-600 mt-2">
                        {formData.coverImage.name} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
                    {categories.map((category) => (
                      <option key={category.title} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiDollarSign className="mr-2 text-indigo-600" />
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="1"
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
                        </div>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-4 mb-2">
                            <button
                              type="button"
                              onClick={() => setUploadMethod(prev => ({ ...prev, [index]: 'url' }))}
                              className={`px-3 py-1 text-sm rounded-lg ${uploadMethod[index] === 'url' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <FiLink className="inline mr-1" /> Use URL
                            </button>
                            <button
                              type="button"
                              onClick={() => setUploadMethod(prev => ({ ...prev, [index]: 'file' }))}
                              className={`px-3 py-1 text-sm rounded-lg ${uploadMethod[index] === 'file' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <FiUpload className="inline mr-1" /> Upload File
                            </button>
                          </div>

                          {uploadMethod[index] === 'url' ? (
                            <input
                              type="text"
                              placeholder="Video URL (YouTube, Vimeo, etc.)"
                              value={item.videoUrl}
                              onChange={(e) => {
                                handleSyllabusChange(index, "videoUrl", e.target.value);
                                handleSyllabusChange(index, "videoFile", null);
                              }}
                              className="w-full p-3 border border-gray-300 rounded-lg"
                              required={!item.videoFile}
                            />
                          ) : (
                            <div>
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`video-upload-${index}`}
                                  accept="video/*"
                                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <label
                                  htmlFor={`video-upload-${index}`}
                                  className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-center"
                                >
                                  {item.videoFile ? (
                                    <span className="text-green-600">{item.videoFile.name}</span>
                                  ) : (
                                    <span className="text-gray-500">Choose video file (MP4, MOV, etc.)</span>
                                  )}
                                </label>
                              </div>
                              {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress[index]}%` }}
                                  ></div>
                                </div>
                              )}
                              {uploadProgress[index] === 100 && (
                                <div className="mt-1 text-sm text-green-600">Upload complete!</div>
                              )}
                            </div>
                          )}
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Submit Course
                    </>
                  )}
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