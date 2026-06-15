import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
}

export function GalleryModal({ isOpen, onClose, title, images }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 md:p-6"
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] rounded-xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Header - Mobile Only */}
        <div className="lg:hidden flex items-center justify-between bg-gradient-to-r from-brand to-brand-deep px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="font-heading text-base sm:text-lg font-bold text-white truncate pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="shrink-0 rounded-full p-1.5 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </div>

        {/* Main Image Section - Responsive */}
        <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between bg-gradient-to-r from-brand to-brand-deep px-6 py-4">
            <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close gallery"
              className="rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-black overflow-hidden flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="h-full w-full object-contain"
              loading="lazy"
            />

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/15 hover:bg-white/30 p-2 sm:p-3 transition-all duration-200 backdrop-blur-sm group hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </button>

            <button
              onClick={goToNext}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/15 hover:bg-white/30 p-2 sm:p-3 transition-all duration-200 backdrop-blur-sm group hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm">
              <p className="font-sans text-xs sm:text-sm font-semibold text-white">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Image Info - Mobile Footer */}
          <div className="lg:hidden bg-gradient-to-r from-brand/10 to-brand-deep/10 px-4 py-2.5 sm:px-6 sm:py-3 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-brand-deep text-center">
              Use arrow keys or buttons to navigate
            </p>
          </div>
        </div>

        {/* Thumbnails Section - Responsive Sidebar/Bottom */}
        <div className="w-full lg:w-32 xl:w-40 bg-gradient-to-b lg:bg-gradient-to-r from-gray-50 to-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-auto">
          <div className="flex lg:flex-col gap-1.5 p-3 sm:p-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative shrink-0 flex-1 lg:flex-none aspect-square rounded-lg overflow-hidden transition-all duration-300 group ${
                  index === currentIndex
                    ? 'ring-2 ring-brand'
                    : 'ring-1 ring-gray-300 hover:ring-brand/70'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
