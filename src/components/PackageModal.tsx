import {
  X,
  ArrowLeft,
  ArrowRight,
  User,
  Utensils,
  Scissors,
  Video,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    modal.categories[0]?.title || null
  );

  const coverImg = pkg.image || '/Pictures/packages-hero.jpg';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Dialog - Two-column layout */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative flex h-[85vh] w-[95vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl lg:flex-row lg:w-[1100px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* LEFT: Image Section */}
          <div className="hidden lg:flex w-1/2 overflow-hidden bg-gray-100">
            <img
              src={coverImg}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT: Content Section */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto p-5 sm:p-8">
            {/* Title */}
            <h2 className="text-[1.3rem] font-bold text-brand-deep sm:text-[1.6rem] lg:text-[1.8rem]">
              Package Inclusions
            </h2>

            {/* Expandable Categories */}
            <div className="mt-6 space-y-3 sm:space-y-4 flex-1">
              {modal.categories.map((cat) => {
                const Icon = iconMap[cat.iconName];
                const isExpanded = expandedCategory === cat.title;

                return (
                  <div
                    key={cat.title}
                    className="border-2 border-gray-300 rounded-lg overflow-hidden"
                  >
                    {/* Header - Clickable */}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.title)}
                      className="w-full flex items-center justify-between gap-3 bg-gray-900 text-white px-4 sm:px-5 py-3 sm:py-4 hover:bg-gray-800 transition"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="font-bold text-[0.95rem] sm:text-[1rem] lg:text-[1.1rem] text-left">
                          {cat.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Content - Expandable */}
                    {isExpanded && (
                      <div className="bg-white px-4 sm:px-5 py-3 sm:py-4">
                        <ul className="space-y-2 sm:space-y-2.5">
                          {cat.items.map((item) => {
                            const isHighlight = typeof item === 'object';
                            const text = typeof item === 'object' ? item.text : item;
                            return (
                              <li
                                key={text}
                                className="flex items-start gap-2 text-[0.85rem] sm:text-[0.9rem] lg:text-[0.95rem]"
                              >
                                <span className="mt-0.5 flex h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand">
                                  <svg
                                    viewBox="0 0 10 10"
                                    className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-none stroke-white stroke-[2]"
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
                                    isHighlight ? 'font-semibold text-brand' : 'text-gray-700'
                                  }`}
                                >
                                  {text}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <p className="mt-4 text-[0.75rem] sm:text-[0.8rem] lg:text-[0.85rem] leading-relaxed text-gray-600">
              <span className="font-bold text-gray-800">NOTE: </span>
              {modal.note}
            </p>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4 items-center sm:flex-row">
              <div className="hidden sm:flex-1 sm:block" />

              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onInquire?.();
                }}
                className="h-10 w-full rounded-full border-2 border-brand bg-transparent px-6 text-brand text-[0.85rem] font-bold hover:bg-secondary sm:h-11 sm:w-auto sm:px-10 sm:text-[0.9rem] lg:h-[50px] lg:px-14 lg:text-[1rem]"
              >
                Inquire
              </Button>

              <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
                <button
                  onClick={() => onNavigate(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous package"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-deep text-brand-deep transition hover:bg-secondary disabled:opacity-30 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => onNavigate(activeIndex + 1)}
                  disabled={activeIndex === packages.length - 1}
                  aria-label="Next package"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-deep text-brand-deep transition hover:bg-secondary disabled:opacity-30 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
