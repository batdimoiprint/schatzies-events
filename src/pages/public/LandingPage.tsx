import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Replace these paths with your own event photos when ready.
// Place image files in public/Pictures/ and reference them as '/Pictures/filename.jpg'.
const photos = {
  hero1: '/Pictures/hero-1.jpg',
  hero2: '/Pictures/hero-2.jpg',
  hero3: '/Pictures/hero-3.jpg',
  hero4: '/Pictures/hero-4.jpg',
  hero5: '/Pictures/hero-5.jpg',
  hero6: '/Pictures/hero-6.jpg',
  hero7: '/Pictures/hero-7.jpg',
  hero8: '/Pictures/hero-8.jpg',
  hero9: '/Pictures/hero-9.jpg',
  hero10: '/Pictures/hero-10.jpg',
};

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

/*
  Collage cards positioned & rotated to match the Figma design.
  Row 1 (top):      2 cards, faded
  Row 2 (upper-mid): 3 cards, center one is the hero (full opacity)
  Row 3 (lower-mid): 3 cards, mixed opacity
  Row 4 (bottom):    2 cards, faded
*/
const collageCards = [
  // ── Row 1 — top ──
  {
    src: photos.hero1,
    alt: 'Event table setup',
    className:
      'left-[5%] top-[1%] h-[11rem] w-[24rem] -rotate-[12deg] opacity-50',
  },
  {
    src: photos.hero2,
    alt: 'Pastel event decor',
    className:
      'right-[0%] top-[0%] h-[10rem] w-[19rem] -rotate-[12deg] opacity-30',
  },

  // ── Row 2 — upper middle (hero row) ──
  {
    src: photos.hero3,
    alt: 'Wedding table close-up',
    className:
      'left-[-3%] top-[18%] h-[13rem] w-[22rem] -rotate-[12deg] opacity-55',
  },
  {
    src: photos.hero4,
    alt: 'Grand ballroom celebration',
    className:
      'left-[26%] top-[17%] h-[16rem] w-[26rem] -rotate-[12deg] opacity-100 shadow-[0_20px_32px_rgba(0,0,0,0.25)] z-10',
  },
  {
    src: photos.hero5,
    alt: 'Floral reception setup',
    className:
      'right-[-2%] top-[15%] h-[12rem] w-[18rem] -rotate-[10deg] opacity-40',
  },

  // ── Row 3 — lower middle ──
  {
    src: photos.hero6,
    alt: 'Elegant hall setup',
    className:
      'left-[0%] bottom-[18%] h-[13rem] w-[24rem] -rotate-[11deg] opacity-60',
  },
  {
    src: photos.hero7,
    alt: 'Debut entrance moment',
    className:
      'left-[30%] bottom-[16%] h-[13rem] w-[23rem] -rotate-[11deg] opacity-65',
  },
  {
    src: photos.hero8,
    alt: 'Venue grand view',
    className:
      'right-[-1%] bottom-[18%] h-[12rem] w-[20rem] -rotate-[11deg] opacity-35',
  },

  // ── Row 4 — bottom ──
  {
    src: photos.hero9,
    alt: 'Guest dining setup',
    className:
      'left-[10%] bottom-[1%] h-[11rem] w-[22rem] -rotate-[11deg] opacity-35',
  },
  {
    src: photos.hero10,
    alt: 'Venue side detail',
    className:
      'right-[3%] bottom-[3%] h-[10rem] w-[17rem] -rotate-[11deg] opacity-30',
  },
];

