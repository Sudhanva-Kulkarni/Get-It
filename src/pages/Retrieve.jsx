import { useState } from "react";

export default function Retrieve() {
  const [code, setCode] = useState("");

  const fetchFiles = () => {
    console.log("Fetching files for:", code);
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Retrieve Files</h2>

      <input
        type="text"
        maxLength="6"
        placeholder="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full p-3 bg-gray-700 rounded mb-4 text-center tracking-widest"
      />

      <button
        onClick={fetchFiles}
        className="w-full py-3 bg-cyan-600 rounded hover:bg-cyan-500 transition"
      >
        Fetch Files
      </button>
    </div>
  );
}
