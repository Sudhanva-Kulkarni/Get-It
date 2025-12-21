export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-95px)] px-6 home-container" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="home-title font-extrabold mb-6 animate-[fadeInUp_0.8s_ease-out] tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Welcome to GetIt
        </h1>
        
        <p className="home-subtitle max-w-xl text-gray-200 mb-10 animate-[fadeInUp_0.8s_ease-out_0.2s_both] leading-relaxed font-light">
          Upload files or text securely and retrieve them later using a unique access code.
        </p>

        <div className="flex gap-6 justify-center home-buttons">
          <a
            href="/upload"
            className="home-button px-8 py-3 rounded-xl font-semibold text-black bg-[#D6B9FC] hover:bg-[#bda1f5] transition-all duration-300 hover:scale-105 animate-[fadeInUp_0.8s_ease-out_0.4s_both] tracking-wide"
          >
            Upload
          </a>
          <a
            href="/retrieve"
            className="home-button px-8 py-3 rounded-xl font-semibold text-black bg-[#838CE5] hover:bg-[#6e76dc] transition-all duration-300 hover:scale-105 animate-[fadeInUp_0.8s_ease-out_0.4s_both] tracking-wide"
          >
            Retrieve
          </a>
        </div>
      </div>

      <style>{`
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

        .home-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-title {
          font-size: 3.75rem; /* 60px */
        }

        .home-subtitle {
          font-size: 1.125rem; /* 18px */
        }

        .home-button {
          min-width: 140px;
        }

        /* Tablet (768px and below) */
        @media (max-width: 768px) {
          .home-container {
            padding: 1rem;
            min-height: calc(100vh - 70px);
          }

          .home-title {
            font-size: 2.5rem; /* 40px */
            margin-bottom: 1.5rem;
          }

          .home-subtitle {
            font-size: 1rem; /* 16px */
            margin-bottom: 2rem;
            padding: 0 1rem;
          }

          .home-buttons {
            gap: 1rem;
          }

          .home-button {
            padding: 0.75rem 2rem;
            font-size: 0.95rem;
          }
        }

        /* Mobile (480px and below) */
        @media (max-width: 480px) {
          .home-container {
            padding: 1rem;
            min-height: calc(100vh - 60px);
          }

          .home-title {
            font-size: 2rem; /* 32px */
            margin-bottom: 1rem;
            text-align: center;
          }

          .home-subtitle {
            font-size: 0.9rem; /* 14.4px */
            margin-bottom: 1.5rem;
            max-width: 90%;
            text-align: center;
          }

          .home-buttons {
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
            max-width: 280px;
            margin: 0 auto;
          }

          .home-button {
            width: 100%;
            padding: 0.875rem 1.5rem;
            font-size: 0.95rem;
            text-align: center;
          }
        }

        /* Extra small phones (360px and below) */
        @media (max-width: 360px) {
          .home-title {
            font-size: 1.75rem; /* 28px */
          }

          .home-subtitle {
            font-size: 0.85rem; /* 13.6px */
          }

          .home-button {
            font-size: 0.9rem;
            padding: 0.75rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}