import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Utensils,
  Scissors,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPackageById, getPackages, type EventPackage, type EventType } from '@/api/packages';
import {
  buildPackageNote,
  groupInclusions,
  packageImage,
  sortPackages,
} from '@/utils/package-display';

const iconMap = {
  user: User,
  utensils: Utensils,
  scissors: Scissors,
  video: Video,
} as const;

export default function PackageDetailsPage() {
  const { eventType, packageId } = useParams();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const apiEventType: EventType = eventType === 'debut' ? 'Debut' : 'Wedding';

  // Full package (metadata + pax + inclusions) for the current id.
  const { data: pkg, isLoading } = useQuery<EventPackage>({
    queryKey: ['packages', 'detail', packageId],
    queryFn: () => getPackageById(packageId!),
    enabled: !!packageId,
  });

  // Sibling packages of the same type, for prev/next navigation.
  const { data: siblingsData = [] } = useQuery<EventPackage[]>({
    queryKey: ['packages', apiEventType],
    queryFn: () => getPackages(apiEventType),
  });
  const siblings = sortPackages(siblingsData);

  if (isLoading) {
    return (
      <>
        <LoadingScreen />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Loading package…</p>
        </div>
      </>
    );
  }

  if (!pkg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Package not found</h1>
          <Button
            onClick={() => navigate('/event-packages')}
            className="mt-4 bg-[#FF0066] hover:bg-[#e60060] text-white"
          >
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const name = pkg.packageName;
  const description = pkg.description ?? '';
  const heroImage = packageImage(pkg, 0);
  const sideImage = packageImage(pkg, 1);
  const categories = groupInclusions(pkg.inclusions);
  const note = buildPackageNote(pkg);

  // Prev/Next package navigation
  const currentIndex = siblings.findIndex((p) => p.id === pkg.id);
  const prevPkg = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextPkg =
    currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const goToPackage = (targetPkg: EventPackage) => {
    setExpandedCategory(null);
    navigate(`/packages/${eventType}/${targetPkg.id}`);
  };

  return (
    <>
      <LoadingScreen />

      <ScrollReveal>
        {/* ── Hero Section ── */}
        <section className="relative z-20 -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen">
          {/* Full-bleed hero image */}
          <div className="absolute inset-0">
            <img src={heroImage} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Prev arrow */}
          {prevPkg && (
            <button
              onClick={() => goToPackage(prevPkg)}
              aria-label={`Previous: ${prevPkg.packageName}`}
              className="absolute left-3 sm:left-5 lg:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-all duration-300 group"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Next arrow */}
          {nextPkg && (
            <button
              onClick={() => goToPackage(nextPkg)}
              aria-label={`Next: ${nextPkg.packageName}`}
              className="absolute right-3 sm:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-all duration-300 group"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Content centered */}
          <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-center px-4 pt-[160px] pb-[100px] sm:pt-[220px] sm:pb-[140px] md:pt-[310px] md:pb-[200px] lg:pt-[380px] lg:pb-[240px] text-center sm:px-6 animate-fade-in-up">
            <h1
              className="font-heading text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.1] text-white"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              {name}
            </h1>

            <p className="mt-4 max-w-[42rem] text-[clamp(0.9rem,1.8vw,1.2rem)] leading-[1.8] font-sans text-white/85 sm:mt-5 lg:mt-6 animate-fade-in-up animation-delay-200">
              {description}
            </p>

            <Button
              onClick={() => navigate('/')}
              className="mt-8 h-11 rounded-full bg-[#FF0066] hover:bg-[#e60060] text-white px-8 sm:px-10 text-[0.9rem] sm:text-[0.95rem] font-bold transition-all shadow-[0_6px_20px_rgba(255,0,102,0.35)] hover:shadow-[0_8px_28px_rgba(255,0,102,0.45)] animate-fade-in-up animation-delay-400"
            >
              Back to home
            </Button>
          </div>

          {/* Bottom wave — curves downward into white section */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <svg
              className="block w-full h-[60px] sm:h-[80px] lg:h-[110px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,40 C240,110 480,110 720,70 C960,30 1200,60 1440,40 L1440,120 L0,120 Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* ── Package Inclusions Section ── */}
        <section className="relative z-10 bg-white py-8 sm:py-12 lg:py-16 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start">
            {/* LEFT: Image — flush to left edge of viewport, slides under hero wave */}
            <div className="hidden lg:block flex-shrink-0 lg:w-[45%] mt-[-110px]">
              <div className="relative overflow-hidden rounded-br-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                <img src={sideImage} alt={name} className="w-full h-[600px] object-cover" />
                {/* Wave overlay on top — uses full viewport width so curve matches hero exactly */}
                <div className="absolute top-0 left-0 z-10" style={{ width: '100vw' }}>
                  <svg
                    className="block w-full h-[60px] sm:h-[80px] lg:h-[110px]"
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,0 L1440,0 L1440,40 C1200,60 960,30 720,70 C480,110 240,110 0,40 Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile image — flush to left edge of viewport, slides under hero wave */}
            <div className="lg:hidden w-full mt-[-60px] sm:mt-[-80px] pr-4 sm:pr-6">
              <div className="relative overflow-hidden rounded-br-2xl shadow-lg">
                <img
                  src={sideImage}
                  alt={name}
                  className="w-full h-[250px] sm:h-[300px] object-cover"
                />
                {/* Wave overlay on top — uses full viewport width so curve matches hero exactly */}
                <div className="absolute top-0 left-0 z-10" style={{ width: '100vw' }}>
                  <svg
                    className="block w-full h-[60px] sm:h-[80px] lg:h-[110px]"
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,0 L1440,0 L1440,40 C1200,60 960,30 720,70 C480,110 240,110 0,40 Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="w-full lg:w-[55%] flex flex-col px-4 sm:px-6 lg:px-10 lg:pr-[8%] mt-8 lg:mt-0">
              <h2 className="font-heading text-[1.8rem] font-bold text-gray-900 sm:text-[2rem] lg:text-[2.3rem] mb-6 sm:mb-8">
                Package Inclusions
              </h2>

              {/* Scrollable Categories Container */}
              <div
                className="flex-1 overflow-y-auto pr-1 space-y-3 lg:max-h-[420px] package-inclusions-scroll"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#FF0066 #f3f4f6',
                }}
              >
                {categories.length === 0 && (
                  <p className="py-6 text-center text-[0.9rem] text-gray-500">
                    Inclusions for this package are being finalized. Please inquire for details.
                  </p>
                )}
                {categories.map((cat) => {
                  const Icon = iconMap[cat.iconName];
                  const isExpanded = expandedCategory === cat.title;

                  return (
                    <div
                      key={cat.title}
                      className="rounded-lg overflow-hidden border border-gray-200"
                    >
                      {/* Header - Clickable */}
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.title)}
                        className="w-full flex items-center justify-between gap-3 bg-gray-900 text-white px-5 sm:px-6 py-4 sm:py-[18px] hover:bg-gray-800 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 flex-shrink-0 text-white/70" />
                          <span className="font-bold text-[0.95rem] sm:text-[1.05rem] text-left">
                            {cat.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 text-white/50 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Content - Expandable */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="bg-white px-5 sm:px-6 py-4 sm:py-5">
                            <ul className="space-y-2.5">
                              {cat.items.map((item) => {
                                const isHighlight = typeof item === 'object';
                                const text = typeof item === 'object' ? item.text : item;
                                return (
                                  <li
                                    key={text}
                                    className="flex items-start gap-3 text-[0.88rem] sm:text-[0.93rem]"
                                  >
                                    <span className="mt-[3px] flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#FF0066]">
                                      <svg
                                        viewBox="0 0 10 10"
                                        className="h-2.5 w-2.5 fill-none stroke-white stroke-[2]"
                                      >
                                        <polyline
                                          points="1.5,5 4,7.5 8.5,2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </span>
                                    <span
                                      className={`leading-relaxed ${
                                        isHighlight
                                          ? 'font-semibold text-[#FF0066]'
                                          : 'text-gray-600'
                                      }`}
                                    >
                                      {text}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <p className="text-[0.88rem] sm:text-[0.93rem] leading-relaxed text-gray-600">
                  <span className="font-bold text-gray-800">NOTE: </span>
                  {note}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