export function LandingPage() {
  return (
    <>
    <section className="relative min-h-[calc(100vh-100px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_70%,rgba(255,255,255,0.92),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(230,31,131,0.08),transparent_38%),radial-gradient(circle_at_70%_72%,rgba(80,31,90,0.09),transparent_40%)]" />

      <div className="grid min-h-[calc(100vh-100px)] w-full items-center lg:grid-cols-[42%_58%]">
        {/* ── Left: text content ── */}
        <article className="relative z-10 px-12 py-10 lg:px-20 lg:py-0">
          <h2 className="font-heading font-semibold leading-[0.9] tracking-tight">
            <span className="block text-[clamp(2.8rem,4vw,4rem)] font-semibold text-[#3d2052]">
              Welcome to
            </span>
            <span className="mt-1 block text-[clamp(5rem,9vw,8.5rem)] bg-gradient-to-r from-[#e61f83] via-[#c2649b] to-[#501f5a] bg-clip-text text-transparent">
              Schatzies
            </span>
            <span className="block text-[clamp(5rem,9vw,8.5rem)] bg-gradient-to-r from-[#e61f83] via-[#c2649b] to-[#501f5a] bg-clip-text text-transparent">
              Events!
            </span>
          </h2>

          <p className="mt-5 text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold leading-tight text-[#3d2052]">
            Your{' '}
            <span className="font-bold text-[#e61f83] uppercase">most trusted</span>{' '}
            team!
          </p>

          <p className="mt-2 max-w-[30rem] text-[clamp(0.95rem,1.3vw,1.1rem)] leading-[1.55] text-[#6b4d80]">
            Premium wedding and debut planning for those who want to be a guest
            at their own celebration. We handle the stress; you handle the
            memories.
          </p>

          <Button className="mt-7 h-[60px] rounded-3xl bg-gradient-to-b from-[#e61f83] via-[#9b2d8a] to-[#501f5a] px-12 text-[1.1rem] font-bold uppercase tracking-wide shadow-[0_10px_24px_rgba(39,21,57,0.4)] hover:brightness-110">
            Inquire
          </Button>
        </article>

        {/* ── Right: photo collage (desktop) ── */}
        <div className="relative hidden min-h-[calc(100vh-100px)] lg:block">
          {collageCards.map((card, index) => (
            <Card
              key={`${card.alt}-${index}`}
              className={`absolute overflow-hidden rounded-3xl border-0 bg-white/20 p-0 ring-0 ${card.className}`}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${card.src})` }}
                role="img"
                aria-label={card.alt}
              />
            </Card>
          ))}
        </div>

        {/* ── Mobile: simplified grid ── */}
        <div className="grid grid-cols-2 gap-4 py-3 lg:hidden">
          {collageCards.slice(0, 6).map((card) => (
            <Card
              key={card.alt}
              className="overflow-hidden rounded-2xl border-0 bg-white/60 p-0 ring-0"
            >
              <div
                className="h-36 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${card.src})` }}
                role="img"
                aria-label={card.alt}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>

    <SpotlightSection />
    <ServicesSection />
    <TestimonialsSection />
    <Footer />
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
    <section className="overflow-hidden bg-white py-16 lg:py-24">
      {/* Heading */}
      <h2 className="mx-auto max-w-[52rem] px-6 text-center font-heading text-[clamp(2.4rem,5vw,4rem)] leading-[1.1] font-bold tracking-tight text-[#1a1225]">
        Step Into the{' '}
        <span className="text-[#e61f83]">Spotlight</span>,
        <br />
        We'll Handle the{' '}
        <span className="text-[#e61f83]">Stage</span>.
      </h2>

      {/* Row 1 — scrolls left */}
      <div className="group relative mt-12 flex overflow-hidden">
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11">
          {row1Loop.map((img, i) => (
            <div
              key={`r1-${i}`}
              className="h-[20rem] w-[30rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4]"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
        <div className="animate-marquee group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11" aria-hidden>
          {row1Loop.map((img, i) => (
            <div
              key={`r1d-${i}`}
              className="h-[20rem] w-[30rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4]"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div className="group relative mt-6 flex overflow-hidden">
        <div className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11">
          {row2Loop.map((img, i) => (
            <div
              key={`r2-${i}`}
              className="h-[20rem] w-[30rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4]"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
        <div className="animate-marquee-reverse group-hover:[animation-play-state:paused] flex shrink-0 items-stretch gap-11 pr-11" aria-hidden>
          {row2Loop.map((img, i) => (
            <div
              key={`r2d-${i}`}
              className="h-[20rem] w-[30rem] shrink-0 overflow-hidden rounded-2xl bg-[#f0eaf4]"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom quote */}
      <div className="mx-auto mt-14 max-w-[56rem] px-8 text-center lg:px-16">
        <p className="font-sans text-[clamp(1rem,1.6vw,1.2rem)] font-normal leading-[1.8] text-[#3d2052]">
          Your milestone is a masterpiece in the making. While you focus on making
          memories and greeting your guests, our team ensures every light, sound,
          and moment is executed to perfection.
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
    <section className="bg-[#fdf2f6] py-20 lg:py-32">
      <div className="mx-auto max-w-[90rem] space-y-12 px-6 lg:px-16">
        {/* Block 1 — Text left, Image right */}
        <div className="grid items-stretch overflow-hidden rounded-3xl bg-[#fbedf3] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-10 py-14 lg:px-16 lg:py-20">
            <h3 className="font-heading text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-[#1a1225]">
              A <span className="text-[#e61f83]">Love Story</span> Told in
              <br />
              Every Detail
            </h3>
            <p className="mt-7 font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052]">
              We don&rsquo;t just plan weddings; we protect your peace. From intimate
              vows to grand ballrooms, we ensure the only thing you focus on is the
              person at the end of the aisle.
            </p>
          </div>
          <div className="min-h-[30rem] lg:min-h-[36rem]">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${serviceImages.wedding})` }}
              role="img"
              aria-label="Elegant wedding venue setup"
            />
          </div>
        </div>

        {/* Block 2 — Image left, Text right */}
        <div className="grid items-stretch overflow-hidden rounded-3xl bg-[#fbedf3] lg:grid-cols-2">
          <div className="relative min-h-[30rem] lg:min-h-[36rem]">
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
          <div className="flex flex-col justify-center px-10 py-14 lg:px-16 lg:py-20">
            <h3 className="font-heading text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.08] font-bold text-[#1a1225]">
              <span className="text-[#e61f83]">Your 18th:</span> More Than a
              <br />
              Birthday, It&rsquo;s a <span className="text-[#e61f83]">Milestone</span>
            </h3>
            <p className="mt-7 font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052]">
              Eighteen years in the making, designed in a single night. We transform
              your milestone into a cinematic celebration that captures exactly who
              you are and who you&rsquo;re becoming.
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
    <section className="bg-gradient-to-b from-[#fce4ef] to-[#f8d0e3] py-20 lg:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-[52rem] px-6 text-center">
        <h2 className="font-heading text-[clamp(2.4rem,5vw,4rem)] leading-[1.1] font-bold tracking-tight text-[#1a1225]">
          The Schatzies <span className="text-[#e61f83]">Experience</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-[38rem] font-sans text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-[#3d2052]">
          Celebrating 15 years of flawless events through the words of those who
          experienced the magic firsthand.
        </p>
      </div>

      {/* Testimonial cards — 2×2 grid */}
      <div className="mx-auto mt-14 grid max-w-[72rem] gap-8 px-6 sm:grid-cols-2 lg:px-12">
        {testimonials.map((t) => (
          <Card
            key={t.name}
            className="relative rounded-2xl border-0 bg-white/80 px-8 py-8 shadow-sm backdrop-blur-sm"
          >
            {/* Quote mark */}
            <span className="absolute right-6 top-5 font-heading text-[3rem] leading-none text-[#c2649b]">
              &ldquo;&rdquo;
            </span>

            {/* Name + Recommends */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#501f5a]">
                <span className="text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-sans text-[1rem] font-bold text-[#1a1225]">
                  {t.name}
                </p>
                <p className="text-[0.8rem] font-semibold text-[#e61f83]">
                  Recommends!
                </p>
              </div>
            </div>

            {/* Review text */}
            <p className="mt-4 font-sans text-[0.95rem] leading-[1.7] text-[#3d2052]">
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
  return (
    <footer className="bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] py-12">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/Pictures/business-logo.png"
          alt="Schatzies Events logo"
          className="h-[100px] w-auto"
        />
      </div>
    </footer>
  );
}
