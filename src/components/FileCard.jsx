import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function FileCard({ fileName, onSelect, fileId }) {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    const newState = !checked;
    setChecked(newState);
    onSelect(fileId, newState);
  };

  return (
    <div className="flex justify-between items-center bg-[#38175A] p-4 rounded-xl border border-[#6e46a3] hover:border-[#D6B9FC] transition">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={checked} onChange={toggle} className="w-5 h-5 cursor-pointer" />
        <p className="text-white truncate max-w-[200px]">{fileName}</p>
      </div>

      <button
        className="bg-[#D6B9FC] text-black px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#bda1f5] flex items-center gap-2 transition"
        onClick={() => alert(`Downloading: ${fileName}`)} // Placeholder
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}
