import { Button } from '@/components/ui/button';

// Replace with your actual About Us hero photo placed in public/Pictures/
const heroImage = '/Pictures/about-hero.jpg';

export default function AboutUsPage() {
  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section
        className="relative -mt-[173px] flex min-h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Subtle dark overlay so background photo shows through */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Spacer that matches navbar height so content sits below it visually */}
        <div className="h-[173px] shrink-0" />

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[173px] text-center">
          <h1 className="font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-bold italic leading-tight text-[#e61f83]">
            15 Years of Turning
            <br />
            Dreams into Milestones.
          </h1>

          <p className="mt-6 whitespace-nowrap text-[clamp(0.95rem,1.3vw,1.15rem)] leading-[1.75] text-[#3d2052]">
            At Schatzies Events PH, we believe you should be a guest at your own celebration. Since 2011,
            <br />
            we&rsquo;ve been the trusted partner for families and couples across the Philippines and beyond.
          </p>

          <Button className="mt-40 h-[52px] rounded-3xl border-2 border-[#3d2052] bg-transparent px-14 text-[1.05rem] font-semibold text-[#3d2052] shadow-none hover:bg-[#3d2052]/10">
            Inquire
          </Button>
        </div>
      </section>

      {/* ── Section 2: Stats Card + About Us Split ── */}
      <section className="bg-white px-6 py-16 lg:px-20 lg:py-24">

        {/* Stats Card */}
        <div className="mx-auto max-w-[72rem] rounded-3xl bg-[#fce4ef] px-10 py-10 shadow-[0_4px_24px_rgba(230,31,131,0.10)]">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-around sm:gap-0">
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold italic text-[#e61f83]">15</span>
              <span className="mt-1 text-[0.95rem] leading-snug text-[#3d2052]">Years in the Industry</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold italic text-[#e61f83]">500+</span>
              <span className="mt-1 text-[0.95rem] leading-snug text-[#3d2052]">
                Successful Events<br />(Weddings &amp; Debuts)
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold italic text-[#e61f83]">100%</span>
              <span className="mt-1 text-[0.95rem] leading-snug text-[#3d2052]">
                Commitment to<br />Stress-Free Planning
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold italic text-[#e61f83]">1</span>
              <span className="mt-1 text-[0.95rem] leading-snug text-[#3d2052]">
                Dedicated Team<br />for Every Client
              </span>
            </div>
          </div>
        </div>

        {/* About Us split layout */}
        <div className="mx-auto mt-16 flex max-w-[72rem] flex-col items-center gap-10 lg:flex-row lg:gap-14">

          {/* Left column — text */}
          <div className="flex-1">
            <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold italic text-[#e61f83]">
              About Us
            </h2>
            <p className="mt-5 text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.8] text-justify text-[#3d2052]">
              Known for our complete and affordable packages, our goal is simple:
              simplicity. From venue styling to full program coordination, we work
              closely with you to ensure your event runs flawlessly.
            </p>
          </div>

          {/* Right column — image */}
          <div className="w-full flex-1 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
            <div
              className="h-[22rem] w-full bg-cover bg-center lg:h-[20rem]"
              style={{ backgroundImage: `url(/Pictures/about-section.jpg)` }}
              role="img"
              aria-label="Schatzies Events venue setup"
            />
          </div>

        </div>
      </section>

      {/* ── Section 3: Why Choose Schatzies ── */}
      <section className="bg-[#fff0f5] px-6 py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[75rem]">

          {/* Heading block — compact */}
          <h2 className="font-heading text-[clamp(2rem,4.5vw,3rem)] font-bold italic text-[#e61f83]">
            Why Choose Schatzies?
          </h2>
          <p className="mt-3 max-w-[56rem] text-[clamp(0.95rem,1.3vw,1.05rem)] leading-[1.65] text-[#444]">
            With over 15 years of expertise, we turn complex logistics into seamless celebrations. As your
            reliable on-the-ground partner, we handle the details so you can simply stay in the moment.
          </p>

          {/* Feature grid — 4 columns, top-aligned */}
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* SVG gradient defs shared */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="wcsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e61f83" />
                  <stop offset="100%" stopColor="#501f5a" />
                </linearGradient>
              </defs>
            </svg>

            {/* Card 1 — 15+ Years of Expertise */}
            <div className="flex flex-col items-start">
              <div className="flex h-[130px] w-[150px] items-center justify-center rounded-2xl bg-[#fff5f8] shadow-[inset_0_2px_8px_rgba(230,31,131,0.15)]">
                <svg viewBox="0 0 64 64" className="h-[72px] w-[72px]" fill="none">
                  {/* Medal ribbon left */}
                  <path d="M24 4 L20 22 L32 18 L44 22 L40 4 Z" fill="url(#wcsGrad)" opacity="0.7" />
                  {/* Medal ribbon right */}
                  <path d="M28 4 L24 22 L32 18 L40 22 L36 4 Z" fill="url(#wcsGrad)" opacity="0.5" />
                  {/* Medal circle */}
                  <circle cx="32" cy="40" r="18" fill="url(#wcsGrad)" />
                  <circle cx="32" cy="40" r="14" fill="white" opacity="0.18" />
                  {/* Star */}
                  <path d="M32 28 L34.2 34.6 L41.2 34.6 L35.5 38.8 L37.7 45.4 L32 41.2 L26.3 45.4 L28.5 38.8 L22.8 34.6 L29.8 34.6 Z" fill="white" />
                </svg>
              </div>
              <h3 className="mt-4 text-[0.92rem] font-bold leading-snug text-[#1a1225]">
                15+ Years of Expertise
              </h3>
              <p className="mt-1.5 text-[0.88rem] leading-[1.6] text-justify text-[#555]">
                A decade and a half of helping many clients turn special occasions
                into perfectly managed, memorable events.
              </p>
            </div>

            {/* Card 2 — The Overseas Choice */}
            <div className="flex flex-col items-start">
              <div className="flex h-[130px] w-[150px] items-center justify-center rounded-2xl bg-[#fff5f8] shadow-[inset_0_2px_8px_rgba(230,31,131,0.15)]">
                <svg viewBox="0 0 64 64" className="h-[72px] w-[72px]" fill="none">
                  {/* Globe filled */}
                  <circle cx="32" cy="32" r="24" fill="url(#wcsGrad)" />
                  {/* Latitude lines */}
                  <ellipse cx="32" cy="32" rx="13" ry="24" stroke="white" strokeWidth="1.8" fill="none" />
                  <line x1="8" y1="32" x2="56" y2="32" stroke="white" strokeWidth="1.8" />
                  <path d="M11 20 Q32 26 53 20" stroke="white" strokeWidth="1.4" fill="none" />
                  <path d="M11 44 Q32 38 53 44" stroke="white" strokeWidth="1.4" fill="none" />
                </svg>
              </div>
              <h3 className="mt-4 text-[0.92rem] font-bold leading-snug text-[#1a1225]">
                The Overseas Choice
              </h3>
              <p className="mt-1.5 text-[0.88rem] leading-[1.6] text-justify text-[#555]">
                A trusted partner for overseas brides and busy couples who need a
                reliable team to take over the preparations and coordination.
              </p>
            </div>

            {/* Card 3 — All-Inclusive Ease */}
            <div className="flex flex-col items-start">
              <div className="flex h-[130px] w-[150px] items-center justify-center rounded-2xl bg-[#fff5f8] shadow-[inset_0_2px_8px_rgba(230,31,131,0.15)]">
                <svg viewBox="0 0 64 64" className="h-[72px] w-[72px]" fill="none">
                  {/* Left person */}
                  <circle cx="14" cy="20" r="7" fill="url(#wcsGrad)" opacity="0.75" />
                  <path d="M4 44c0-7 4.5-12 10-12s10 5 10 12" fill="url(#wcsGrad)" opacity="0.75" />
                  {/* Right person */}
                  <circle cx="50" cy="20" r="7" fill="url(#wcsGrad)" opacity="0.75" />
                  <path d="M40 44c0-7 4.5-12 10-12s10 5 10 12" fill="url(#wcsGrad)" opacity="0.75" />
                  {/* Center person (front) */}
                  <circle cx="32" cy="16" r="9" fill="url(#wcsGrad)" />
                  <path d="M18 46c0-8 6.3-14 14-14s14 6 14 14" fill="url(#wcsGrad)" />
                </svg>
              </div>
              <h3 className="mt-4 text-[0.92rem] font-bold leading-snug text-[#1a1225]">
                All-Inclusive Ease
              </h3>
              <p className="mt-1.5 text-[0.88rem] leading-[1.6] text-justify text-[#555]">
                Complete event packages that handle everything&mdash;from elegant
                venue styling and buffet catering to professional photo and video
                coverage.
              </p>
            </div>

            {/* Card 4 — Budget-Friendly Luxury */}
            <div className="flex flex-col items-start">
              <div className="flex h-[130px] w-[150px] items-center justify-center rounded-2xl bg-[#fff5f8] shadow-[inset_0_2px_8px_rgba(230,31,131,0.15)]">
                <svg viewBox="0 0 64 64" className="h-[72px] w-[72px]" fill="none">
                  <circle cx="32" cy="32" r="24" fill="url(#wcsGrad)" />
                  <circle cx="32" cy="32" r="17" fill="white" opacity="0.18" />
                  {/* Dollar sign paths */}
                  <rect x="30" y="14" width="4" height="36" rx="2" fill="white" />
                  <path d="M22 23c0-4 4-7 10-7s10 3 10 7c0 4-4 6-10 6s-10 2-10 6c0 4 4 8 10 8s10-4 10-8" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <h3 className="mt-4 text-[0.92rem] font-bold leading-snug text-[#1a1225]">
                Budget-Friendly Luxury
              </h3>
              <p className="mt-1.5 text-[0.88rem] leading-[1.6] text-justify text-[#555]">
                Expertly managing the details so you can focus on the moment. We
                specialize in all-inclusive event solutions that are both affordable
                and adaptable.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Logo Footer ── */}
      <section className="border-t border-[#e8e8e8] bg-white py-10">
        <div className="relative mx-auto flex max-w-[75rem] items-center justify-center px-6 lg:px-20">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events logo"
            className="h-[100px] w-auto"
          />
          {/* Scroll-to-top arrow — right aligned */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-6 text-[#555] transition hover:text-[#e61f83] lg:right-20"
            aria-label="Scroll to top"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 15 12 8 19 15" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
