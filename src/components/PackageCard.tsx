import { Button } from '@/components/ui/button';

export interface PackageItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface PackageCardProps {
  pkg: PackageItem;
  onView?: () => void;
}

export function PackageCard({ pkg, onView }: PackageCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:rounded-3xl">
      {/* Photo — edge-to-edge with inner rounding */}
      <div className="p-3 pb-0 sm:p-4 sm:pb-0">
        <div className="h-[200px] w-full overflow-hidden rounded-2xl sm:h-[240px] md:h-[260px] lg:h-[280px] xl:h-[300px]">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: `url(${pkg.image})` }}
            role="img"
            aria-label={pkg.name}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3 pb-5 sm:gap-3 sm:p-5 sm:pt-4 sm:pb-6 md:gap-4 md:p-6 md:pt-5 md:pb-7">
        <h3 className="text-center text-[1.1rem] font-bold text-[#1a1a1a] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] xl:text-[1.5rem]">
          {pkg.name}
        </h3>
        <p className="flex-1 text-center text-[0.85rem] leading-[1.65] text-[#555] line-clamp-4 sm:text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] xl:text-[1.05rem]">
          {pkg.description}
        </p>
        <div className="mt-1 flex justify-center sm:mt-2 md:mt-3">
          <Button
            onClick={onView}
            className="h-9 w-[110px] rounded-full bg-gradient-to-b from-[#FF0066] to-[#d00055] text-[0.8rem] font-bold uppercase tracking-wide shadow-[0_4px_16px_rgba(255,0,102,0.35)] hover:shadow-[0_6px_20px_rgba(255,0,102,0.45)] hover:brightness-110 sm:h-10 sm:w-[120px] sm:text-[0.85rem] md:h-11 md:w-[130px] md:text-[0.9rem] lg:h-12 lg:w-[140px] lg:text-[0.95rem]"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
