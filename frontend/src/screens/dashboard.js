import Navbar from "../components/Header";
import Footer from "../components/footer";
import CourseCarousel from "../components/dashboard/courseCarousel";


const courses = [
  {
    id: 1,
    category: "HTML",
    title: "Various versions have evolved...",
    rating: 4.5,
    reviews: 15,
    image: "/images/html-course.jpg",
  },

];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-10 bg-gradient-to-b from-[#f2fff9] to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            My <span className="text-green-600 underline">Course</span>
          </h2>
          <CourseCarousel courses={courses} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
