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
    <div className="flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-[#f0a0c8] bg-gradient-to-b from-[#ffe9f5] to-[#f9c6e3] shadow-md transition-all duration-300 hover:shadow-xl sm:w-[320px] sm:rounded-2xl md:w-[340px] lg:w-[360px] xl:w-[380px]">
      {/* Photo with spacing */}
      <div className="p-3 pb-0 sm:p-4 sm:pb-0">
        <div className="h-[200px] w-full overflow-hidden rounded-xl sm:h-[240px] md:h-[260px] lg:h-[280px] xl:h-[300px]">
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
        <p className="flex-1 text-[0.85rem] leading-[1.65] text-[#4a3050] line-clamp-4 sm:text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] xl:text-[1.05rem]">
          {pkg.description}
        </p>
        <div className="mt-1 flex justify-center sm:mt-2 md:mt-3">
          <Button
            onClick={onView}
            className="h-8 w-[100px] rounded-full bg-gradient-to-b from-[#FF0066] to-[#700F81] text-[0.75rem] font-bold uppercase tracking-wide shadow-[0_4px_12px_rgba(39,21,57,0.3)] hover:brightness-110 sm:h-9 sm:w-[110px] sm:text-[0.8rem] md:h-10 md:w-[120px] md:text-[0.85rem] lg:h-11 lg:w-[130px] lg:text-[0.9rem]"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
