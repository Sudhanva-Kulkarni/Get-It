import { Link } from "react-router-dom";
import { BoltIcon, LockClosedIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const features = [
    {
      title: "Fast & Simple",
      desc: "Upload files and get a code in seconds",
      icon: <BoltIcon className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Secure",
      desc: "Your files are encrypted and safe",
      icon: <LockClosedIcon className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Multi-File",
      desc: "Upload and download multiple files at once",
      icon: <DocumentDuplicateIcon className="w-6 h-6 text-cyan-400" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">

      {/* TITLE AND SUBTITLE */}
      <h1 className="text-4xl font-bold">Get-It</h1>
      <p className="opacity-70 text-center">Save and retrieve code effortlessly.</p>

      {/* BUTTONS */}
      <div className="flex gap-6">
        <Link to="/upload" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl transition">
          Upload Files
        </Link>
        <Link to="/retrieve" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition">
          Retrieve Files
        </Link>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl px-4 w-full">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:border-cyan-500/40 transition-all backdrop-blur-lg"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
