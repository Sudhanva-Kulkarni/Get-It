import { useState } from "react";
import { ClipboardIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function TextCard({ textContent }) {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-[#38175A] p-4 rounded-xl border border-[#6e46a3] hover:border-[#D6B9FC] transition">
      <p className="text-gray-200 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
        {textContent}
      </p>

      <button
        onClick={copyText}
        className="flex gap-2 bg-[#838CE5] px-4 py-2 rounded-lg mt-4 text-black font-semibold hover:bg-[#6e76dc] transition"
      >
        {copied ? <ClipboardDocumentCheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
