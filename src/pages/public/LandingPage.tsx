import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacebookLogo, EnvelopeSimple, Phone, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Gallery images
const galleryRow1 = [
  { src: '/Pictures/gallery-1.jpg', alt: 'Event gallery 1' },
  { src: '/Pictures/gallery-2.jpg', alt: 'Event gallery 2' },
  { src: '/Pictures/gallery-3.jpg', alt: 'Event gallery 3' },
];

const galleryRow2 = [
  { src: '/Pictures/gallery-4.jpg', alt: 'Event gallery 4' },
  { src: '/Pictures/gallery-5.jpg', alt: 'Event gallery 5' },
  { src: '/Pictures/gallery-6.jpg', alt: 'Event gallery 6' },
  { src: '/Pictures/gallery-7.jpg', alt: 'Event gallery 7' },
];

const heroImages = [
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
  '/Pictures/hero-11.jpg',
];

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
  {
    name: 'Hedda H.',
    text: 'They perfectly executed our all white minimalist draping theme. It was exactly how we envisioned it; clean, elegant, and timeless. If they are the team to trust.',
  },
  {
    name: 'Charlene F.',
    text: 'Hiring SCHATZIES EVENTS PH was the best decision we made for our celebration! They handled all vendor coordination in the weeks leading up to the wedding and made everything smooth.',
  },
];

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <SpotlightSection />
      <ServicesSection />
      <TestimonialsSection />
    </>
  );
}

