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
    <div className="flex w-[calc(33.333%-1.4rem)] min-w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-[#f0a0c8] bg-gradient-to-b from-[#ffe9f5] to-[#f9c6e3] shadow-md">
      {/* Photo */}
      <div className="h-[260px] w-full overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${pkg.image})` }}
          role="img"
          aria-label={pkg.name}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 p-8">
        <h3 className="text-[1.35rem] font-bold text-[#1a1a1a]">{pkg.name}</h3>
        <p className="flex-1 text-[1.05rem] leading-[1.75] text-[#4a3050]">
          {pkg.description}
        </p>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onView}
            className="h-[50px] w-[140px] rounded-2xl bg-gradient-to-b from-[#e61f83] via-[#9b2d8a] to-[#501f5a] text-[1rem] font-bold uppercase tracking-wide shadow-[0_6px_16px_rgba(39,21,57,0.35)] hover:brightness-110"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
