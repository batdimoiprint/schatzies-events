import { X, ArrowLeft, ArrowRight, User, Utensils, Scissors, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PackageItem } from './PackageCard';

const iconMap = {
  user: User,
  utensils: Utensils,
  scissors: Scissors,
  video: Video,
} as const;

export type IconName = keyof typeof iconMap;

export type InclusionItem = string | { text: string; highlight: true };

export interface InclusionCategory {
  iconName: IconName;
  title: string;
  items: InclusionItem[];
}

export interface PackageModalData {
  note: string;
  categories: [InclusionCategory, InclusionCategory, InclusionCategory, InclusionCategory];
}

export interface PackageWithModal extends PackageItem {
  modal: PackageModalData;
}

interface PackageModalProps {
  packages: PackageWithModal[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onInquire?: () => void;
}

export function PackageModal({
  packages,
  activeIndex,
  onClose,
  onNavigate,
  onInquire,
}: PackageModalProps) {
  const pkg = packages[activeIndex];
  const { modal } = pkg;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Dialog - FIXED SIZE */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative flex h-[85vh] w-[95vw] max-w-[1200px] flex-col overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8 lg:w-[1100px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Title - font adjusts */}
          <h2 className="pr-10 text-[1rem] font-bold text-[#3d2052] sm:pr-0 sm:text-[1.4rem] lg:text-[1.8rem]">
            {pkg.name} Inclusion
          </h2>

          {/* 2×2 inclusion grid - fixed grid, fonts adjust */}
          <div className="mt-4 grid flex-1 grid-cols-1 gap-3 overflow-y-auto sm:mt-5 sm:grid-cols-2 sm:gap-4">
            {modal.categories.map((cat) => {
              const Icon = iconMap[cat.iconName];
              return (
                <div key={cat.title} className="rounded-2xl bg-[#ede0f5] p-3 sm:p-4 lg:p-5">
                  <div className="mb-1 flex items-center gap-2 sm:mb-2">
                    <Icon className="h-4 w-4 text-[#c2649b] sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span className="text-[0.85rem] font-bold text-[#3d1a5e] sm:text-[0.9rem] lg:text-[1rem]">
                      {cat.title}
                    </span>
                  </div>
                  <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                    {cat.items.map((item) => {
                      const isHighlight = typeof item === 'object';
                      const text = typeof item === 'object' ? item.text : item;
                      return (
                        <li
                          key={text}
                          className="flex items-start gap-2 text-[0.75rem] sm:text-[0.85rem] lg:text-[0.9rem]"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e61f83] sm:h-5 sm:w-5">
                            <svg
                              viewBox="0 0 10 10"
                              className="h-2.5 w-2.5 fill-none stroke-white stroke-[2] sm:h-3 sm:w-3"
                            >
                              <polyline
                                points="1.5,5 4,7.5 8.5,2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            className={`leading-tight ${
                              isHighlight ? 'font-semibold text-[#e61f83]' : 'text-[#2d1a3d]'
                            }`}
                          >
                            {text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Note - font adjusts */}
          <p className="mt-3 text-[0.7rem] leading-relaxed text-[#555] sm:mt-4 sm:text-[0.8rem] lg:mt-5 lg:text-[0.88rem]">
            <span className="font-bold text-[#1a1a1a]">NOTE: </span>
            {modal.note}
          </p>

          {/* Footer row - fixed buttons */}
          <div className="mt-3 flex flex-col items-center gap-3 sm:mt-4 sm:flex-row lg:mt-6">
            <div className="hidden flex-1 sm:block" />

            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onInquire?.();
              }}
              className="h-10 w-full rounded-full border-2 border-[#e61f83] bg-transparent px-6 text-[#e61f83] text-[0.85rem] font-bold hover:bg-[#fff0f6] hover:text-[#e61f83] sm:h-11 sm:w-auto sm:px-10 sm:text-[0.9rem] lg:h-[50px] lg:px-14 lg:text-[1rem]"
            >
              Inquire
            </Button>

            <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
              <button
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous package"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3d2052] text-[#3d2052] transition hover:bg-[#f5eaf7] disabled:opacity-30 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={activeIndex === packages.length - 1}
                aria-label="Next package"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3d2052] text-[#3d2052] transition hover:bg-[#f5eaf7] disabled:opacity-30 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
