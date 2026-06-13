import { Button } from '@/components/ui/button';

export interface PackageItem {
  id: string | number;
  name: string;
  description: string;
  image: string;
  detailsHeroImage?: string;
  detailsImage?: string;
}

interface PackageCardProps {
  pkg: PackageItem;
  onView?: () => void;
}

export function PackageCard({ pkg, onView }: PackageCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] hover:-translate-y-1 sm:rounded-[28px]">
      {/* Image Section — Upper portion with fixed aspect ratio */}
      <div className="relative w-full pt-[75%] overflow-hidden bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pkg.image})` }}
          role="img"
          aria-label={pkg.name}
        />
      </div>

      {/* Content Section — Lower portion */}
      <div className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-6 md:gap-5 md:p-7">
        <h3 className="font-montserrat text-center text-[1.1rem] font-semibold text-[#1a1a1a] sm:text-[1.2rem] md:text-[1.3rem] lg:text-[1.4rem] xl:text-[1.5rem]">
          {pkg.name}
        </h3>
        <p className="font-montserrat text-center text-[0.85rem] leading-[1.6] text-[#666] line-clamp-3 sm:text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] xl:text-[1.05rem]">
          {pkg.description}
        </p>
        <div className="mt-2 flex justify-center sm:mt-3 md:mt-4">
          <Button
            onClick={onView}
            className="h-9 w-[110px] rounded-full bg-[#FF0066] text-[0.8rem] font-semibold uppercase tracking-wide text-white shadow-[0_4px_12px_rgba(255,0,102,0.3)] hover:shadow-[0_6px_16px_rgba(255,0,102,0.4)] active:scale-95 transition-all sm:h-10 sm:w-[120px] sm:text-[0.85rem] md:h-11 md:w-[130px] md:text-[0.9rem] lg:h-12 lg:w-[140px] lg:text-[0.95rem]"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
