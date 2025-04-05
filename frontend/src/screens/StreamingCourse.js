import Navbar from "../components/Header";
import CoursePlayer from "../components/sreamingCourse/CoursePlayer";
import CourseDescription from "../components/sreamingCourse/CourseDescription";
import SyllabusPanel from "../components/sreamingCourse/SyllabusPanel";
import Footer from "../components/footer";

export default function StreamingCourse() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CoursePlayer />
          <CourseDescription />
        </div>
        <SyllabusPanel />
      </div>
      <Footer />
    </div>
  );
}
