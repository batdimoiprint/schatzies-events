import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { renderContentText } from '@/hooks/useContent';

/* ─────────────────────────────────────────────────────────
 * ServicesSection — "A Love Story Told in Every Detail"
 * Black background, animated SVG silk waves, gold frames,
 * pink accent text, sparkle particles. Zero texture images.
 * ───────────────────────────────────────────────────────── */

/* ── Animated SVG silk wave background ── */
function SilkWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Flowing silk curve - left side */}
      <svg
        className="absolute -left-[10%] top-0 h-full w-[60%] opacity-[0.06]"
        viewBox="0 0 600 1200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,200 50,400 200,600 C350,800 100,1000 300,1200 L0,1200 Z"
          fill="url(#silk-left)"
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,0 C150,200 50,400 200,600 C350,800 100,1000 300,1200 L0,1200 Z;
              M0,0 C100,250 200,350 150,600 C100,850 250,950 200,1200 L0,1200 Z;
              M0,0 C200,150 0,450 250,600 C500,750 50,1050 350,1200 L0,1200 Z;
              M0,0 C150,200 50,400 200,600 C350,800 100,1000 300,1200 L0,1200 Z
            "
          />
        </path>
        <defs>
          <linearGradient id="silk-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#cccccc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Flowing silk curve - right side */}
      <svg
        className="absolute -right-[10%] top-0 h-full w-[60%] opacity-[0.05]"
        viewBox="0 0 600 1200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M600,0 C450,200 550,400 400,600 C250,800 500,1000 300,1200 L600,1200 Z"
          fill="url(#silk-right)"
        >
          <animate
            attributeName="d"
            dur="15s"
            repeatCount="indefinite"
            values="
              M600,0 C450,200 550,400 400,600 C250,800 500,1000 300,1200 L600,1200 Z;
              M600,0 C500,250 400,350 450,600 C500,850 350,950 400,1200 L600,1200 Z;
              M600,0 C400,150 600,450 350,600 C100,750 550,1050 250,1200 L600,1200 Z;
              M600,0 C450,200 550,400 400,600 C250,800 500,1000 300,1200 L600,1200 Z
            "
          />
        </path>
        <defs>
          <linearGradient id="silk-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#aaaaaa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center flowing accent */}
      <svg
        className="absolute left-[20%] top-[10%] h-[80%] w-[60%] opacity-[0.03]"
        viewBox="0 0 800 1000"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M200,0 C350,150 100,350 400,500 C700,650 150,850 500,1000"
          stroke="url(#silk-center)"
          strokeWidth="120"
          strokeLinecap="round"
          fill="none"
        >
          <animate
            attributeName="d"
            dur="18s"
            repeatCount="indefinite"
            values="
              M200,0 C350,150 100,350 400,500 C700,650 150,850 500,1000;
              M300,0 C100,200 500,300 250,500 C0,700 600,800 400,1000;
              M150,0 C400,100 50,400 350,500 C650,600 200,900 550,1000;
              M200,0 C350,150 100,350 400,500 C700,650 150,850 500,1000
            "
          />
        </path>
        <defs>
          <linearGradient id="silk-center" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Floating sparkle/chandelier particles ── */
