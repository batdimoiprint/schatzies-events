import { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, Sparkles, Flower2, Users } from 'lucide-react';
import { PackageCard } from '@/components/PackageCard';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { weddingPackages, debutPackages } from '@/data/packages';
import type { PackageWithModal } from '@/components/PackageModal';

const heroImage = '/Pictures/packages-hero.jpg';
const textureImage = '/Pictures/texture.jpg';

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
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8"
      >
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            className="animate-fade-in-up flex shrink-0 flex-col w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[380px]"
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
  const weddingRef = useRef<HTMLDivElement>(null);
  const debutRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auto-scroll to section based on query parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'wedding') {
      setTimeout(() => weddingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (type === 'debut') {
      setTimeout(() => debutRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [searchParams]);

  return (
    <>
      <LoadingScreen />
      <div>
        {/* ── Section 1: Hero ── */}
        <ScrollReveal variant="fade">
          <section
            className="relative -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            {/* Overall white overlay to lighten the whole image */}
            <div className="absolute inset-0 bg-white/5" />

            {/* Stronger white wash at the top behind navbar */}
            <div className="absolute top-0 left-0 right-0 h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-b from-white via-white/70 via-white/30 to-transparent z-[5]" />

            {/* Content centered in middle of section */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-[160px] sm:py-[260px] md:py-[360px] lg:py-[420px] text-center sm:px-6 animate-fade-in-up">
              <h1
                className="font-heading text-[clamp(2.2rem,6vw,5rem)] font-bold leading-tight bg-gradient-to-r from-[#FF0066] via-[#FF0066] to-[#4A1053] text-transparent bg-clip-text animate-fade-in animation-delay-200"
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
                We&apos;ve spent 17 years perfecting the art of the hassle-free milestone. Explore
                our curated wedding and debut collections designed to handle every detail from your
                first photo to your final dance.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Section 2: Wedding Packages ── */}
        <ScrollReveal variant="up">
          <div ref={weddingRef} className="relative -mt-[60px] sm:-mt-[90px] lg:-mt-[120px] z-10">
            {/* Textured SVG Wave at the top — sweeps into the hero */}
            <div className="relative w-full overflow-hidden leading-[0] z-20">
              <svg
                className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="satin-wave-pattern"
                    patternUnits="userSpaceOnUse"
                    width="1440"
                    height="120"
                  >
                    <image
                      href={textureImage}
                      x="0"
                      y="0"
                      width="1440"
                      height="120"
                      preserveAspectRatio="none"
                    />
                  </pattern>
                </defs>
                <path
                  d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                  fill="url(#satin-wave-pattern)"
                />
                <path
                  d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                  fill="black"
                  fillOpacity="0.4"
                />
              </svg>
            </div>

            {/* Wedding header with texture background — overlays hero */}
            <section
              className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${textureImage})` }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:px-20 lg:pt-12 lg:pb-24">
                <div className="text-center">
                  <h2
                    className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold text-transparent bg-clip-text animate-fade-in-up"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #FF0066 100%)',
                    }}
                  >
                    Wedding Packages
                  </h2>
                  <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-white sm:mt-3 animate-fade-in-up animation-delay-200">
                    Your Dream Day, Defined by Your Style.
                  </p>
                  <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-gray-300 sm:mt-2 animate-fade-in-up animation-delay-400">
                    From intimate gatherings to grand estate celebrations, discover
                    <br className="hidden sm:block" />
                    the curated package that perfectly mirrors your love story.
                  </p>
                </div>
              </div>

              {/* White wave at the bottom — transition to white cards area */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
                <svg
                  className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
                  viewBox="0 0 1440 120"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </section>

            {/* Wedding cards on white background */}
            <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
              <div className="w-full">
                {(() => {
                  const filteredWedding = weddingPackages.filter((p) => p.name !== 'Blooms');
                  return (
                    <PackageCarousel
                      packages={filteredWedding}
                      onView={(i) => navigate(`/packages/wedding/${filteredWedding[i].id}`)}
                    />
                  );
                })()}
              </div>
            </section>
          </div>
        </ScrollReveal>

        {/* ── Section 3: Debut Packages ── */}
        <ScrollReveal variant="up">
          <div ref={debutRef}>
            {/* Debut header with texture background */}
            <section
              className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${textureImage})` }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* White wave at the top — smooth transition from white cards */}
              <div className="relative w-full overflow-hidden leading-[0] z-20">
                <svg
                  className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
                  viewBox="0 0 1440 120"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,0 L1440,0 L1440,60 C1080,110 720,10 320,60 C160,80 60,70 0,50 Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:px-20 lg:pt-16 lg:pb-24">
                <div className="text-center">
                  <h2
                    className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold text-transparent bg-clip-text animate-fade-in-up"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #FF0066 100%)',
                    }}
                  >
                    Debut Packages
                  </h2>
                  <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-white sm:mt-3 animate-fade-in-up animation-delay-200">
                    Celebrate Your Glow-Up in Grand Style.
                  </p>
                  <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-gray-300 sm:mt-2 animate-fade-in-up animation-delay-400">
                    From chic intimate parties to high-fashion galas, discover the
                    <br className="hidden sm:block" />
                    package that perfectly captures your journey into adulthood.
                  </p>
                </div>
              </div>

              {/* White wave at the bottom — transition to white cards area */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
                <svg
                  className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
                  viewBox="0 0 1440 120"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </section>

            {/* Debut cards on white background */}
            <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
              <div className="w-full">
                <PackageCarousel
                  packages={debutPackages}
                  onView={(i) => navigate(`/packages/debut/${debutPackages[i].id}`)}
                />
              </div>
            </section>
          </div>
        </ScrollReveal>

        {/* ── Section 4: Seamless Planning ── */}
        <ScrollReveal variant="scale">
          <section className="relative overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-6 sm:pt-16 sm:pb-20 lg:px-28 lg:pt-20 lg:pb-24">
            <ScrollReveal variant="up" className="text-center">
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
            </ScrollReveal>

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
                  className="flex flex-col items-center rounded-3xl bg-white p-8 pb-12 text-center shadow-[0_8px_35px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(0,0,0,0.2)] sm:hover:-translate-y-3 sm:p-10 sm:pb-14 lg:p-12 lg:pb-16 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                    <Icon
                      className="h-10 w-10 text-[#FF0066] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-bold font-heading text-[#FF0066] sm:mt-5 sm:text-[1.2rem] lg:mt-6 lg:text-[1.3rem]">
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
    </>
  );
}
