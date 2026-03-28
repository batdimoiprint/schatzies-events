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
    <div className="flex w-[calc(33.333%-1.4rem)] min-w-[420px] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-[#f0a0c8] bg-gradient-to-b from-[#ffe9f5] to-[#f9c6e3] shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Photo with spacing - extra tall image */}
      <div className="p-4 pb-0">
        <div className="h-[420px] w-full overflow-hidden rounded-2xl">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{ backgroundImage: `url(${pkg.image})` }}
            role="img"
            aria-label={pkg.name}
          />
        </div>
      </div>

      {/* Body - extra padding */}
      <div className="flex flex-1 flex-col gap-6 p-8 pt-6 pb-10">
        <h3 className="text-center text-[2rem] font-bold text-[#1a1a1a]">{pkg.name}</h3>
        <p className="flex-1 text-[1.2rem] leading-[1.75] text-[#4a3050] line-clamp-5">
          {pkg.description}
        </p>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onView}
            className="h-[80px] w-[220px] rounded-2xl bg-gradient-to-b from-[#FF0066] to-[#700F81] text-[1.5rem] font-bold uppercase tracking-wide shadow-[0_8px_20px_rgba(39,21,57,0.4)] hover:brightness-110"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