function SparkleParticles() {
  const particles = [
    { cx: '15%', cy: '25%', delay: '0s', dur: '4s', r: 1.5 },
    { cx: '85%', cy: '15%', delay: '1s', dur: '5s', r: 1 },
    { cx: '50%', cy: '50%', delay: '2s', dur: '6s', r: 2 },
    { cx: '75%', cy: '70%', delay: '0.5s', dur: '4.5s', r: 1.2 },
    { cx: '25%', cy: '80%', delay: '3s', dur: '5.5s', r: 1.8 },
    { cx: '60%', cy: '30%', delay: '1.5s', dur: '4s', r: 1 },
    { cx: '40%', cy: '60%', delay: '2.5s', dur: '5s', r: 1.5 },
    { cx: '90%', cy: '45%', delay: '0.8s', dur: '6s', r: 1.3 },
    { cx: '10%', cy: '55%', delay: '3.5s', dur: '4.8s', r: 1.1 },
    { cx: '70%', cy: '90%', delay: '1.2s', dur: '5.2s', r: 1.6 },
    { cx: '30%', cy: '10%', delay: '2.8s', dur: '4.3s', r: 0.8 },
    { cx: '55%', cy: '85%', delay: '0.3s', dur: '5.8s', r: 1.4 },
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="#ffffff"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.6;0.2;0.8;0"
            dur={p.dur}
            begin={p.delay}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${p.r};${p.r * 1.8};${p.r * 0.6};${p.r * 1.4};${p.r}`}
            dur={p.dur}
            begin={p.delay}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

/* ── Wavy SVG divider (top/bottom of section) ── */
function WaveDivider({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top';
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 z-20 ${
        isTop ? '-top-px' : '-bottom-px'
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        className={`block w-full ${isTop ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
        style={{ height: 'clamp(60px, 8vw, 120px)' }}
      >
        <path
          d="M0,80 C240,120 480,20 720,60 C960,100 1200,30 1440,80 L1440,120 L0,120 Z"
          fill="#fdf8fc"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,80 C240,120 480,20 720,60 C960,100 1200,30 1440,80 L1440,120 L0,120 Z;
              M0,60 C240,30 480,100 720,70 C960,40 1200,110 1440,60 L1440,120 L0,120 Z;
              M0,80 C240,120 480,20 720,60 C960,100 1200,30 1440,80 L1440,120 L0,120 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}

/* ── Decorative chandelier SVG icon ── */
function ChandelierIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center stem */}
      <line x1="40" y1="0" x2="40" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
        <animate attributeName="y2" values="30;32;30" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Left arm */}
      <path
        d="M40,30 Q25,35 15,50"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.8"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M40,30 Q25,35 15,50;M40,30 Q23,37 13,52;M40,30 Q25,35 15,50"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      {/* Right arm */}
      <path
        d="M40,30 Q55,35 65,50"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.8"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M40,30 Q55,35 65,50;M40,30 Q57,37 67,52;M40,30 Q55,35 65,50"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      {/* Dripping crystals left */}
      <line x1="15" y1="50" x2="15" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5">
        <animate attributeName="y2" values="65;68;65" dur="3.5s" repeatCount="indefinite" />
      </line>
      <circle cx="15" cy="65" r="2" fill="rgba(255,255,255,0.15)">
        <animate attributeName="cy" values="65;68;65" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* Dripping crystals right */}
      <line x1="65" y1="50" x2="65" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5">
        <animate attributeName="y2" values="65;68;65" dur="3.8s" repeatCount="indefinite" />
      </line>
      <circle cx="65" cy="65" r="2" fill="rgba(255,255,255,0.15)">
        <animate attributeName="cy" values="65;68;65" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3.8s" repeatCount="indefinite" />
      </circle>
      {/* Center crystal */}
      <line x1="40" y1="30" x2="40" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5">
        <animate attributeName="y2" values="55;58;55" dur="4s" repeatCount="indefinite" />
      </line>
      <circle cx="40" cy="55" r="3" fill="rgba(255,255,255,0.2)">
        <animate attributeName="cy" values="55;58;55" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Small side drops */}
      <line x1="28" y1="33" x2="28" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <circle cx="28" cy="45" r="1.5" fill="rgba(255,255,255,0.12)">
        <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <line x1="52" y1="33" x2="52" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
      <circle cx="52" cy="45" r="1.5" fill="rgba(255,255,255,0.12)">
        <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ── Gold-bordered image frame like Figma design ── */
