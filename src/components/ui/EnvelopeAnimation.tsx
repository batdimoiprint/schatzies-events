'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpening]);

  const handleTap = () => {
    if (isOpening) {
      setTimeout(onComplete, 300);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-pink-100 via-white to-pink-300 flex flex-col items-center justify-center cursor-pointer z-50 overflow-hidden"
      onClick={handleTap}
    >
      {/* Envelope Container */}
      <div className="relative w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40">
        {/* Envelope Body */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-xl border border-pink-200 overflow-hidden">
          {/* Envelope Flap */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-pink-400 to-pink-300 origin-top transition-all duration-800"
            style={{
              transform: isOpening ? 'rotateX(180deg) translateZ(0)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Flap fold line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full border-b border-pink-200/50" />
            </div>
          </div>

          {/* Envelope Bottom */}
          <div className="absolute top-1/2 left-0 right-0 h-1/2 bg-white border-t border-pink-100" />

          {/* Letter/Mail icon inside */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              isOpening ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <Mail
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-pink-500"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div
        className={`mt-6 sm:mt-10 md:mt-16 text-center transition-all duration-700 px-4 ${
          showText ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-pink-600 mb-2 sm:mb-3 leading-tight">
          You are invited!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Tap anywhere to continue</p>
      </div>

      {/* Bounce indicator */}
      {showText && (
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 animate-bounce">
          <div className="text-gray-400 text-xl sm:text-2xl">↑</div>
        </div>
      )}
    </div>
  );
}
