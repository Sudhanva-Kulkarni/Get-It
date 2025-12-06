import './Navbar.css'
import { useLocation } from 'react-router-dom'; // Add this import

export default function Navbar() {
  const location = useLocation(); 
  const currentPath = location.pathname; 

  return (
    <nav className="px-8 py-5 bg-linear-to-r from-[#38175A] to-[#2a1044] shadow-2xl border-b border-[#4a1f6e] name">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-[#D6B9FC] to-[#838CE5] rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-box text-[#2a1044] text-xl"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Montserrat', 'Space Grotesk', sans-serif" }}>
            GetIt
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="/" 
            className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPath === '/' 
                ? 'bg-[#D6B9FC] text-black font-semibold' 
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
            }`}
          >
            Home
          </a>
          <a 
            href="/upload" 
            className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPath === '/upload' 
                ? 'bg-[#D6B9FC] text-black font-semibold' 
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
            }`}
          >
            Upload
          </a>
          <a 
            href="/retrieve" 
            className={`font-medium px-6 py-2 rounded-lg transition-colors duration-200 ${
              currentPath === '/retrieve' 
                ? 'bg-[#D6B9FC] text-black font-semibold' 
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
            }`}
          >
            Retrieve
          </a>
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Poppins:wght@700&family=Rajdhani:wght@700&family=Montserrat:wght@800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
      `}</style>
    </nav>
  );
}