/* ── Hero — editorial split ── */
function HeroSection() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  const socials = [
    {
      href: 'https://www.facebook.com/debutandweddingpackage',
      label: 'Facebook',
      Icon: FacebookLogo,
      external: true,
    },
    { href: 'mailto:schatziesevents@gmail.com', label: 'Email', Icon: EnvelopeSimple, external: false },
    { href: 'tel:+639333807868', label: 'Phone', Icon: Phone, external: false },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory">
      <div className="page-gutter mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 items-center gap-10 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24 lg:pb-0">
        {/* Left — type */}
        <div className="relative z-10">
          <div className="animate-fade-in-up flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="eyebrow text-brand">Wedding &amp; Debut Atelier — Philippines</span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-200 mt-7 font-heading leading-[0.92] text-ink">
            <span className="block text-2xl font-normal italic text-ink/60 sm:text-3xl">
              Welcome to
            </span>
            <span className="mt-2 block text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.02em]">
              Schatzies
            </span>
            <span className="block text-[clamp(3rem,9vw,7rem)] font-light italic tracking-[-0.02em] text-brand">
              Events.
            </span>
          </h1>

          <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-md font-sans text-base leading-relaxed text-ink/70 sm:text-lg">
            Premium wedding and debut planning for those who want to be a guest at their own
            celebration. We handle the stress; you handle the memories. Your{' '}
            <span className="font-semibold text-brand">most trusted</span> team.
          </p>

          <div className="animate-fade-in-up animation-delay-600 mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={() => navigate('/event-packages')}
              className="group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 font-ui text-xs font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-all duration-300 hover:bg-brand-deep"
            >
              View Packages
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() => navigate('/about-us')}
              className="group inline-flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.18em] text-ink uppercase"
            >
              Our Story
              <span className="h-px w-6 bg-ink transition-all duration-300 group-hover:w-10" />
            </button>
          </div>

          <div className="animate-fade-in-up animation-delay-800 mt-12 flex items-center gap-5">
            <span className="eyebrow text-ink/40">Connect</span>
            <div className="flex items-center gap-3">
              {socials.map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-brand hover:bg-brand hover:text-primary-foreground"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — editorial image frame */}
        <div className="relative h-[55vh] w-full lg:h-[88vh]">
          <span className="absolute -top-3 right-2 z-20 hidden font-heading text-sm italic tracking-[0.25em] text-gold lg:block [writing-mode:vertical-rl]">
            Est. 2011
          </span>
          <div className="relative h-full w-full overflow-hidden rounded-t-[180px] rounded-b-md border border-gold/40 shadow-[0_30px_80px_-30px_rgba(34,26,20,0.45)]">
            {heroImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out"
                style={{ opacity: i === index ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </div>

          {/* progress ticks */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === index ? 'w-7 bg-gold' : 'w-2 bg-ivory/60 hover:bg-ivory'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Spotlight — portfolio marquee ── */
function SpotlightSection() {
  const navigate = useNavigate();
  const row1 = Array.from({ length: 8 }, () => galleryRow1).flat();
  const row2 = Array.from({ length: 8 }, () => galleryRow2).flat();

  return (
    <section className="overflow-hidden bg-ivory py-24 lg:py-32">
      <div className="page-gutter mx-auto mb-16 max-w-5xl text-center">
        <ScrollReveal variant="up">
          <p className="eyebrow text-brand">01 — The Portfolio</p>
          <h2 className="mt-6 font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ink">
            Step into the <span className="italic text-brand">spotlight</span>,
            <br />
            we&rsquo;ll handle the <span className="italic text-brand">stage</span>.
          </h2>
          <div className="rule-gold mx-auto mt-8 w-40" />
          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
            Your milestone is a masterpiece in the making. While you focus on making memories and
            greeting your guests, our team ensures every light, sound, and moment is executed to
            perfection.
          </p>
        </ScrollReveal>
      </div>

      <div className="relative mb-16 space-y-6">
        {[row1, row2].map((row, rowIdx) => (
          <div key={rowIdx} className="mask-fade-x group flex overflow-hidden">
            <div
              className={`flex w-max gap-6 ${rowIdx === 0 ? 'animate-marquee' : 'animate-marquee-reverse'} group-hover:[animation-play-state:paused]`}
            >
              {row.map((image, i) => (
                <figure
                  key={`${rowIdx}-${i}`}
                  className="relative h-72 w-[420px] flex-shrink-0 overflow-hidden rounded-sm border border-gold/20"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="page-gutter text-center">
        <button
          onClick={() => navigate('/gallery')}
          className="group inline-flex items-center gap-3 border border-ink/20 px-9 py-4 font-ui text-xs font-semibold tracking-[0.18em] text-ink uppercase transition-all duration-300 hover:border-brand hover:text-brand"
        >
          View Full Gallery
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </section>
  );
}

/* ── Services — espresso editorial features ── */
function ServicesSection() {
  const features = [
    {
      kicker: '02 — Weddings',
      title: 'A Love Story Told in Every Detail',
      body: "We don't just plan weddings; we protect your peace. From intimate vows to grand ballrooms, we ensure the only thing you focus on is the person at the end of the aisle.",
      img: '/Pictures/service-wedding.jpg',
      alt: 'A Love Story Told in Every Detail',
    },
    {
      kicker: '03 — Debuts',
      title: "Your 18th: More Than a Birthday, a Milestone",
      body: "Eighteen years in the making, designed in a single night. We transform your milestone into a cinematic celebration that captures exactly who you are and who you're becoming.",
      img: '/Pictures/service-debut.jpg',
      alt: "Your 18th: More Than a Birthday, It's a Milestone",
    },
  ];

  return (
    <section id="services" className="grain relative overflow-hidden bg-ink py-24 text-ivory lg:py-36">
      <div className="page-gutter relative z-10 mx-auto max-w-[1400px] space-y-28 lg:space-y-40">
        {features.map((f, i) => (
          <div
            key={f.kicker}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20"
          >
            <ScrollReveal
              variant={i % 2 === 0 ? 'right' : 'left'}
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-gold/30 ${
                i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <img
                src={f.img}
                alt={f.alt}
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </ScrollReveal>

            <ScrollReveal
              variant={i % 2 === 0 ? 'left' : 'right'}
              className={`space-y-6 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <p className="eyebrow text-gold">{f.kicker}</p>
              <h3 className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] text-ivory">
                {f.title}
              </h3>
              <div className="rule-gold w-24" />
              <p className="max-w-md font-sans text-base leading-relaxed text-ivory/70 lg:text-lg">
                {f.body}
              </p>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Testimonials — editorial pull-quotes ── */
function TestimonialsSection() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="page-gutter mx-auto max-w-[1400px]">
        <ScrollReveal variant="up" className="mb-16 max-w-3xl">
          <p className="eyebrow text-brand">04 — The Experience</p>
          <h2 className="mt-6 font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ink">
            The Schatzies <span className="italic text-brand">experience</span>.
          </h2>
          <p className="mt-7 font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
            Celebrating 15 years of flawless events through the words of those who experienced the
            magic firsthand.
          </p>
        </ScrollReveal>

        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <ScrollReveal
              key={idx}
              variant="up"
              delay={(idx % 3) * 100}
              className="flex flex-col bg-card p-8 lg:p-10"
            >
              <span className="font-heading text-6xl leading-none text-gold">&ldquo;</span>
              <p className="mt-4 flex-1 font-sans text-[0.95rem] leading-relaxed text-ink/75">
                {t.text}
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 font-ui text-sm font-bold text-brand">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">{t.name}</p>
                  <p className="font-ui text-[0.7rem] tracking-[0.15em] text-brand uppercase">
                    Recommends
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
