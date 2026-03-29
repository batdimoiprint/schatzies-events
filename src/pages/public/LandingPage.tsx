// src/pages/public/LandingPage.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { InquiryForm } from '@/components/InquiryForm';
import { ChatWidget } from '@/components/ChatWidget';

// Uniform grid — all cards the same size. Replace srcs with real photos when ready.
const bentoGallery = [
  { src: '/Pictures/hero-1.jpg', alt: 'Event table setup' },
  { src: '/Pictures/hero-1.jpg', alt: 'Grand ballroom celebration' },
  { src: '/Pictures/hero-1.jpg', alt: 'Floral arch decor' },
  { src: '/Pictures/hero-1.jpg', alt: 'Wedding reception detail' },
  { src: '/Pictures/hero-1.jpg', alt: 'Debut stage setup' },
  { src: '/Pictures/hero-1.jpg', alt: 'Venue chandelier' },
  { src: '/Pictures/hero-1.jpg', alt: 'Event centerpiece' },
  { src: '/Pictures/hero-1.jpg', alt: 'Dining setup' },
  { src: '/Pictures/hero-1.jpg', alt: 'Reception detail' },
];

// Section 2 — gallery images (place in public/Pictures/)
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

// Section 3 — service feature images (place in public/Pictures/)
const serviceImages = {
  wedding: '/Pictures/service-wedding.jpg',
  debut: '/Pictures/service-debut.jpg',
  debutAlt: '/Pictures/service-debut-2.jpg',
};