function GoldFrame({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer gold glow */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-amber-200/20 via-amber-100/10 to-amber-300/15 blur-sm" />
      {/* Gold border frame */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          border: '2px solid rgba(212, 175, 110, 0.4)',
          boxShadow:
            '0 0 20px rgba(212, 175, 110, 0.08), inset 0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Inner gold accent line */}
        <div
          className="absolute inset-[3px] z-10 rounded-[5px] pointer-events-none"
          style={{ border: '1px solid rgba(212, 175, 110, 0.15)' }}
        />
        <img
          src={src}
          alt={alt}
          className="relative z-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
          loading="lazy"
        />
        {/* Image overlay gradient */}
        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}

/* ── Animated SVG heart line drawing ── */
function HeartLineDraw({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30,50 C30,50 5,35 5,18 C5,8 12,2 20,2 C25,2 28,5 30,10 C32,5 35,2 40,2 C48,2 55,8 55,18 C55,35 30,50 30,50 Z"
        stroke="url(#heart-gradient)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="3s"
          begin="0.5s"
          fill="freeze"
        />
      </path>
      <defs>
        <linearGradient id="heart-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff0066" />
          <stop offset="100%" stopColor="#ff3385" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Animated rings SVG for milestone section ── */
function MilestoneRings({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="28"
        cy="20"
        r="14"
        stroke="rgba(255,0,102,0.3)"
        strokeWidth="1"
        strokeDasharray="88"
        strokeDashoffset="88"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="88"
          to="0"
          dur="2s"
          begin="0.8s"
          fill="freeze"
        />
      </circle>
      <circle
        cx="52"
        cy="20"
        r="14"
        stroke="rgba(255,0,102,0.3)"
        strokeWidth="1"
        strokeDasharray="88"
        strokeDashoffset="88"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="88"
          to="0"
          dur="2s"
          begin="1.2s"
          fill="freeze"
        />
      </circle>
    </svg>
  );
}

/* ── Floating SVG diamond shapes ── */
function FloatingDiamonds() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
      aria-hidden="true"
    >
      {[
        { x: 100, y: 200, size: 8, dur: '7s', delay: '0s' },
        { x: 300, y: 600, size: 6, dur: '9s', delay: '2s' },
        { x: 800, y: 300, size: 10, dur: '8s', delay: '1s' },
        { x: 1100, y: 500, size: 7, dur: '10s', delay: '3s' },
        { x: 600, y: 150, size: 5, dur: '6s', delay: '4s' },
        { x: 200, y: 800, size: 9, dur: '11s', delay: '1.5s' },
        { x: 900, y: 700, size: 6, dur: '8.5s', delay: '2.5s' },
      ].map((d, i) => (
        <g key={i}>
          <rect
            x={d.x}
            y={d.y}
            width={d.size}
            height={d.size}
            fill="#ffffff"
            transform={`rotate(45 ${d.x + d.size / 2} ${d.y + d.size / 2})`}
          >
            <animate
              attributeName="opacity"
              values="0;1;0.3;0.8;0"
              dur={d.dur}
              begin={d.delay}
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`45 ${d.x + d.size / 2} ${d.y + d.size / 2}`}
              to={`405 ${d.x + d.size / 2} ${d.y + d.size / 2}`}
              dur={d.dur}
              begin={d.delay}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}
    </svg>
  );
}

/* ── Main Services Section ── */
/* ── Main Services Section ── */
export default function ServicesSection({
  weddingsContent,
  debutsContent,
}: {
  weddingsContent?: { title: string; body: string };
  debutsContent?: { title: string; body: string };
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const weddingTitle = weddingsContent?.title ?? 'A *Love Story* Told in Every Detail';
  const weddingBody = weddingsContent?.body ?? 'We don’t just plan weddings; we protect your peace. From intimate vows to grand ballrooms, we ensure the only thing you focus on is the person at the end of the aisle.';

  const debutTitle = debutsContent?.title ?? "*Your 18th:* More Than a Birthday, It's a *Milestone*";
  const debutBody = debutsContent?.body ?? 'Eighteen years in the making, designed in a single night. We transform your milestone into a cinematic celebration that captures exactly who you are and who you’re becoming.';

  const renderWeddingTitle = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span
            key={i}
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #ff0066, #ff3385)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  const renderDebutTitle = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    let starCount = 0;
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const isSecond = starCount > 0;
        starCount++;
        return (
          <span
            key={i}
            className={`italic ${isSecond ? 'underline decoration-[#ff0066]/30 underline-offset-4' : ''}`}
            style={{
              background: 'linear-gradient(135deg, #ff0066, #ff3385)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ═══════════ WEDDING SECTION ═══════════ */}
      <section
        ref={sectionRef}
        id="weddings"
        className="relative overflow-hidden bg-black min-h-screen lg:max-h-screen flex items-center justify-center py-12 lg:py-0"
      >
        {/* ── SVG animated backgrounds ── */}
        <SilkWaves />
        <SparkleParticles />
        <FloatingDiamonds />

        {/* ── Wave divider top ── */}
        <WaveDivider position="top" />

        {/* ── Section content ── */}
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Left — text */}
            <ScrollReveal variant="left" className="space-y-6 lg:order-1">
              <h3 className="font-heading text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] text-white">
                {renderWeddingTitle(weddingTitle)}
              </h3>

              {/* Animated heart + rule line */}
              <div className="flex items-center gap-3">
                {isVisible && <HeartLineDraw className="h-6 w-7 flex-shrink-0" />}
                <div className="h-px flex-1 bg-gradient-to-r from-[#ff0066]/40 to-transparent" />
              </div>

              <p className="max-w-md font-sans text-base leading-[1.7] text-white/65 lg:text-[1.05rem] whitespace-pre-line">
                {renderContentText(weddingBody, 'text-[#ff0066] font-semibold')}
              </p>
            </ScrollReveal>

            {/* Right — image with gold frame */}
            <ScrollReveal variant="right" className="relative lg:order-2">
              <ChandelierIcon className="absolute -top-16 right-[15%] h-24 w-20 opacity-60 lg:-top-20 lg:h-28 lg:w-24" />
              <GoldFrame
                src="/Pictures/service-wedding.jpg"
                alt="A Love Story Told in Every Detail"
                className="aspect-[4/3] w-full lg:aspect-[5/4]"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════ DEBUT SECTION ═══════════ */}
      <section
        id="debuts"
        className="relative overflow-hidden bg-black min-h-screen lg:max-h-screen flex items-center justify-center py-12 lg:py-0"
      >
        {/* ── SVG animated backgrounds ── */}
        <SilkWaves />
        <SparkleParticles />
        <FloatingDiamonds />

        {/* ── Wave divider bottom ── */}
        <WaveDivider position="bottom" />

        {/* ── Section content ── */}
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Left — image collage */}
            <ScrollReveal variant="left" className="relative lg:order-1">
              <div className="grid grid-cols-2 gap-3">
                <GoldFrame
                  src="/Pictures/service-debut.jpg"
                  alt="Debut celebration"
                  className="col-span-2 aspect-[16/10] w-full"
                />
                <GoldFrame
                  src="/Pictures/debut-blooms.jpg"
                  alt="Debut decorations"
                  className="aspect-square w-full"
                />
                <GoldFrame
                  src="/Pictures/gallery-5.jpg"
                  alt="Debut event details"
                  className="aspect-square w-full"
                />
              </div>
            </ScrollReveal>

            {/* Right — text */}
            <ScrollReveal variant="right" className="space-y-6 lg:order-2">
              <h3 className="font-heading text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] text-white">
                {renderDebutTitle(debutTitle)}
              </h3>

              {/* Animated rings + rule line */}
              <div className="flex items-center gap-3">
                {isVisible && <MilestoneRings className="h-5 w-10 flex-shrink-0" />}
                <div className="h-px flex-1 bg-gradient-to-r from-[#ff0066]/40 to-transparent" />
              </div>

              <p className="max-w-md font-sans text-base leading-[1.7] text-white/65 lg:text-[1.05rem] whitespace-pre-line">
                {renderContentText(debutBody, 'text-[#ff0066] font-semibold')}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
