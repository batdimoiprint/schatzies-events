import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InquiryForm } from '@/components/InquiryForm';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const heroImages = [
  '/Pictures/landing-hero.jpg',
  '/Pictures/hero-1.jpg',
  '/Pictures/hero-2.jpg',
  '/Pictures/hero-3.jpg',
  '/Pictures/hero-4.jpg',
  '/Pictures/hero-5.jpg',
  '/Pictures/hero-6.jpg',
  '/Pictures/hero-7.jpg',
  '/Pictures/hero-8.jpg',
  '/Pictures/hero-9.jpg',
  '/Pictures/hero-10.jpg',
];

// Section 2 — spotlight gallery images
const galleryRow1 = [
  { src: '/Pictures/gallery-1.jpg', alt: 'Black & silver balloon setup' },
  { src: '/Pictures/gallery-2.jpg', alt: 'Colorful floral stage' },
  { src: '/Pictures/gallery-3.jpg', alt: 'Elegant arch decor' },
];

const galleryRow2 = [
  { src: '/Pictures/gallery-4.jpg', alt: 'Peacock themed reception' },
  { src: '/Pictures/gallery-5.jpg', alt: 'Debut stage setup' },
  { src: '/Pictures/gallery-6.jpg', alt: 'Grand chandelier venue' },
  { src: '/Pictures/gallery-7.jpg', alt: 'Floral curtain detail' },
];

// Section 3 — service feature images
const serviceImages = {
  wedding: '/Pictures/service-wedding.jpg',
  debut: '/Pictures/service-debut.jpg',
  debutAlt: '/Pictures/service-debut-2.jpg',
};

