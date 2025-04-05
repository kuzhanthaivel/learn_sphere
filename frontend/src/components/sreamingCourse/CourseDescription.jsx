export default function CourseDescription() {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md">
        <p className="text-sm text-gray-600 font-semibold">
          A unique platform that allows learners to rent, exchan...
        </p>
        <div className="flex items-center space-x-1 mt-1">
          {"⭐".repeat(4)}<span className="text-sm text-gray-500">(102)</span>
        </div>
        <p className="mt-2 text-md font-medium text-gray-800">
          Discover the future of education with course rentals, gamified learning experiences, community-driven collaboration, shareable profiles, and blockchain-secured credentials all in one platform.
        </p>
      </div>
    );
  }
  