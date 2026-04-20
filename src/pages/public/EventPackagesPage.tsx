import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, Sparkles, Flower2, Users } from 'lucide-react';
import { PackageCard } from '@/components/PackageCard';
import { PackageModal } from '@/components/PackageModal';
import { InquiryForm } from '@/components/InquiryForm';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { weddingPackages, debutPackages } from '@/data/packages';
import type { PackageWithModal } from '@/components/PackageModal';

const heroImage = '/Pictures/packages-hero.jpg';

// ── Carousel component ────────────────────────────────────────
function PackageCarousel({
  packages,
  onView,
}: {
  packages: PackageWithModal[];
  onView: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 32
      : 400;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative px-4 sm:px-0">
      {/* Left arrow */}
      <Button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        variant="ghost"
        size="icon"
        className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-left-5 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
      </Button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8"
      >
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <PackageCard pkg={pkg} onView={() => onView(i)} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <Button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        variant="ghost"
        size="icon"
        className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
}

export default function EventPackagesPage() {
  const [modal, setModal] = useState<{ packages: PackageWithModal[]; index: number } | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState<{
    packageId: number;
    eventType: string;
  } | null>(null);
  const weddingRef = useRef<HTMLDivElement>(null);
  const debutRef = useRef<HTMLDivElement>(null);

  const scrollToWedding = () => {
    weddingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDebut = () => {
    debutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquireFromPackage = () => {
    if (modal) {
      const eventType = modal.packages === weddingPackages ? 'Wedding' : 'Debut';
      const pkg = modal.packages[modal.index];
      setSelectedPackageData({ packageId: pkg.id, eventType });
      setInquiryOpen(true);
    }
  };

  return (
    <>
      <LoadingScreen />
      <div>
        {/* ── Section 1: Hero ── */}
        <ScrollReveal>
          <section
            className="relative -mt-[88px] flex min-h-[60vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            {/* Pink gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF589C]/60 via-[#FD78AD]/40 to-transparent" />

            {/* White overlay */}
            <div className="absolute inset-0 bg-white/40" />

            {/* Subtle dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

            {/* Spacer */}
            <div className="h-[88px] shrink-0 sm:h-[110px] lg:h-[173px]" />

            {/* Centered content */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 animate-fade-in-up">
              <h1
                className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight bg-gradient-to-r from-[#FF0066] via-[#FF0066] to-[#4A1053] text-transparent bg-clip-text animate-fade-in animation-delay-200"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
                }}
              >
                Your Dream Celebration,
                <br />
                All-In-One.
              </h1>

              <p className="mt-4 max-w-[40rem] text-[clamp(0.9rem,1.5vw,1.2rem)] leading-[1.7] text-black sm:mt-6 animate-slide-in-left animation-delay-400">
                We&apos;ve spent 15 years perfecting the art of the hassle-free milestone. Explore
                our curated wedding and debut collections designed to handle every detail from your
                first photo to your final dance.
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:gap-5">
                <Button
                  onClick={scrollToWedding}
                  className="group h-12 min-w-[140px] rounded-full bg-white px-8 font-sans text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.2)] hover:shadow-lg sm:h-14 sm:min-w-[160px] sm:text-base lg:h-16 lg:min-w-[180px] lg:text-lg animate-slide-in-left animation-delay-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF0066] hover:to-[#4A1053] overflow-hidden"
                >
                  <span
                    className="transition-all duration-300"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Wedding
                  </span>
                  <span
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: 'white' }}
                  >
                    Wedding
                  </span>
                </Button>

                <Button
                  onClick={scrollToDebut}
                  className="group h-12 min-w-[140px] rounded-full bg-white px-8 font-sans text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.2)] hover:shadow-lg sm:h-14 sm:min-w-[160px] sm:text-base lg:h-16 lg:min-w-[180px] lg:text-lg animate-slide-in-left animation-delay-800 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF0066] hover:to-[#4A1053] overflow-hidden"
                >
                  <span
                    className="transition-all duration-300"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Debut
                  </span>
                  <span
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: 'white' }}
                  >
                    Debut
                  </span>
                </Button>
              </div>
            </div>
          </section>

          {/* ── Section 2: Wedding Packages carousel ── */}
          <div ref={weddingRef}>
            <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
              <div className="mb-6 text-center sm:mb-8 lg:mb-10">
                <h2
                  className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text animate-fade-in-up"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
                  }}
                >
                  Wedding Packages
                </h2>
                <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-[#4A1053] sm:mt-3 animate-fade-in-up animation-delay-200">
                  Your Dream Day, Defined by Your Style.
                </p>
                <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-[#4a4a4a] sm:mt-2 animate-fade-in-up animation-delay-400">
                  From intimate gatherings to grand estate celebrations, discover
                  <br className="hidden sm:block" />
                  the curated package that perfectly mirrors your love story.
                </p>
              </div>

              <div className="w-full">
                <PackageCarousel
                  packages={weddingPackages}
                  onView={(i) => setModal({ packages: weddingPackages, index: i })}
                />
              </div>
            </section>
          </div>

          {/* ── Section 3: Debut Packages carousel ── */}
          <div ref={debutRef}>
            <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
              <div className="mb-6 text-center sm:mb-8 lg:mb-10">
                <h2
                  className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text animate-fade-in-up"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
                  }}
                >
                  Debut Packages
                </h2>
                <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-[#4A1053] sm:mt-3 animate-fade-in-up animation-delay-200">
                  Celebrate Your Glow-Up in Grand Style.
                </p>
                <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-[#4a4a4a] sm:mt-2 animate-fade-in-up animation-delay-400">
                  From chic intimate parties to high-fashion galas, discover the
                  <br className="hidden sm:block" />
                  package that perfectly captures your journey into adulthood.
                </p>
              </div>

              <div className="w-full">
                <PackageCarousel
                  packages={debutPackages}
                  onView={(i) => setModal({ packages: debutPackages, index: i })}
                />
              </div>
            </section>
          </div>

          {/* ── Section 4: Seamless Planning + Footer ── */}
          <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#fff0f7_0%,#fddcee_45%,#f9b8d8_100%)] px-4 pb-0 pt-12 sm:px-6 sm:pt-16 lg:px-28 lg:pt-20">
            <div className="text-center">
              <h2 className="font-heading text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#FF0066] to-[#4A1053] bg-clip-text text-transparent">
                  Seamless Planning,
                </span>{' '}
                <span className="bg-gradient-to-r from-[#4A1053] to-[#FF0066] bg-clip-text text-transparent">
                  Proven Results
                </span>
              </h2>
              <p className="mt-3 text-[clamp(1rem,1.8vw,1.3rem)] font-bold font-sans text-[#4A1053] sm:mt-4">
                Your Journey to a Flawless Celebration Starts Here
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-[80rem] grid-cols-1 gap-6 px-2 sm:mt-14 sm:grid-cols-3 sm:gap-8 sm:px-4 lg:mt-16 lg:gap-10">
              {[
                {
                  Icon: Sparkles,
                  title: 'Stress-Free Planning',
                  body: 'We handle the complex logistics so you can simply stay in the moment and enjoy your day.',
                },
                {
                  Icon: Flower2,
                  title: 'Bespoke Design',
                  body: 'Elegant venue setup and styling with decorations and designs that match the unique theme and style of your celebration.',
                },
                {
                  Icon: Users,
                  title: 'Full Coordination',
                  body: 'A reliable team that manages the program flow from preparation to the actual day, ensuring everything runs smoothly.',
                },
              ].map(({ Icon, title, body }, index) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-[#FF0066]/30 bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                    <Icon
                      className="h-10 w-10 text-[#FF0066] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-bold font-heading text-[#1a1a1a] sm:mt-5 sm:text-[1.2rem] lg:mt-6 lg:text-[1.3rem]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-[0.85rem] leading-[1.6] font-sans text-[#3d2052] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[1rem]">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              variant="ghost"
              size="icon"
              className="absolute bottom-6 right-6 h-10 w-10 rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
            >
              <ChevronUp className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
            </Button>
          </section>
        </ScrollReveal>
      </div>

      {/* ── Package detail modal ── */}
      {modal && (
        <PackageModal
          packages={modal!.packages}
          activeIndex={modal!.index}
          onClose={() => setModal(null)}
          onNavigate={(i) => setModal((prev) => (prev ? { ...prev, index: i } : null))}
          onInquire={() => handleInquireFromPackage()}
        />
      )}

      {/* ── Inquiry Form Modal ── */}
      {inquiryOpen && (
        <InquiryForm
          onClose={() => setInquiryOpen(false)}
          selectedPackageId={selectedPackageData?.packageId}
          selectedEventType={selectedPackageData?.eventType}
        />
      )}
    </>
  );
}
