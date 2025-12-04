import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Retrieve from "./pages/Retrieve";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/retrieve" element={<Retrieve />} />
        </Routes>
      </div>
    </Router>
  );
}
