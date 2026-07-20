import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface LightboxImage {
  url: string;
  title?: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: (string | LightboxImage)[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const normalizedImages: LightboxImage[] = images.map((img) =>
    typeof img === 'string' ? { url: img } : img
  );

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose, handleNext, handlePrev]);

  if (!open || normalizedImages.length === 0) return null;

  const current = normalizedImages[currentIndex] || normalizedImages[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div
        className="absolute top-4 inset-x-4 flex items-center justify-between px-4 text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 font-ui text-xs font-bold tracking-wider text-white/90 backdrop-blur-sm border border-white/10">
            {currentIndex + 1} / {normalizedImages.length}
          </span>
          {current.title && (
            <h4 className="font-heading text-sm font-semibold tracking-wide text-white truncate max-w-xs sm:max-w-md">
              {current.title}
            </h4>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.title || current.caption || `Preview image ${currentIndex + 1}`}
          className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 select-none"
        />

        {current.caption && (
          <div className="absolute bottom-3 inset-x-4 mx-auto max-w-lg rounded-xl bg-black/70 p-3 text-center text-xs text-white/90 backdrop-blur-sm border border-white/10">
            {current.caption}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {normalizedImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all backdrop-blur-sm border border-white/10 hover:scale-110"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all backdrop-blur-sm border border-white/10 hover:scale-110"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
