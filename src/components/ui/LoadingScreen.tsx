// src/components/ui/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading = false }) => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnline = () => setOnline(navigator.onLine);

    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const shouldShow = isLoading || !online;
  if (!shouldShow) return null;

  const statusMessage = online ? 'Loading…' : 'No internet connection';

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* AI Button with simple loading ring */}
        <div className="relative">
          <button aria-label="Loading" className="ai-button-loading" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="ai-icon-loading"
              aria-hidden="true"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
              <path d="M17.5 2l.41 1.26L19.17 4l-1.26.74L17.5 6l-.41-1.26L15.83 4l1.26-.74z"></path>
            </svg>
          </button>

          {/* Simple loading ring */}
          <div className="loading-spinner"></div>
        </div>

        {/* Status text */}
        <p className="mt-4 text-sm font-medium text-white">{statusMessage}</p>
        {/* Minimal loading dots */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
