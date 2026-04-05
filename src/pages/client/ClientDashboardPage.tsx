import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export function ClientDashboardPage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="relative">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">Overview</h1>
        <p className="mt-1 text-sm font-medium text-[#696373]">
          Here's a summary of the upcoming event you're planning.
        </p>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl border border-[#e8e4ee] bg-white shadow-sm" />
        ))}
      </div>

      {/* Welcome modal overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white px-8 pb-10 pt-6 text-center shadow-2xl">
            <button
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#6b6279] transition hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>

            {/* Illustration */}
            <div className="mx-auto mb-4 flex h-44 w-44 items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="welcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f347a5" />
                    <stop offset="100%" stopColor="#8f1fd1" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#welcomeGrad)" opacity="0.15" />
                <circle cx="100" cy="75" r="28" fill="url(#welcomeGrad)" opacity="0.6" />
                <rect
                  x="72"
                  y="110"
                  width="56"
                  height="50"
                  rx="10"
                  fill="url(#welcomeGrad)"
                  opacity="0.5"
                />
                <circle cx="60" cy="60" r="8" fill="#f9d342" opacity="0.8" />
                <circle cx="150" cy="55" r="6" fill="#ff6b9d" opacity="0.7" />
                <circle cx="140" cy="140" r="10" fill="#f9d342" opacity="0.6" />
                <rect x="40" y="130" width="30" height="20" rx="4" fill="#ff6b9d" opacity="0.3" />
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-[#2d2834]">
              Welcome to <span className="text-[#df2b80]">Schatzies</span>!
            </h2>
            <p className="mt-1 text-sm font-medium text-[#696373]">
              Ready to view your event plan?
            </p>

            <Link
              to="/client"
              onClick={() => setShowWelcome(false)}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 border-[#df2b80] px-8 text-sm font-bold text-[#df2b80] transition hover:bg-[#df2b80] hover:text-white"
            >
              Go to Overview
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
