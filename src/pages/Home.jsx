import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [apiVersion, setApiVersion] = useState("");
  const [isVersionLoading, setIsVersionLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BASEURL;

  useEffect(() => {
    let isMounted = true;
    let retryTimer;

    const fetchVersion = async () => {
      try {
        const response = await axios.get(`${baseUrl}/version`, { timeout: 5000 });
        if (isMounted && response?.data?.success && response?.data?.version) {
          setApiVersion(response.data.version);
          setIsVersionLoading(false);
          return true;
        }
      } catch (error) {
      }

      return false;
    };

    const fetchWithRetry = async () => {
      const fetched = await fetchVersion();
      if (!fetched && isMounted) {
        retryTimer = setTimeout(fetchWithRetry, 2000);
      }
    };

    fetchWithRetry();

    return () => {
      isMounted = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [baseUrl]);

  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-95px)] px-6 home-container" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="home-title font-extrabold mb-6 animate-[fadeInUp_0.8s_ease-out] tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          <span>Welcome to GetIt</span>
          <span className="home-version-inline" aria-live="polite">
            {isVersionLoading ? (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3 w-3 animate-spin text-[#838CE5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span className="font-mono">v</span>
              </span>
            ) : (
              <span className="font-mono">v{apiVersion || "..."}</span>
            )}
          </span>
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
          display: inline-flex;
          align-items: baseline;
          gap: 0.85rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-subtitle {
          font-size: 1.125rem; /* 18px */
        }

        .home-button {
          min-width: 140px;
        }

        .home-version-inline {
          font-size: 0.32em;
          letter-spacing: 0.02em;
          color: rgba(214, 185, 252, 0.72);
          user-select: none;
          transform: translateY(-0.2rem);
          margin-left: 0.3rem;
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