export function LandingPage() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const handleInquire = () => {
    setInquiryOpen(true);
  };

  return (
    <>
      <section className="relative min-h-[calc(100vh-100px)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_70%,rgba(255,255,255,0.92),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(230,31,131,0.08),transparent_38%),radial-gradient(circle_at_70%_72%,rgba(80,31,90,0.09),transparent_40%)]" />

        <div className="grid min-h-[calc(100vh-100px)] w-full items-start pt-8 sm:pt-12 lg:grid-cols-[42%_58%] lg:pt-16">
          {/* ── Left: text content ── */}
          <article className="relative z-10 px-5 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-20 lg:py-0">
            <h2 className="font-heading font-semibold leading-[0.9] tracking-tight">
              <span className="block text-[clamp(1.8rem,5vw,4.5rem)] font-semibold text-[#3d2052]">
                Welcome to
              </span>
              <span className="mt-1 block text-[clamp(3.2rem,10vw,9rem)] bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                Schatzies
              </span>
              <span className="block text-[clamp(3.2rem,10vw,9rem)] bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                Events!
              </span>
            </h2>

            <p className="mt-3 text-[clamp(1rem,1.9vw,1.7rem)] font-semibold leading-tight text-[#3d2052] sm:mt-5">
              Your <span className="font-bold text-[#FF0066] uppercase">most trusted</span> team!
            </p>

            <p className="mt-2 max-w-[30rem] text-[clamp(0.9rem,1.5vw,1.3rem)] font-sans leading-[1.55] text-[#6b4d80]">
              Premium wedding and debut planning for those who want to be a guest at their own
              celebration. We handle the stress; you handle the memories.
            </p>

            <Button
              onClick={handleInquire}
              className="mt-4 h-11 rounded-2xl bg-gradient-to-b from-[#FF0066] to-[#700F81] px-8 text-base font-bold uppercase tracking-wide shadow-[0_12px_28px_rgba(39,21,57,0.5)] hover:brightness-110 sm:h-14 sm:px-10 sm:text-lg"
            >
              Inquire
            </Button>
          </article>

          {/* ── Right: tilted uniform grid gallery (desktop) ── */}
          <div
            className="relative hidden h-[calc(100vh-100px)] lg:block"
            style={{
              maskImage:
                'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, rgba(0,0,0,0.6) 55%, transparent 80%)',
              overflow: 'visible',
            }}
          >
            {/* Tilted + scaled — overflow:visible lets cards bleed past section edges */}
            <div
              className="absolute inset-0 -rotate-[15deg] scale-125"
              style={{ overflow: 'visible' }}
            >
              {/* Uniform 3×3 grid — all cards the same size */}
              <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-4 p-6">
                {bentoGallery.map((item, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl bg-white p-[6px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile: simplified bento grid ── */}
          <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:hidden">
            {bentoGallery.slice(0, 4).map((item, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-md sm:rounded-2xl">
                <img src={item.src} alt={item.alt} className="h-28 w-full object-cover sm:h-36" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpotlightSection />
      <ServicesSection />
      <TestimonialsSection />
      <Footer />

      {/* ── Chat Widget ── */}
      <ChatWidget />

      {/* ── Inquiry Form Modal ── */}
      {inquiryOpen && <InquiryForm onClose={() => setInquiryOpen(false)} />}
    </>
  );
}

/* ─────────────────────────────────────────
   Section 2 — Spotlight Gallery
   ───────────────────────────────────────── */
function SpotlightSection() {
  // Duplicate arrays for seamless infinite scroll
  const row1Loop = [...galleryRow1, ...galleryRow1];
  const row2Loop = [...galleryRow2, ...galleryRow2];

  return (
    <section className="overflow-hidden bg-white py-10 sm:py-16 lg:py-24">
      {/* Heading */}
      <h2 className="mx-auto max-w-[52rem] px-5 text-center font-heading text-[clamp(1.6rem,5vw,4rem)] leading-[1.1] font-bold tracking-tight text-[#1a1225] sm:px-6">
        Step Into the <span className="text-[#e61f83]">Spotlight</span>,
        <br />
        We'll Handle the <span className="text-[#e61f83]">Stage</span>.
      </h2>

      {/* Row 1 — scrolls left with fade/blur edges */}
      <div className="group relative mt-12 flex overflow-hidden">
        {/* Left blur overlay */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Right blur overlay */}
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11">
          {row1Loop.map((img, i) => (
            <div
              key={`r1-${i}`}
              className="h-[12rem] w-[18rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4] transition-all duration-300 sm:h-[16rem] sm:w-[24rem] lg:h-[20rem] lg:w-[30rem]"
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
          className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11"
          aria-hidden
        >
          {row1Loop.map((img, i) => (
            <div
              key={`r1d-${i}`}
              className="h-[12rem] w-[18rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4] transition-all duration-300 sm:h-[16rem] sm:w-[24rem] lg:h-[20rem] lg:w-[30rem]"
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

      {/* Row 2 — scrolls right (reverse) with fade/blur edges */}
      <div className="group relative mt-6 flex overflow-hidden">
        {/* Left blur overlay */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Right blur overlay */}
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11">
          {row2Loop.map((img, i) => (
            <div
              key={`r2-${i}`}
              className="h-[12rem] w-[18rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4] transition-all duration-300 sm:h-[16rem] sm:w-[24rem] lg:h-[20rem] lg:w-[30rem]"
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
          className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11"
          aria-hidden
        >
          {row2Loop.map((img, i) => (
            <div
              key={`r2d-${i}`}
              className="h-[12rem] w-[18rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4] transition-all duration-300 sm:h-[16rem] sm:w-[24rem] lg:h-[20rem] lg:w-[30rem]"
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

      {/* Bottom quote */}
      <div className="mx-auto mt-8 max-w-[56rem] px-5 text-center sm:mt-14 sm:px-8 lg:px-16">
        <p className="font-sans text-[clamp(0.95rem,2vw,1.6rem)] font-normal leading-[1.8] text-[#3d2052]">
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
    <section className="bg-[#fdf2f6] px-4 py-12 sm:px-6 sm:py-20 lg:px-0 lg:py-32">
      <div className="space-y-8 sm:space-y-12">
        {/* Block 1 — Text left, Image right - Full width */}
        <div className="grid items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] sm:rounded-3xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
            <h3 className="font-heading text-[clamp(1.8rem,6vw,5rem)] leading-[1.08] font-bold text-[#1a1225]">
              A <span className="text-[#e61f83]">Love Story</span> Told in
              <br />
              Every Detail
            </h3>
            <p className="mt-4 font-sans text-[clamp(1rem,2vw,1.6rem)] leading-[1.7] text-[#3d2052] sm:mt-7">
              We don&rsquo;t just plan weddings; we protect your peace. From intimate vows to grand
              ballrooms, we ensure the only thing you focus on is the person at the end of the
              aisle.
            </p>
          </div>
          <div className="min-h-[16rem] sm:min-h-[24rem] lg:min-h-[42rem]">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${serviceImages.wedding})` }}
              role="img"
              aria-label="Elegant wedding venue setup"
            />
          </div>
        </div>

        {/* Block 2 — Image left, Text right - Full width */}
        <div className="grid items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] sm:rounded-3xl lg:grid-cols-2">
          <div className="relative min-h-[16rem] sm:min-h-[24rem] lg:min-h-[42rem]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${serviceImages.debut})` }}
              role="img"
              aria-label="Debut celebration photos"
            />
            <div
              className="absolute bottom-5 right-5 h-[42%] w-[42%] rounded-2xl bg-cover bg-center shadow-xl ring-2 ring-white/60"
              style={{ backgroundImage: `url(${serviceImages.debutAlt})` }}
              role="img"
              aria-label="Debut celebration detail"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
            <h3 className="font-heading text-[clamp(1.8rem,6vw,5rem)] leading-[1.08] font-bold text-[#1a1225]">
              <span className="text-[#e61f83]">Your 18th:</span> More Than a
              <br />
              Birthday, It&rsquo;s a <span className="text-[#e61f83]">Milestone</span>
            </h3>
            <p className="mt-4 font-sans text-[clamp(1rem,2vw,1.6rem)] leading-[1.7] text-[#3d2052] sm:mt-7">
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
    <section className="bg-gradient-to-b from-[#fce4ef] to-[#f8d0e3] py-12 sm:py-20 lg:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-[52rem] px-5 text-center sm:px-6">
        <h2 className="font-heading text-[clamp(2.4rem,5vw,4rem)] leading-[1.1] font-bold tracking-tight text-[#1a1225]">
          The Schatzies <span className="text-[#e61f83]">Experience</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-[38rem] font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052]">
          Celebrating 15 years of flawless events through the words of those who experienced the
          magic firsthand.
        </p>
      </div>

      {/* Testimonial cards — 2×2 grid */}
      <div className="mx-auto mt-8 grid max-w-[72rem] gap-5 px-5 sm:mt-14 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:px-12">
        {testimonials.map((t) => (
          <Card
            key={t.name}
            className="relative rounded-2xl border-0 bg-white/80 px-5 py-5 shadow-sm backdrop-blur-sm sm:px-8 sm:py-8"
          >
            {/* Quote mark */}
            <span className="absolute right-6 top-5 font-heading text-[3rem] leading-none text-[#c2649b]">
              &ldquo;&rdquo;
            </span>

            {/* Name + Recommends */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#501f5a]">
                <span className="text-sm font-bold text-white">{t.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-sans text-[1rem] font-bold text-[#1a1225]">{t.name}</p>
                <p className="text-[0.8rem] font-semibold text-[#e61f83]">Recommends!</p>
              </div>
            </div>

            {/* Review text */}
            <p className="mt-4 font-sans text-[0.95rem] leading-[1.7] text-[#3d2052]">{t.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Footer
   ───────────────────────────────────────── */
function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-8 sm:py-12">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/Pictures/business-logo.png"
          alt="Schatzies Events logo"
          className="h-16 w-auto sm:h-[100px]"
        />
      </div>

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100/80 text-gray-500 shadow-md transition-all hover:bg-pink-200 hover:text-gray-700 hover:shadow-lg active:scale-95 sm:bottom-8 sm:right-8 sm:h-15 sm:w-15"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </footer>
  );
}
