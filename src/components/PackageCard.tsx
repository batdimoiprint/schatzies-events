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
    <div className="flex w-[80vw] min-w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-[#f0a0c8] bg-gradient-to-b from-[#ffe9f5] to-[#f9c6e3] shadow-md transition-all duration-300 hover:shadow-xl sm:w-[calc(33.333%-1.4rem)] sm:min-w-[320px] sm:rounded-3xl md:min-w-[420px]">
      {/* Photo with spacing */}
      <div className="p-3 pb-0 sm:p-4 sm:pb-0">
        <div className="h-[260px] w-full overflow-hidden rounded-xl sm:h-[340px] sm:rounded-2xl md:h-[420px]">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: `url(${pkg.image})` }}
            role="img"
            aria-label={pkg.name}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-4 pb-6 sm:gap-6 sm:p-8 sm:pt-6 sm:pb-10">
        <h3 className="text-center text-[1.3rem] font-bold text-[#1a1a1a] sm:text-[1.6rem] md:text-[2rem]">
          {pkg.name}
        </h3>
        <p className="flex-1 text-[0.95rem] leading-[1.75] text-[#4a3050] line-clamp-5 sm:text-[1.1rem] md:text-[1.2rem]">
          {pkg.description}
        </p>
        <div className="mt-2 flex justify-center sm:mt-4">
          <Button
            onClick={onView}
            className="h-12 w-[160px] rounded-xl bg-gradient-to-b from-[#FF0066] to-[#700F81] text-[1rem] font-bold uppercase tracking-wide shadow-[0_8px_20px_rgba(39,21,57,0.4)] hover:brightness-110 sm:h-16 sm:w-[180px] sm:rounded-2xl sm:text-[1.2rem] md:h-[80px] md:w-[220px] md:text-[1.5rem]"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
