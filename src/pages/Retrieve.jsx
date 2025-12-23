import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"

export default function Retrieve() {
  const [code, setCode] = useState("");
  const [content, setContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const baseUrl = import.meta.env.VITE_BASEURL;

  const copyTextToClipboard = () => {
    if (content?.textData?.content) {
      navigator.clipboard.writeText(content.textData.content).then(() => {
        toast.success("Text copied to clipboard!");
      }).catch(() => {
        toast.error("Failed to copy text");
      });
    }
  };

  const fetchContent = async () => {
    if (!code.trim()) return toast.error("Enter a valid code");

    try {
      toast.loading("Fetching content...");

      let filesData = [];
      let textData = null;

      try {
        const filesRes = await axios.get(`${baseUrl}/files/${code}`);
        console.log("Files response:", filesRes.data);
        if (filesRes.data.success) {
          filesData = filesRes.data.files || [];
        }
      } catch (err) {
        console.log("Files error:", err);
      }

      try {
        const textRes = await axios.get(`${baseUrl}/text-content/${code}`);
        console.log("Text response:", textRes.data);
        if (textRes.data.success) {
          textData = textRes.data.data;
        }
      } catch (err) {
        console.log("Text error:", err);
      }

      console.log("Final filesData:", filesData);
      console.log("Final textData:", textData);

      if (filesData.length === 0 && !textData) {
        toast.dismiss();
        toast.error("Invalid Code or Nothing Found");
        setContent(null);
        setSelectedFiles([]);
        return;
      }

      setContent({
        files: filesData,
        textData: textData,
        retrievedCode: code
      });
      setSelectedFiles([]);
      setCode("");
      toast.dismiss();
      toast.success("Content loaded!");

    } catch (error) {
      console.log("Outer error:", error);
      toast.dismiss();
      toast.error("Invalid Code or Nothing Found");
      setContent(null);
      setSelectedFiles([]);
    }
  };

  const toggleSelection = (file) => {
    setSelectedFiles(prev =>
      prev.includes(file)
        ? prev.filter(item => item !== file)
        : [...prev, file]
    );
  };

  const isPreviewable = (file) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const textTypes = ['text/plain', 'text/csv', 'application/json'];
    const pdfType = 'application/pdf';
    
    return imageTypes.includes(file.mimetype) || 
           textTypes.includes(file.mimetype) || 
           file.mimetype === pdfType ||
           file.originalName.endsWith('.md');
  };

  const handlePreview = async (file) => {
    try {
      toast.loading("Loading preview...");
      
      const response = await fetch(file.url);
      const blob = await response.blob();
      
      let previewData = {
        file: file,
        type: file.mimetype,
        url: file.url
      };

      if (file.mimetype.startsWith('text/') || file.mimetype === 'application/json' || file.originalName.endsWith('.md')) {
        const text = await blob.text();
        previewData.textContent = text;
      } else {
        previewData.blobUrl = window.URL.createObjectURL(blob);
      }

      setPreviewFile(previewData);
      setShowPreviewModal(true);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Preview failed:", error);
      toast.error("Failed to load preview");
    }
  };

  const closePreview = () => {
    if (previewFile?.blobUrl) {
      window.URL.revokeObjectURL(previewFile.blobUrl);
    }
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  const downloadSelected = async () => {
    if (selectedFiles.length === 0) return toast.error("Select at least one file.");

    toast.success(`Starting download of ${selectedFiles.length} file(s)...`);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        // Wait before next download
        if (i < selectedFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to download ${file.name}:`, error);
      }
    }
  };


  const downloadAll = async () => {
    if (!content?.files?.length) return toast.error("No files to download");

    toast.success(`Starting download of ${content.files.length} file(s)...`);

    for (let i = 0; i < content.files.length; i++) {
      const file = content.files[i];

      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        if (i < content.files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to download ${file.name}:`, error);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-5xl mx-auto animate-[fadeIn_0.6s_ease-out]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-5xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 tracking-tight animate-[slideDown_0.6s_ease-out]" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Retrieve Content
        </h2>
        <p className="text-gray-400 text-base sm:text-lg font-light animate-[slideDown_0.6s_ease-out_0.1s_both]">
          Enter your access code to view and download your content
        </p>
      </div>

      {/* Code Input Section */}
      <div className="bg-[#2a1044] border-2 border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 animate-[slideDown_0.6s_ease-out_0.2s_both] hover:border-gray-600 transition-all duration-300">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Access Code
        </label>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchContent()}
            className="flex-1 p-3 sm:p-4 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all duration-300 text-base sm:text-lg"
          />
          <button
            className="bg-[#838CE5] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
            onClick={fetchContent}
          >
            <i className="fa-solid fa-search mr-2"></i>
            Retrieve
          </button>
        </div>
      </div>

      {/* Content Section */}
      {content && (
        <div className="bg-[#2a1044] p-4 sm:p-6 md:p-8 rounded-2xl border-2 border-purple-700 animate-[fadeIn_0.5s_ease-out] hover:border-purple-600 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-gray-700 gap-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 break-all">
              <i className="fa-solid fa-folder-open text-[#D6B9FC] shrink-0"></i>
              <span className="hidden sm:inline">Code:</span>
              <span className="text-[#D6B9FC] font-mono text-base sm:text-xl">{content.retrievedCode}</span>
            </h3>
          </div>

          {/* TEXT CONTENT */}
          {content.textData && (
            <div className="mb-6 sm:mb-8 animate-[slideIn_0.4s_ease-out]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base sm:text-lg text-[#D6B9FC] font-semibold flex items-center gap-2 wrap-break-word">
                  <i className="fa-solid fa-file-lines shrink-0"></i>
                  <span className="break-all">{content.textData.contentname}</span>
                </h4>
                <button
                  onClick={copyTextToClipboard}
                  className="ml-4 text-[#D6B9FC] hover:text-[#bda1f5] transition-colors duration-200 shrink-0"
                  title="Copy text to clipboard"
                >
                  <i className="fa-solid fa-copy text-lg sm:text-xl"></i>
                </button>
              </div>
              <div className="bg-[#1e0c33] p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-300">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base wrap-break-word">
                  {content.textData.content}
                </p>
              </div>
            </div>
          )}

          {/* FILE LIST */}
          {content.files?.length > 0 && (
            <div className="animate-[slideIn_0.4s_ease-out_0.1s_both]">
              <h4 className="text-base sm:text-lg text-[#D6B9FC] font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-files"></i>
                Files ({content.files.length})
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-4 sm:mb-6 custom-scrollbar">
                {content.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-[#1e0c33] p-4 sm:p-5 rounded-xl hover:bg-[#2a1044] transition-all duration-300 border border-transparent hover:border-gray-700 group animate-[slideIn_0.3s_ease-out]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >

                    {/* Checkbox and File Info */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file)}
                        onChange={() => toggleSelection(file)}
                        className="cursor-pointer w-5 h-5 accent-[#838CE5] mt-1 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate flex items-center gap-2 text-sm sm:text-base">
                          <i className="fa-solid fa-file text-[#838CE5] text-xs sm:text-sm shrink-0"></i>
                          <span className="truncate">{file.name}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                          Original: {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      {/* Preview Button */}
                      {isPreviewable(file) && (
                        <button
                          onClick={() => handlePreview(file)}
                          className="flex-1 sm:flex-none bg-[#D6B9FC] text-black px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-[#bda1f5] transition-all duration-300 hover:scale-105"
                        >
                          <i className="fa-solid fa-eye mr-1"></i>
                          Preview
                        </button>
                      )}

                      {/* Download Button */}
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(file.url);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);

                            const link = document.createElement('a');
                            link.href = url;
                            link.download = file.name || file.originalName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            window.URL.revokeObjectURL(url);
                            toast.success("Download started!");
                          } catch (error) {
                            console.error("Download failed:", error);
                            toast.error("Download failed. Try again.");
                          }
                        }}
                        className="flex-1 sm:flex-none bg-[#838CE5] text-black px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 opacity-80 group-hover:opacity-100"
                      >
                        <i className="fa-solid fa-download mr-1"></i>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-700">
                <button
                  onClick={downloadSelected}
                  disabled={selectedFiles.length === 0}
                  className={`bg-[#D6B9FC] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${selectedFiles.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#bda1f5] hover:scale-105 hover:shadow-lg"
                    }`}
                >
                  <i className="fa-solid fa-check-double"></i>
                  <span>Download Selected {selectedFiles.length > 0 && `(${selectedFiles.length})`}</span>
                </button>

                <button
                  onClick={downloadAll}
                  className="bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <i className="fa-solid fa-download"></i>
                  Download All
                </button>
              </div>
            </div>
          )}

          {!content.files?.length && !content.textData && (
            <div className="text-center py-12 animate-[fadeIn_0.4s_ease-out]">
              <i className="fa-solid fa-inbox text-5xl sm:text-6xl text-gray-600 mb-4"></i>
              <p className="text-red-400 text-base sm:text-lg">No files or text found under this code.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!content && (
        <div className="text-center py-12 sm:py-16 animate-[fadeIn_0.8s_ease-out_0.4s_both]">
          <i className="fa-solid fa-key text-5xl sm:text-6xl text-gray-700 mb-4"></i>
          <p className="text-gray-500 text-base sm:text-lg px-4">Enter an access code to retrieve your content</p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={closePreview}
        >
          <div 
            className="bg-[#2a1044] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-[slideDown_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate pr-4">
                <i className="fa-solid fa-eye mr-2 text-[#D6B9FC]"></i>
                {previewFile.file.name}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-white text-2xl transition-colors duration-200 shrink-0"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-auto flex-1">
              {/* Image Preview */}
              {previewFile.type.startsWith('image/') && (
                <img 
                  src={previewFile.blobUrl} 
                  alt={previewFile.file.name}
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              )}

              {/* PDF Preview */}
              {previewFile.type === 'application/pdf' && (
                <iframe
                  src={previewFile.blobUrl}
                  className="w-full h-[60vh] rounded-lg border border-gray-700"
                  title="PDF Preview"
                />
              )}

              {/* Text Preview */}
              {(previewFile.type.startsWith('text/') || previewFile.type === 'application/json' || previewFile.file.originalName.endsWith('.md')) && (
                <pre className="bg-[#1e0c33] p-4 rounded-lg text-gray-300 text-sm overflow-auto whitespace-pre-wrap wrap-break-word max-h-[60vh]">
                  {previewFile.textContent}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-700 shrink-0">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(previewFile.file.url);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = previewFile.file.name || previewFile.file.originalName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(url);
                    toast.success("Download started!");
                  } catch (error) {
                    console.error("Download failed:", error);
                    toast.error("Download failed. Try again.");
                  }
                }}
                className="flex-1 bg-[#838CE5] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#6e76dc] transition-all duration-300"
              >
                <i className="fa-solid fa-download mr-2"></i>
                Download
              </button>
              <button
                onClick={closePreview}
                className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

        /* Custom Checkbox Styling */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #838CE5;
          border-radius: 6px;
          background-color: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        input[type="checkbox"]:hover {
          border-color: #D6B9FC;
          background-color: rgba(131, 140, 229, 0.1);
        }

        input[type="checkbox"]:checked {
          background-color: #838CE5;
          border-color: #838CE5;
        }

        input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #000;
          font-size: 14px;
          font-weight: bold;
        }

        input[type="checkbox"]:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(131, 140, 229, 0.3);
        }
      `}</style>
    </div>
  );
}