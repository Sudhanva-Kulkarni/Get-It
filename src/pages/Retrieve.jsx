import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Retrieve() {
  const [code, setCode] = useState("");
  const [content, setContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchContent = async () => {
    if (!code.trim()) return toast.error("Enter a valid code");

    toast.promise(
      axios.get(``),
      {
        loading: "Fetching content...",
        success: (res) => {
          if (!res.data.success) throw new Error("Invalid Code");
          setContent(res.data.data);
          setSelectedFiles([]);
          return "Content loaded!";
        },
        error: "Invalid Code or Nothing Found",
      }
    ).catch(() => {});
  };

  // Checkbox toggle
  const toggleSelection = (file) => {
    setSelectedFiles(prev =>
      prev.includes(file)
        ? prev.filter(item => item !== file)
        : [...prev, file]
    );
  };

  // Download selected individually (no zip)
  const downloadSelected = () => {
    if (selectedFiles.length === 0) return toast.error("Select at least one file.");

    selectedFiles.forEach(file => {
      window.open(`http://localhost:5000/folder/${code}/file/${file.id}`, "_blank");
    });

    toast.success("Download started");
  };

  // Download all
  const downloadAll = () => {
    if (!content?.files?.length) return toast.error("No files to download");

    content.files.forEach(file => {
      window.open(`http://localhost:5000/folder/${code}/file/${file.id}`, "_blank");
    });

    toast.success("Downloading all files...");
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto animate-[fadeIn_0.6s_ease-out]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-3 tracking-tight animate-[slideDown_0.6s_ease-out]" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Retrieve Content
        </h2>
        <p className="text-gray-400 text-lg font-light animate-[slideDown_0.6s_ease-out_0.1s_both]">
          Enter your access code to view and download your content
        </p>
      </div>

      {/* Code Input Section */}
      <div className="bg-[#2a1044] border-2 border-gray-700 rounded-2xl p-8 mb-8 animate-[slideDown_0.6s_ease-out_0.2s_both] hover:border-gray-600 transition-all duration-300">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Access Code
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchContent()}
            className="flex-1 p-4 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all duration-300 text-lg"
          />
          <button
            className="bg-[#838CE5] px-8 py-4 rounded-xl font-bold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={fetchContent}
          >
            <i className="fa-solid fa-search mr-2"></i>
            Retrieve
          </button>
        </div>
      </div>

      {/* Content Section */}
      {content && (
        <div className="bg-[#2a1044] p-8 rounded-2xl border-2 border-purple-700 animate-[fadeIn_0.5s_ease-out] hover:border-purple-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <i className="fa-solid fa-folder-open text-[#D6B9FC]"></i>
              Code: <span className="text-[#D6B9FC] font-mono">{code}</span>
            </h3>
          </div>

          {/* TEXT CONTENT */}
          {content.content && (
            <div className="mb-8 animate-[slideIn_0.4s_ease-out]">
              <h4 className="text-lg text-[#D6B9FC] font-semibold mb-3 flex items-center gap-2">
                <i className="fa-solid fa-file-lines"></i>
                Saved Text
              </h4>
              <div className="bg-[#1e0c33] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-300">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {content.content}
                </p>
              </div>
            </div>
          )}

          {/* FILE LIST */}
          {content.files?.length > 0 && (
            <div className="animate-[slideIn_0.4s_ease-out_0.1s_both]">
              <h4 className="text-lg text-[#D6B9FC] font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-files"></i>
                Files ({content.files.length})
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                {content.files.map((file, index) => (
                  <div 
                    key={file.id} 
                    className="flex items-center gap-4 bg-[#1e0c33] p-5 rounded-xl hover:bg-[#2a1044] transition-all duration-300 border border-transparent hover:border-gray-700 group animate-[slideIn_0.3s_ease-out]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file)}
                      onChange={() => toggleSelection(file)}
                      className="cursor-pointer w-5 h-5 accent-[#838CE5]"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate flex items-center gap-2">
                        <i className="fa-solid fa-file text-[#838CE5] text-sm"></i>
                        {file.filename}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 truncate">
                        {file.description || "No description"}
                      </p>
                    </div>

                    {/* Single File Download */}
                    <button
                      onClick={() =>
                        window.open(`http://localhost:5000/folder/${code}/file/${file.id}`, "_blank")
                      }
                      className="ml-auto bg-[#838CE5] text-black px-5 py-2 text-sm rounded-lg font-semibold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 opacity-80 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-download mr-1"></i>
                      Download
                    </button>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                  onClick={downloadSelected}
                  disabled={selectedFiles.length === 0}
                  className={`bg-[#D6B9FC] text-black px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    selectedFiles.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#bda1f5] hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  <i className="fa-solid fa-check-double"></i>
                  Download Selected {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </button>

                <button
                  onClick={downloadAll}
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-download"></i>
                  Download All
                </button>
              </div>
            </div>
          )}

          {!content.files?.length && !content.content && (
            <div className="text-center py-12 animate-[fadeIn_0.4s_ease-out]">
              <i className="fa-solid fa-inbox text-6xl text-gray-600 mb-4"></i>
              <p className="text-red-400 text-lg">No files or text found under this code.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!content && (
        <div className="text-center py-16 animate-[fadeIn_0.8s_ease-out_0.4s_both]">
          <i className="fa-solid fa-key text-6xl text-gray-700 mb-4"></i>
          <p className="text-gray-500 text-lg">Enter an access code to retrieve your content</p>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@300;400;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e0c33;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #838CE5;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6e76dc;
        }
      `}</style>
    </div>
  );
}