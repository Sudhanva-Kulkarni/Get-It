export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-80px)] px-6 overflow-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Content */}
      <div className="relative z-10">
        {/* Title with staggered fade-in */}
        <h1 className="text-6xl font-extrabold mb-6 animate-[fadeInUp_0.8s_ease-out] tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Welcome to GetIt
        </h1>
        
        {/* Subtitle with delayed fade-in */}
        <p className="max-w-xl text-lg text-gray-200 mb-10 animate-[fadeInUp_0.8s_ease-out_0.2s_both] leading-relaxed font-light">
          Upload files or text securely and retrieve them later using a unique access code.
        </p>

        {/* Buttons with staggered entrance */}
        <div className="flex gap-6 justify-center">
          <a
            href="/upload"
            className="px-8 py-3 rounded-xl font-semibold text-black bg-[#D6B9FC] hover:bg-[#bda1f5] transition-all duration-300 hover:scale-105 animate-[fadeInUp_0.8s_ease-out_0.4s_both] tracking-wide"
          >
            Upload
          </a>
          <a
            href="/retrieve"
            className="px-8 py-3 rounded-xl font-semibold text-black bg-[#838CE5] hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 animate-[fadeInUp_0.8s_ease-out_0.4s_both] tracking-wide"
          >
            Retrieve
          </a>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@300;400;600&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}