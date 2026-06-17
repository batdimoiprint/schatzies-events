import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FacebookLogo,
  InstagramLogo,
  EnvelopeSimple,
  Phone,
  Link,
  ArrowRight,
} from '@phosphor-icons/react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServicesSection from '@/components/ServicesSection';
import { useBusinessContact } from '@/hooks/useBusinessContact';
import { useContent, renderContentText } from '@/hooks/useContent';

// Gallery images — equal count per row for balanced marquee
const galleryRow1 = [
  { src: '/Pictures/gallery-1.jpg', alt: 'Event gallery 1' },
  { src: '/Pictures/gallery-2.jpg', alt: 'Event gallery 2' },
  { src: '/Pictures/gallery-3.jpg', alt: 'Event gallery 3' },
  { src: '/Pictures/gallery-4.jpg', alt: 'Event gallery 4' },
];

const galleryRow2 = [
  { src: '/Pictures/gallery-5.jpg', alt: 'Event gallery 5' },
  { src: '/Pictures/gallery-6.jpg', alt: 'Event gallery 6' },
  { src: '/Pictures/gallery-7.jpg', alt: 'Event gallery 7' },
  { src: '/Pictures/hero-1.jpg', alt: 'Event gallery 8' },
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
  const { sections } = useContent('homepage');
  return (
    <>
      <HeroSection heroContent={sections.hero} />
      <SpotlightSection spotlightContent={sections.spotlight} />
      <ServicesSection weddingsContent={sections.weddings} debutsContent={sections.debuts} />
      <TestimonialsSection testimonialsContent={sections.testimonials} />
    </>
  );
}

