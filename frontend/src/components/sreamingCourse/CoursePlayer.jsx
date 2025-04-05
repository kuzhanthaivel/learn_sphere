export default function CoursePlayer() {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg">
        <video
          controls
          className="w-full h-[400px] object-cover"
          poster="https://dummyimage.com/720x400"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Course Title</h2>
          <span className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded">
            Business
          </span>
        </div>
      </div>
    );
  }
  