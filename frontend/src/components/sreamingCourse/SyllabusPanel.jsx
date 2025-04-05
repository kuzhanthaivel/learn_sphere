import { useState } from "react";

export default function SyllabusPanel() {
  const [checked, setChecked] = useState([]);

  const syllabus = ["Title", "Title1", "Title2", "Title3", "Title4", "Title5", "Title6"];

  const handleToggle = (title) => {
    setChecked((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full lg:w-[300px]">
      <h3 className="text-lg font-semibold mb-4">
        <span className="text-green-600 underline underline-offset-4">Syllabus</span> of the course
      </h3>
      <ul className="space-y-2">
        {syllabus.map((title) => (
          <li
            key={title}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
              checked.includes(title) ? "bg-blue-100" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={checked.includes(title)}
              onChange={() => handleToggle(title)}
            />
            <span>{title}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
        EXchange
      </button>
    </div>
  );
}