export function LandingPage() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showInquiryConfirmed, setShowInquiryConfirmed] = useState(false);

  useEffect(() => {
    if (searchParams.get('inquiry') === 'true') {
      setInquiryOpen(true);
      // Clean up the param
      const next = new URLSearchParams(searchParams);
      next.delete('inquiry');
      setSearchParams(next, { replace: true });
    }

    if (searchParams.get('inquiry_confirmed') === 'true') {
      setShowInquiryConfirmed(true);
      // Clean up the param
      const next = new URLSearchParams(searchParams);
      next.delete('inquiry_confirmed');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  const handleInquire = () => {
    setInquiryOpen(true);
  };

  return (
    <>
      <LoadingScreen />

      {/* ── Inquiry Confirmed Success Modal ── */}
      {showInquiryConfirmed && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowInquiryConfirmed(false)}
        >
          <div
            className="flex w-[380px] flex-col items-center rounded-2xl bg-white px-8 py-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Green check circle */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="mt-5 text-[1.4rem] font-bold text-[#1a1225]">Inquiry Submitted!</h3>
            <p className="mt-2 text-center text-[0.88rem] leading-[1.6] text-gray-500">
              Your inquiry has been confirmed and submitted successfully! Our team will review it and get back to you within 2-3 business days.
            </p>
            <button
              onClick={() => setShowInquiryConfirmed(false)}
              className="mt-6 h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] px-8 text-[0.88rem] font-bold text-white shadow-lg transition hover:brightness-110"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Section 1: ── */}
      <section
        id="hero"
        className="relative -mt-[88px] flex min-h-[60vh] flex-col overflow-hidden sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
      >
        {/* Background image with smooth crossfade */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Modern gradient overlay - animated */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF589C]/40 via-[#FD78AD]/20 to-transparent animate-gradient-slow" />

        {/* White blur overlay on left side that fades to middle */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, white 0%, white 25%, transparent 100%)',
          }}
        />

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

        {/* Animated accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0066] via-[#4A1053] to-transparent transform origin-left animate-slide-in" />

        {/* Spacer for fixed header */}
        <div className="h-[88px] shrink-0 sm:h-[110px] lg:h-[173px]" />

        {/* Left-aligned content with fade-in animation */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 animate-fade-in-up">
          <h1
            className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight text-left"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome to
            <br />
            Schatzies Events!
          </h1>

          <p className="mt-4 max-w-[40rem] text-[clamp(1rem,1.5vw,1.3rem)] font-semibold leading-tight text-[#3d2052] text-left sm:mt-6 animate-slide-in-left">
            Your <span className="font-bold text-[#FF0066] uppercase">most trusted</span> team!
          </p>

          <p className="mt-3 max-w-[35rem] text-[clamp(0.9rem,1.3vw,1.05rem)] leading-[1.7] text-black/80 text-left sm:mt-4 animate-slide-in-left animation-delay-200">
            Premium wedding and debut planning for those who want to be a guest at their own
            celebration. We handle the stress; you handle the memories.
          </p>

          <Button
            onClick={handleInquire}
            className="mt-6 h-11 rounded-full bg-white px-8 text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.2)] hover:bg-gray-100 hover:shadow-lg sm:h-14 sm:min-w-[160px] sm:px-9 sm:text-base lg:h-16 lg:min-w-[180px] lg:px-10 lg:text-lg self-start transition-all duration-300 hover:scale-105 animate-slide-in-left animation-delay-400"
          >
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #FF0066 0%, #4A1053 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Inquire
            </span>
          </Button>
        </div>
      </section>

      <ScrollReveal>
        <SpotlightSection />
      </ScrollReveal>
      <ScrollReveal>
        <ServicesSection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimonialsSection />
      </ScrollReveal>

      {inquiryOpen && <InquiryForm onClose={() => setInquiryOpen(false)} />}
    </>
  );
}

/* ─────────────────────────────────────────
   Section 2 — Spotlight Gallery (Optimized)
   ───────────────────────────────────────── */
function SpotlightSection() {
  const row1Loop = [...galleryRow1, ...galleryRow1];
  const row2Loop = [...galleryRow2, ...galleryRow2];

  return (
    <section id="spotlight" className="overflow-hidden bg-white py-16 lg:py-24">
      <h2 className="mx-auto max-w-[48rem] px-6 text-center font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.2] font-bold tracking-tight text-[#1a1225] animate-fade-in">
        Step Into the <span className="text-[#e61f83]">Spotlight</span>,
        <br />
        We'll Handle the <span className="text-[#e61f83]">Stage</span>.
      </h2>

      {/* Row 1 */}
      <div className="group relative mt-10 flex overflow-hidden">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-8 pr-8">
          {row1Loop.map((img, i) => (
            <div
              key={`r1-${i}`}
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 hover:shadow-xl lg:h-[18rem] lg:w-[28rem]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
        <div
          className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-8 pr-8"
          aria-hidden
        >
          {row1Loop.map((img, i) => (
            <div
              key={`r1d-${i}`}
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 hover:shadow-xl lg:h-[18rem] lg:w-[28rem]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="group relative mt-5 flex overflow-hidden">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-8 pr-8">
          {row2Loop.map((img, i) => (
            <div
              key={`r2-${i}`}
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 hover:shadow-xl lg:h-[18rem] lg:w-[28rem]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
        <div
          className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-8 pr-8"
          aria-hidden
        >
          {row2Loop.map((img, i) => (
            <div
              key={`r2d-${i}`}
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 hover:shadow-xl lg:h-[18rem] lg:w-[28rem]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[52rem] px-6 text-center">
        <p className="font-sans text-[clamp(1rem,1.6vw,1.2rem)] font-normal leading-[1.7] text-[#3d2052] animate-fade-in-up">
          Your milestone is a masterpiece in the making. While you focus on making memories and
          greeting your guests, our team ensures every light, sound, and moment is executed to
          perfection.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Section 3 — Services Feature Blocks
   ───────────────────────────────────────── */
function ServicesSection() {
  return (
    <section id="services" className="bg-[#fdf2f6] py-10 lg:py-24">
      <div className="mx-auto max-w-[90rem] space-y-4 px-3 sm:px-6 lg:space-y-12 lg:px-8">
        {/* Block 1 */}
        <div className="grid grid-cols-2 items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] transition-all duration-500 hover:shadow-xl">
          <div className="flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-16 animate-fade-in-left">
            <h3 className="font-heading text-[clamp(0.85rem,3vw,3.5rem)] leading-[1.2] font-bold text-[#1a1225]">
              A <span className="text-[#e61f83]">Love Story</span> Told in
              <br />
              Every Detail
            </h3>
            <p className="mt-2 lg:mt-4 font-sans text-[clamp(0.65rem,1.3vw,1.2rem)] leading-[1.5] lg:leading-[1.7] text-[#3d2052]">
              We don&rsquo;t just plan weddings; we protect your peace. From intimate vows to grand
              ballrooms, we ensure the only thing you focus on is the person at the end of the
              aisle.
            </p>
          </div>
          <div className="min-h-[10rem] sm:min-h-[20rem] lg:min-h-[32rem] overflow-hidden">
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${serviceImages.wedding})` }}
              role="img"
              aria-label="Elegant wedding venue setup"
            />
          </div>
        </div>

        {/* Block 2 */}
        <div className="grid grid-cols-2 items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] transition-all duration-500 hover:shadow-xl">
          <div className="relative min-h-[10rem] sm:min-h-[20rem] lg:min-h-[32rem] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${serviceImages.debut})` }}
              role="img"
              aria-label="Debut celebration photos"
            />
            <div
              className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 h-[38%] w-[38%] rounded-xl bg-cover bg-center shadow-xl ring-2 ring-white/60 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
              style={{ backgroundImage: `url(${serviceImages.debutAlt})` }}
              role="img"
              aria-label="Debut celebration detail"
            />
          </div>
          <div className="flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-16 animate-fade-in-right">
            <h3 className="font-heading text-[clamp(0.85rem,3vw,3.5rem)] leading-[1.2] font-bold text-[#1a1225]">
              <span className="text-[#e61f83]">Your 18th:</span> More Than a
              <br />
              Birthday, It&rsquo;s a <span className="text-[#e61f83]">Milestone</span>
            </h3>
            <p className="mt-2 lg:mt-4 font-sans text-[clamp(0.65rem,1.3vw,1.2rem)] leading-[1.5] lg:leading-[1.7] text-[#3d2052]">
              Eighteen years in the making, designed in a single night. We transform your milestone
              into a cinematic celebration that captures exactly who you are and who you&rsquo;re
              becoming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Section 4 — Testimonials
   ───────────────────────────────────────── */
const testimonials = [
  {
    name: 'Ainna O.',
    text: 'Thank you so much to Schatzies Team for making our dream wedding come true! Glad we visited their booth last year at Wedding Expo event at SM MOA...',
  },
  {
    name: 'Idz AB.',
    text: "A HUGE THANK YOU to Schatzies Events Management led by Ms. Aileen Cabornay for making Heart's 1st birthday party so special. It was an amazing party enjoyed by all - both kids and adults...",
  },
  {
    name: 'JoyAnn R.F',
    text: 'I absolutely recommend Schatzies Event Management to have the best wedding ever and stress free planning! Our wedding day was perfect and I know it...',
  },
  {
    name: 'Mary Dee Macapugas B.',
    text: "Highly recommended! sobrang babait ng staff's ang gaan kasama Thank You so much Schatzies events Management sa napakagandang outcome ng wedding di namin inexpect, sobrang ganda talaga. More power to you guys",
  },
];

function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-[#fce4ef] to-[#f8d0e3] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[48rem] px-6 text-center">
        <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] font-bold tracking-tight text-[#1a1225] animate-fade-in">
          The Schatzies <span className="text-[#e61f83]">Experience</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-[36rem] font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052] animate-fade-in-up">
          Celebrating 15 years of flawless events through the words of those who experienced the
          magic firsthand.
        </p>
      </div>

      <div className="mx-auto mt-6 grid grid-cols-2 max-w-[80rem] gap-3 px-3 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
        {testimonials.map((t, idx) => (
          <Card
            key={t.name}
            className="relative rounded-xl border-0 bg-white/80 px-3 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-white/90 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <span className="absolute right-2 top-2 font-heading text-[1.5rem] leading-none text-[#c2649b] sm:right-5 sm:top-4 sm:text-[2.5rem] lg:right-6 lg:top-5 lg:text-[3rem]">
              &ldquo;&rdquo;
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#501f5a] sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                <span className="text-[0.65rem] font-bold text-white sm:text-sm lg:text-base">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-sans text-[0.7rem] font-bold text-[#1a1225] sm:text-[0.95rem] lg:text-[1rem]">
                  {t.name}
                </p>
                <p className="text-[0.6rem] font-semibold text-[#e61f83] sm:text-[0.75rem] lg:text-[0.8rem]">
                  Recommends!
                </p>
              </div>
            </div>

            <p className="mt-2 font-sans text-[0.65rem] leading-[1.5] text-[#3d2052] sm:mt-3 sm:text-[0.9rem] sm:leading-[1.6] lg:mt-4 lg:text-[0.95rem]">
              {t.text}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
