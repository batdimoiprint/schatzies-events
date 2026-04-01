import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { InquiryForm } from '@/components/InquiryForm';
import { ChatWidget } from '@/components/ChatWidget';

const bentoGallery = [
  { src: '/Pictures/hero-1.jpg', alt: 'Event table setup' },
  { src: '/Pictures/hero-2.jpg', alt: 'Grand ballroom celebration' },
  { src: '/Pictures/hero-3.jpg', alt: 'Floral arch decor' },
  { src: '/Pictures/hero-4.jpg', alt: 'Wedding reception detail' },
  { src: '/Pictures/hero-5.jpg', alt: 'Debut stage setup' },
  { src: '/Pictures/hero-6.jpg', alt: 'Venue chandelier' },
  { src: '/Pictures/hero-7.jpg', alt: 'Event centerpiece' },
  { src: '/Pictures/hero-8.jpg', alt: 'Dining setup' },
  { src: '/Pictures/hero-9.jpg', alt: 'Reception detail' },
  { src: '/Pictures/hero-10.jpg', alt: 'Floral arrangement' },
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

  const handleInquire = () => {
    setInquiryOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_70%,rgba(255,255,255,0.92),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(230,31,131,0.08),transparent_38%),radial-gradient(circle_at_70%_72%,rgba(80,31,90,0.09),transparent_40%)]" />

        <div className="grid min-h-screen w-full items-center lg:grid-cols-[38%_62%]">
          {/* ── Left: text content ── */}
          <article className="relative z-10 px-6 py-8 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <h2 className="font-heading font-semibold leading-[0.9] tracking-tight">
              <span className="block text-[clamp(1.8rem,4vw,3.2rem)] font-semibold text-[#3d2052]">
                Welcome to
              </span>
              <span className="mt-1 block text-[clamp(2.8rem,7vw,6rem)] bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                Schatzies
              </span>
              <span className="block text-[clamp(2.8rem,7vw,6rem)] bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                Events!
              </span>
            </h2>

            <p className="mt-3 text-[clamp(1rem,1.6vw,1.3rem)] font-semibold leading-tight text-[#3d2052]">
              Your <span className="font-bold text-[#FF0066] uppercase">most trusted</span> team!
            </p>

            <p className="mt-3 max-w-[28rem] text-[clamp(0.9rem,1.3vw,1.05rem)] font-sans leading-[1.55] text-[#6b4d80]">
              Premium wedding and debut planning for those who want to be a guest at their own
              celebration. We handle the stress; you handle the memories.
            </p>

            <Button
              onClick={handleInquire}
              className="mt-6 h-11 rounded-full bg-gradient-to-b from-[#FF0066] to-[#700F81] px-8 text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.4)] hover:brightness-110 sm:h-12 sm:px-9 sm:text-base lg:h-13 lg:px-10"
            >
              Inquire
            </Button>
          </article>

          {/* ── Right: tilted uniform grid gallery (desktop) ── */}
          <div
            className="relative hidden h-screen lg:block"
            style={{
              maskImage:
                'radial-gradient(ellipse 85% 80% at 50% 45%, black 20%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 75%, transparent 95%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 85% 80% at 50% 45%, black 20%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 75%, transparent 95%)',
              overflow: 'visible',
            }}
          >
            <div
              className="absolute inset-0 -rotate-[12deg] scale-110"
              style={{ overflow: 'visible' }}
            >
              <div className="flex h-full w-full flex-col gap-3 p-5">
                {/* Row 1: 2 images */}
                <div className="grid grid-cols-2 gap-3 h-[22%]">
                  {bentoGallery.slice(0, 2).map((item, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Row 2: 3 images - PICTURE #4 IS THE CENTER */}
                <div className="grid grid-cols-3 gap-3 h-[26%]">
                  {bentoGallery.slice(2, 5).map((item, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Row 3: 3 images */}
                <div className="grid grid-cols-3 gap-3 h-[26%]">
                  {bentoGallery.slice(5, 8).map((item, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Row 4: 2 images */}
                <div className="grid grid-cols-2 gap-3 h-[22%]">
                  {bentoGallery.slice(8, 10).map((item, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile/Tablet: simplified bento grid ── */}
          <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:hidden">
            {bentoGallery.slice(0, 6).map((item, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-md sm:rounded-2xl">
                <img src={item.src} alt={item.alt} className="h-32 w-full object-cover sm:h-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpotlightSection />
      <ServicesSection />
      <TestimonialsSection />
      <Footer />

      <ChatWidget />
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
    <section className="overflow-hidden bg-white py-16 lg:py-24">
      <h2 className="mx-auto max-w-[48rem] px-6 text-center font-heading text-[clamp(1.8rem,4vw,3rem)] leading-[1.2] font-bold tracking-tight text-[#1a1225]">
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
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 lg:h-[18rem] lg:w-[28rem]"
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
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 lg:h-[18rem] lg:w-[28rem]"
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
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 lg:h-[18rem] lg:w-[28rem]"
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
              className="h-[16rem] w-[24rem] shrink-0 overflow-hidden rounded-xl bg-[#f0eaf4] transition-all duration-300 lg:h-[18rem] lg:w-[28rem]"
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
        <p className="font-sans text-[clamp(1rem,1.6vw,1.2rem)] font-normal leading-[1.7] text-[#3d2052]">
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
    <section className="bg-[#fdf2f6] py-16 lg:py-24">
      <div className="mx-auto max-w-[90rem] space-y-10 lg:space-y-12">
        {/* Block 1 */}
        <div className="grid items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 lg:px-12 lg:py-16">
            <h3 className="font-heading text-[clamp(1.8rem,5vw,3.5rem)] leading-[1.2] font-bold text-[#1a1225]">
              A <span className="text-[#e61f83]">Love Story</span> Told in
              <br />
              Every Detail
            </h3>
            <p className="mt-4 font-sans text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7] text-[#3d2052]">
              We don&rsquo;t just plan weddings; we protect your peace. From intimate vows to grand
              ballrooms, we ensure the only thing you focus on is the person at the end of the
              aisle.
            </p>
          </div>
          <div className="min-h-[20rem] lg:min-h-[32rem]">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${serviceImages.wedding})` }}
              role="img"
              aria-label="Elegant wedding venue setup"
            />
          </div>
        </div>

        {/* Block 2 */}
        <div className="grid items-stretch overflow-hidden rounded-2xl bg-[#fbedf3] lg:grid-cols-2">
          <div className="relative min-h-[20rem] lg:min-h-[32rem] order-first lg:order-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${serviceImages.debut})` }}
              role="img"
              aria-label="Debut celebration photos"
            />
            <div
              className="absolute bottom-4 right-4 h-[38%] w-[38%] rounded-xl bg-cover bg-center shadow-xl ring-2 ring-white/60"
              style={{ backgroundImage: `url(${serviceImages.debutAlt})` }}
              role="img"
              aria-label="Debut celebration detail"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 lg:px-12 lg:py-16">
            <h3 className="font-heading text-[clamp(1.8rem,5vw,3.5rem)] leading-[1.2] font-bold text-[#1a1225]">
              <span className="text-[#e61f83]">Your 18th:</span> More Than a
              <br />
              Birthday, It&rsquo;s a <span className="text-[#e61f83]">Milestone</span>
            </h3>
            <p className="mt-4 font-sans text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7] text-[#3d2052]">
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
    <section className="bg-gradient-to-b from-[#fce4ef] to-[#f8d0e3] py-16 lg:py-24">
      <div className="mx-auto max-w-[48rem] px-6 text-center">
        <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] font-bold tracking-tight text-[#1a1225]">
          The Schatzies <span className="text-[#e61f83]">Experience</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-[36rem] font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052]">
          Celebrating 15 years of flawless events through the words of those who experienced the
          magic firsthand.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[80rem] gap-6 px-6 sm:grid-cols-2 lg:gap-8 lg:px-8">
        {testimonials.map((t) => (
          <Card
            key={t.name}
            className="relative rounded-xl border-0 bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg lg:px-8 lg:py-8"
          >
            <span className="absolute right-5 top-4 font-heading text-[2.5rem] leading-none text-[#c2649b] lg:right-6 lg:top-5 lg:text-[3rem]">
              &ldquo;&rdquo;
            </span>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#501f5a] lg:h-10 lg:w-10">
                <span className="text-sm font-bold text-white lg:text-base">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-sans text-[0.95rem] font-bold text-[#1a1225] lg:text-[1rem]">
                  {t.name}
                </p>
                <p className="text-[0.75rem] font-semibold text-[#e61f83] lg:text-[0.8rem]">
                  Recommends!
                </p>
              </div>
            </div>

            <p className="mt-3 font-sans text-[0.9rem] leading-[1.6] text-[#3d2052] lg:mt-4 lg:text-[0.95rem]">
              {t.text}
            </p>
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
    <footer className="relative bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-10 lg:py-12">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/Pictures/business-logo.png"
          alt="Schatzies Events logo"
          className="h-20 w-auto lg:h-[100px]"
        />
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100/80 text-gray-500 shadow-md transition-all hover:bg-pink-200 hover:text-gray-700 hover:shadow-lg active:scale-95 lg:bottom-8 lg:right-8 lg:h-12 lg:w-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 lg:h-6 lg:w-6"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </footer>
  );
}
