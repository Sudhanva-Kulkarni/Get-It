import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Upload() {
  const [tab, setTab] = useState("file");
  const [code, setCode] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [textName, setTextName] = useState(""); 
  const [customNames, setCustomNames] = useState([]);

  const baseUrl = import.meta.env.VITE_BASEURL;

  const resetUpload = () => {
    setUploaded(false);
    setFiles([]);         
    setCustomNames([]);
  };

  const handleNewTextUpload = () => {
    setCode("");
    setUploaded(false);
    setText("");
    setTextName("");
  };
  
  const selectFiles = (e) => {
    const chosenFiles = [...e.target.files];

    if (files.length + chosenFiles.length > 10) {
      toast.error("Maximum 10 files allowed.");
      return;
    }

    const updatedFiles = chosenFiles.map(file => ({
      file,
      description: ""
    }));

    setFiles(prev => [...prev, ...updatedFiles]);
    toast.success("Files selected!");
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    const updatedNames = customNames.filter((_, i) => i !== index);
    setFiles(updated);
    setCustomNames(updatedNames);
    toast.success("File removed");
  };

  const handleFileUpload = async () => {
    if (files.length === 0)
      return toast.error("Please select files first.");

    if (customNames.length !== files.length)
      return toast.error("Please enter a name for each file.");

    const formData = new FormData();

    if (code) {
      formData.append("key", code);
    }

    files.forEach(fileObj => {
      formData.append("files", fileObj.file);
    });

    formData.append("names", JSON.stringify(customNames));

    try {
      const response = await axios.post(`${baseUrl}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        if (response.data.key) setCode(response.data.key);
        setUploaded(true);
        setFiles([]);          
        setCustomNames([]);
        toast.success("Upload successful!");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Invalid code. Please check your code or create a new upload.");
      } else {
        toast.error("Upload failed. Try again.");
      }
    }
  };

  const handleTextUpload = async () => {
    if (!text.trim()) return toast.error("Text cannot be empty.");
    if (!textName.trim()) return toast.error("Please enter a name for your text."); 

    const payload = {
      contentname: textName, 
      description: "",
      content: text
    };

    try {
      toast.loading("Saving text...");
      const response = await axios.post(`${baseUrl}/text-content`, payload);
      
      if (response.data.ui) {
        setCode(response.data.ui);
        setText("");
        setTextName(""); 
        setUploaded(true);
        toast.dismiss();
        toast.success("Text uploaded successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Upload error:", error.response?.data);
      toast.error("Upload failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-3 tracking-tight animate-[slideDown_0.6s_ease-out]" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Upload Content
        </h2>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 animate-[slideDown_0.6s_ease-out_0.2s_both]">
        {["file", "text"].map(type => (
          <button
            key={type}
            className={`px-6 py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 ${
              tab === type 
                ? "bg-[#D6B9FC] text-black scale-105 shadow-lg" 
                : "bg-[#38175A] text-white hover:bg-[#4a1f6e]"
            }`}
            onClick={() => setTab(type)}
          >
            {type === "file" ? (
              <><i className="fa-solid fa-file mr-2"></i> Files</>
            ) : (
              <><i className="fa-solid fa-file-lines mr-2"></i> Text</>
            )}
          </button>
        ))}
      </div>

      {/* CODE INPUT - Only show for file tab */}
      {tab === "file" && (
        <div className="mb-8 animate-[slideDown_0.6s_ease-out_0.3s_both]">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Access Code (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter existing code to add more files"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all duration-300"
          />
        </div>
      )}

      {/* FILE SIZE INFO - Only show for file tab */}
      {tab === "file" && (
        <div className="block text-sm font-medium text-gray-400 mb-2">
          Only 10 files each of maximum 10MB can be chosen at a time.
        </div>
      )}

      {/* FILE UPLOAD */}
      {tab === "file" && (
        <div className="border-2 border-gray-700 rounded-2xl p-8 flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out] hover:border-gray-600 transition-colors duration-300">

          {/* Select Button */}
          <label className="bg-[#838CE5] text-black px-8 py-4 rounded-xl font-semibold w-fit cursor-pointer hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Choose Files
            <input type="file" className="hidden" multiple onChange={selectFiles} />
          </label>

          {/* Preview with description fields */}
          {files.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {files.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#38175A] p-5 rounded-xl hover:bg-[#4a1f6e] transition-all duration-300 animate-[slideIn_0.3s_ease-out] group"
                >
                  {/* Top Row: File Name + Remove Button */}
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-white font-semibold text-sm break-all pr-4">
                      {item.file.name}
                    </p>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      ×
                    </button>
                  </div>

                  {/* Custom Name Input */}
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Enter custom name"
                      value={customNames[index] || ""}
                      className="w-full p-2 mt-1 rounded-md bg-[#50207A] text-white outline-none"
                      onChange={(e) => {
                        const updated = [...customNames];
                        updated[index] = e.target.value;
                        setCustomNames(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!uploaded ? (
            <button
              onClick={handleFileUpload}
              disabled={files.length === 0}
              className={`bg-[#D6B9FC] text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 ${
                files.length === 0 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-[#bda1f5] hover:scale-105 hover:shadow-lg cursor-pointer"
              }`}
            >
              Upload {files.length > 0 && `(${files.length} file${files.length > 1 ? 's' : ''})`}
            </button>
          ) : (
            <>
              {/* SHOW CODE HERE */}
              <div className="mt-4 p-4 bg-[#2a1044] rounded-xl border border-[#D6B9FC]">
                <p className="text-lg text-gray-300">
                  Your access code:
                  <span className="font-mono text-[#D6B9FC] ml-2 text-xl font-bold">{code}</span>
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={resetUpload}
                  className="flex-1 bg-[#838CE5] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105"
                >
                  Upload More Files
                </button>
                <a 
                  href="/" 
                  onClick={() => setCode('')} 
                  className="flex-1 bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-green-600 transition-all duration-300 hover:scale-105 animate-[fadeIn_0.4s_ease-out]"
                >
                  ✓ Done — Return Home
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* TEXT UPLOAD SECTION */}
      {tab === "text" && (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out]">
          {/* TEXT NAME INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Text Name
            </label>
            <input
              type="text"
              placeholder="Enter a name for your text..."
              value={textName}
              onChange={(e) => setTextName(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all duration-300"
            />
          </div>

          <div className="relative">
            <textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 rounded-xl p-5 bg-[#38175A] outline-none text-white border-2 border-gray-700 focus:border-[#838CE5] transition-all duration-300 resize-none"
            />
            <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
              {text.length} characters
            </div>
          </div>

          {!uploaded ? (
            <button
              onClick={handleTextUpload}
              disabled={!text.trim() || !textName.trim()}
              className={`bg-[#D6B9FC] text-black px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                !text.trim() || !textName.trim()
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-[#bda1f5] hover:scale-105 hover:shadow-lg cursor-pointer"
              }`}
            >
              Upload Text
            </button>
          ) : (
            <>
              {/* SHOW CODE HERE */}
              <div className="mt-4 p-4 bg-[#2a1044] rounded-xl border border-[#D6B9FC]">
                <p className="text-lg text-gray-300">
                  Your access code:
                  <span className="font-mono text-[#D6B9FC] ml-2 text-xl font-bold">{code}</span>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleNewTextUpload}
                  className="flex-1 bg-[#838CE5] text-black px-8 py-4 rounded-xl font-bold hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105"
                >
                  Upload New Text
                </button>
                <a 
                  href="/" 
                  className="flex-1 bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-green-600 transition-all duration-300 hover:scale-105 animate-[fadeIn_0.4s_ease-out]"
                >
                  ✓ Done — Return Home
                </a>
              </div>
            </>
          )}
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
          background: #2a1044;
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