import Navbar from "../components/Header";
import CourseDetailsCard from "../components/courseBinding/CourseDetailsCard";
import SyllabusTable from "../components/courseBinding/SyllabusTable";
import CourseInstructorCard from "../components/courseBinding/CourseInstructorCard";
import Footer from "../components/footer"

export default function CourseBinding() {
  return (
    <div className="max-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Side - Course Description & Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          <CourseDetailsCard />
          <SyllabusTable />
        </div>

        {/* Right Side - Instructor Card & Payment */}
        <CourseInstructorCard />
      </div>
      <Footer/>
    </div>
  );
}
