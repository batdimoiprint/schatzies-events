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
}

export function PackageModal({ packages, activeIndex, onClose, onNavigate }: PackageModalProps) {
  const pkg = packages[activeIndex];
  const { modal } = pkg;
  const many = Math.max(...modal.categories.map((c) => c.items.length)) >= 4;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative flex w-full max-w-[1200px] flex-col rounded-3xl bg-white p-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Title */}
          <h2 className="text-[1.8rem] font-bold text-[#3d2052]">
            {pkg.name} Inclusion
          </h2>

          {/* 2×2 inclusion grid */}
          <div className="mt-5 grid flex-1 grid-cols-2 gap-4">
            {modal.categories.map((cat) => {
              const Icon = iconMap[cat.iconName];
              return (
                <div key={cat.title} className={`rounded-2xl bg-[#ede0f5] ${many ? 'p-4' : 'p-6'}`}>
                  <div className={`flex items-center gap-2 ${many ? 'mb-2' : 'mb-3'}`}>
                    <Icon className={`text-[#c2649b] ${many ? 'h-5 w-5' : 'h-7 w-7'}`} />
                    <span className={`font-bold text-[#3d1a5e] ${many ? 'text-[0.95rem]' : 'text-[1.08rem]'}`}>{cat.title}</span>
                  </div>
                  <ul className={many ? 'space-y-1.5' : 'space-y-2.5'}>
                    {cat.items.map((item) => {
                      const isHighlight = typeof item === 'object';
                      const text = typeof item === 'object' ? item.text : item;
                      return (
                        <li key={text} className={`flex items-center gap-2 ${many ? 'text-[0.85rem]' : 'text-[0.97rem]'}`}>
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e61f83]">
                            <svg viewBox="0 0 10 10" className="h-3 w-3 fill-none stroke-white stroke-[2]">
                              <polyline points="1.5,5 4,7.5 8.5,2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className={isHighlight ? 'font-semibold text-[#e61f83]' : 'text-[#2d1a3d]'}>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <p className="mt-5 text-[0.88rem] leading-relaxed text-[#555]">
            <span className="font-bold text-[#1a1a1a]">NOTE: </span>
            {modal.note}
          </p>

          {/* Footer row */}
          <div className="mt-6 flex items-center">
            <div className="flex-1" />

            <Button
              variant="outline"
              className="h-[50px] px-14 rounded-xl border-2 border-[#e61f83] bg-transparent text-[#e61f83] text-[1.05rem] font-bold hover:bg-[#fff0f6] hover:text-[#e61f83]"
            >
              Inquire
            </Button>

            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous package"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#3d2052] text-[#3d2052] transition hover:bg-[#f5eaf7] disabled:opacity-30"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={activeIndex === packages.length - 1}
                aria-label="Next package"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#3d2052] text-[#3d2052] transition hover:bg-[#f5eaf7] disabled:opacity-30"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
