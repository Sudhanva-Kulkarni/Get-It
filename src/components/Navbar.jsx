import './Navbar.css'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '/logo.png';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-linear-to-r from-[#38175A] to-[#2a1044] shadow-2xl border-b border-[#4a1f6e] name">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition-opacity duration-200">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-lg p-1.5">
            <img src={logo} alt="GetIt Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Montserrat', 'Space Grotesk', sans-serif" }}>
            GetIt
          </h1>
        </a>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <a
            href="/"
            className={`font-medium px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base ${currentPath === '/'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
          >
            Home
          </a>
          <a
            href="/upload"
            className={`font-medium px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base ${currentPath === '/upload'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
          >
            Upload
          </a>
          <a
            href="/retrieve"
            className={`font-medium px-3 lg:px-6 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base ${currentPath === '/retrieve'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
          >
            Retrieve
          </a>
        </div>

        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 pb-2">
          <a
            href="/"
            className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${currentPath === '/'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/upload"
            className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${currentPath === '/upload'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Upload
          </a>
          <a
            href="/retrieve"
            className={`font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${currentPath === '/retrieve'
                ? 'bg-[#D6B9FC] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#4a1f6e]'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Retrieve
          </a>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Poppins:wght@700&family=Rajdhani:wght@700&family=Montserrat:wght@800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
      `}</style>
    </nav>
  );
}