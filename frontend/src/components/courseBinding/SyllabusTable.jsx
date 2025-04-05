export default function SyllabusTable() {
    return (
<div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold mb-4 text-green-500 border-b-2 border-orange-300 w-fit">
    Syllabus of the course
  </h2>
  <div className="flex flex-col">
    <div className="flex text-gray-600 border-b pb-2 mb-2">
      <div className="w-1/4 font-semibold">S.No</div>
      <div className="w-3/4 font-semibold">Title</div>
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex text-sm text-gray-800 border-b pb-2 mb-2">
        <div className="w-1/4 font-bold">{i + 1}</div>
        <div className="w-3/4 font-bold">Title{i + 1}</div>
      </div>
    ))}
  </div>
</div>

    );
  }
  