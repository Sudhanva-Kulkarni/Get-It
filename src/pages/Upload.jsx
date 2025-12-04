import { useState } from "react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDescriptionChange = (index, value) => {
    setDescriptions({ ...descriptions, [index]: value });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    console.log("Uploading files:", selectedFiles);
    console.log("Descriptions:", descriptions);

    setUploaded(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-900 text-white">
      {!uploaded ? (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl w-full">
          <h1 className="text-2xl font-semibold text-center mb-3">Upload Files</h1>

          <p className="text-sm text-gray-400 text-center mb-4">
            You can upload multiple files. Max file size: 10MB each.
          </p>

          <label className="block w-full p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 text-center">
            <ArrowUpOnSquareIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <span className="text-gray-300">Click to select files</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">Selected Files</h2>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium">{file.name}</p>
                    <input
                      type="text"
                      placeholder="Add a description..."
                      className="w-full mt-2 p-2 rounded bg-gray-600 border border-gray-500 text-sm"
                      value={descriptions[index] || ""}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rate limit info */}
          <p className="text-sm text-gray-400 text-center mt-4">
            <strong>Rate Limit:</strong> Max 10 uploads per hour per user.
          </p>

          <button
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      ) : (
        // Success Message Screen
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold mb-3">Upload Successful 🎉</h1>
          <p className="text-gray-300 mb-6">
            Your files have been uploaded and processed successfully.
          </p>

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
}