function HeroHeartParticles() {
  const hearts = [
    { left: '10%', top: '25%', size: 16, delay: '0s', dur: '7s' },
    { left: '85%', top: '20%', size: 22, delay: '1.5s', dur: '8s' },
    { left: '25%', top: '65%', size: 14, delay: '3s', dur: '9s' },
    { left: '75%', top: '75%', size: 20, delay: '0.8s', dur: '7.5s' },
    { left: '45%', top: '45%', size: 18, delay: '2.2s', dur: '8.5s' },
    { left: '60%', top: '85%', size: 15, delay: '4s', dur: '10s' },
    { left: '20%', top: '50%', size: 19, delay: '0.5s', dur: '6.8s' },
    { left: '90%', top: '55%', size: 16, delay: '2.5s', dur: '9.2s' },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes float-heart {
          0% { transform: translateY(15px) scale(1) rotate(0deg); opacity: 0; }
          15% { opacity: 0.95; }
          85% { opacity: 0.95; }
          100% { transform: translateY(-35px) scale(0.9) rotate(15deg); opacity: 0; }
        }
      `}</style>
      {hearts.map((h, i) => (
        <svg
          key={i}
          className="absolute text-red-600/60"
          style={{
            left: h.left,
            top: h.top,
            width: h.size,
            height: h.size,
            animation: `float-heart ${h.dur} ease-in-out infinite`,
            animationDelay: h.delay,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Hero — editorial split ── */
function HeroSection({ heroContent }: { heroContent?: { title: string; body: string } }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const { data: contact } = useBusinessContact();

  const title = heroContent?.title ?? 'Welcome to\nSchatzies\n*Events.*';
  const body = heroContent?.body ?? 'Premium wedding and debut planning for those who want to be a guest at their own celebration. We handle the stress; you handle the memories. Your most trusted team.';

  const titleLines = title.split('\n');
  const line1 = titleLines[0] || 'Welcome to';
  const line2 = titleLines[1] || 'Schatzies';
  const line3 = titleLines[2] || '*Events.*';

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  type Social = { href: string; label: string; Icon: React.ElementType; external: boolean };
  const socials: Social[] = [];

  if (contact) {
    for (const lnk of contact.links ?? []) {
      const p = (lnk.platform ?? lnk.label).toLowerCase();
      const Icon = p.includes('facebook')
        ? FacebookLogo
        : p.includes('instagram')
          ? InstagramLogo
          : Link;
      socials.push({ href: lnk.url, label: lnk.label, Icon, external: true });
    }
    for (const email of contact.emails ?? []) {
      socials.push({ href: `mailto:${email.email}`, label: email.label, Icon: EnvelopeSimple, external: false });
    }
    for (const phone of contact.phones ?? []) {
      socials.push({ href: `tel:${phone.number.replace(/\s/g, '')}`, label: phone.label, Icon: Phone, external: false });
    }
  }

  return (
    <section className="relative bg-ivory w-full min-h-screen">
      <HeroHeartParticles />
      <div className="page-gutter mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 items-center gap-10 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24 lg:pb-0">
        {/* Left — type */}
        <div className="relative z-10">
          <div className="animate-fade-in-up flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="eyebrow text-brand">Wedding &amp; Debut Atelier — Philippines</span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-200 mt-7 font-heading leading-[0.92] text-ink">
            <span className="block text-2xl font-normal italic text-ink/60 sm:text-3xl">
              {renderContentText(line1, 'italic text-brand')}
            </span>
            <span className="mt-2 block text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.02em]">
              {renderContentText(line2, 'italic text-brand')}
            </span>
            <span className="block text-[clamp(3rem,9vw,7rem)] font-light italic tracking-[-0.02em] text-brand">
              {renderContentText(line3, 'italic text-brand')}
            </span>
          </h1>

          <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-md font-sans text-base leading-relaxed text-ink/70 sm:text-lg">
            {renderContentText(body, 'font-semibold text-brand')}
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
        <div className="relative h-[45vh] sm:h-[55vh] lg:h-[88vh] w-full">
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

/* ── Spotlight — portfolio marquee as background, text centered ── */
function SpotlightParticles() {
  const particles = [
    { left: '10%', top: '25%', size: 8, delay: '0s', dur: '8s' },
    { left: '80%', top: '15%', size: 6, delay: '2s', dur: '10s' },
    { left: '30%', top: '75%', size: 10, delay: '1s', dur: '9s' },
    { left: '85%', top: '80%', size: 7, delay: '3s', dur: '7s' },
    { left: '15%', top: '85%', size: 9, delay: '4s', dur: '11s' },
    { left: '50%', top: '30%', size: 8, delay: '1.5s', dur: '8.5s' },
    { left: '70%', top: '60%', size: 7, delay: '2.5s', dur: '9.5s' },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes float-spotlight {
          0% { transform: translateY(20px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-30px) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p, i) => (
        <svg
          key={i}
          className="absolute text-brand/20"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `float-spotlight ${p.dur} linear infinite`,
            animationDelay: p.delay,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      ))}
    </div>
  );
}

/* ── Spotlight — portfolio marquee as background, text centered ── */
function SpotlightSection({ spotlightContent }: { spotlightContent?: { title: string; body: string } }) {
  // 4x duplication ensures seamless infinite scroll on ultra-wide screens
  const repeat = (arr: typeof galleryRow1) => [...arr, ...arr, ...arr, ...arr];
  const row1 = repeat(galleryRow1);
  const row2 = repeat(galleryRow2);

  const title = spotlightContent?.title ?? "Step into the *spotlight*, we'll handle the *stage*.";
  const body = spotlightContent?.body ?? "Your milestone is a masterpiece in the making. While you focus on making memories and greeting your guests, our team ensures every light, sound, and moment is executed to perfection.";

  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex flex-col justify-between items-center py-8">
      {/* ── Animated Spotlight Particles ── */}
      <SpotlightParticles />

      {/* ── Centered text content (top 30%) ── */}
      <div className="relative z-10 w-full max-w-3xl text-center px-6 flex flex-col justify-center py-8 lg:py-0 lg:h-[30vh]">
        <ScrollReveal variant="up" className="mx-auto text-center">
          <h2 className="font-heading text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] text-ink">
            {renderContentText(title, 'italic text-brand')}
          </h2>
          <div className="rule-gold mx-auto mt-4 w-32" />
          <p className="mx-auto mt-4 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-ink/75">
            {renderContentText(body, 'italic text-brand')}
          </p>
        </ScrollReveal>
      </div>

      {/* ── Marquee rows below (70%) ── */}
      <div className="relative z-0 w-full flex flex-col justify-center gap-4 overflow-hidden h-[40vh] sm:h-[45vh] lg:h-[65vh]" aria-hidden="true">
        {/* Row 1 — scrolls left */}
        <div className="mask-fade-x flex overflow-hidden">
          <div className="flex w-max gap-4 animate-marquee">
            {row1.map((image, i) => (
              <figure
                key={`r1-${i}`}
                className="relative h-[31vh] w-[46vh] flex-shrink-0 overflow-hidden rounded-md"
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right (reverse) */}
        <div className="mask-fade-x flex overflow-hidden">
          <div className="flex w-max gap-4 animate-marquee-reverse">
            {row2.map((image, i) => (
              <figure
                key={`r2-${i}`}
                className="relative h-[31vh] w-[46vh] flex-shrink-0 overflow-hidden rounded-md"
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services section — now imported from @/components/ServicesSection ── */

/* ── Testimonials — premium editorial carousel ── */
function TestimonialsSection({ testimonialsContent }: { testimonialsContent?: { title: string; body: string } }) {
  const title = testimonialsContent?.title ?? "The Schatzies *experience*.";
  const body = testimonialsContent?.body ?? "Celebrating 15 years of flawless events through the words of those who experienced the magic firsthand.";

  return (
    <section className="relative bg-ivory w-full py-16 lg:py-24 overflow-hidden">
      {/* ── Subtle decorative gradient blobs ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #ff0066, transparent 70%)' }}
        />
        <div
          className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #e6005c, transparent 70%)' }}
        />
      </div>

      <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] flex flex-col justify-center">
        {/* ── Header ── */}
        <ScrollReveal variant="up" className="mb-8 text-center lg:text-left">
          <h2 className="font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ink">
            {renderContentText(title, 'italic text-brand')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-ink/60 lg:mx-0 lg:text-lg">
            {renderContentText(body, 'italic text-brand')}
          </p>
        </ScrollReveal>

        {/* ── Testimonial cards — equal height grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <ScrollReveal
              key={idx}
              variant="up"
              delay={idx * 120}
              className="group relative h-full"
            >
              <div
                className="relative flex h-full flex-col rounded-2xl border border-brand/[0.08] p-6 transition-all duration-500 hover:border-brand/20 hover:shadow-[0_20px_60px_-20px_rgba(255,0,102,0.12)] lg:p-7"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 240, 245, 0.95), rgba(253, 215, 225, 0.9))',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Decorative top accent line */}
                <div
                  className="absolute left-6 right-6 top-0 h-[2px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #ff0066, #e6005c, transparent)',
                  }}
                />

                {/* Quote mark + stars */}
                <div className="mb-4 flex items-start justify-between">
                  <svg
                    className="h-8 w-8 text-brand/15 transition-colors duration-500 group-hover:text-brand/30"
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <path d="M10.4 18.8c-1.2 0-2.3-.3-3.2-.8C5.9 17.2 5 15.8 5 14c0-1.2.3-2.3.8-3.2C6.6 9.3 7.8 8.2 9.6 7.2c1.8-1 3.8-1.6 5.6-1.8l.4 1.6c-2 .6-3.4 1.4-4.4 2.4-.8.8-1.2 1.8-1.2 2.8 0 .4.2.8.4 1 .4.2.8.4 1.4.4 1 0 1.8.4 2.6 1.2.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.6-2 1-3 1zm16 0c-1.2 0-2.3-.3-3.2-.8C21.9 17.2 21 15.8 21 14c0-1.2.3-2.3.8-3.2C22.6 9.3 23.8 8.2 25.6 7.2c1.8-1 3.8-1.6 5.6-1.8l.4 1.6c-2 .6-3.4 1.4-4.4 2.4-.8.8-1.2 1.8-1.2 2.8 0 .4.2.8.4 1 .4.2.8.4 1.4.4 1 0 1.8.4 2.6 1.2.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3c-.8.6-2 1-3 1z" />
                  </svg>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="h-3 w-3 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Quote text */}
                <p className="flex-1 font-sans text-[0.88rem] leading-[1.65] text-ink/70">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 border-t border-ink/[0.06] pt-4">
                  <div className="relative">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full font-heading text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #ff0066, #e6005c)',
                      }}
                    >
                      {t.name.charAt(0)}
                    </span>
                    {/* Online dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink">{t.name}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── Bottom accent ── */}
        <ScrollReveal variant="up" delay={600} className="mt-8 text-center">
          <div className="rule-gold mx-auto w-24" />
          <p className="mt-4 font-heading text-base italic text-ink/40">
            &ldquo;Where every celebration becomes unforgettable.&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
