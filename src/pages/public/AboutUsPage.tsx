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
        {/* Gradient overlay from bottom - #FF589C 0% to #FD78AD 58% */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF589C] via-[#FD78AD]/60 to-transparent" />

        {/* Additional white overlay for brightness at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />

        {/* Subtle dark overlay for text readability at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Spacer that matches navbar height so content sits below it visually */}
        <div className="h-[173px] shrink-0" />

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[173px] text-center">
          <h1
            className="font-heading text-[clamp(4rem,10vw,8rem)] font-bold leading-tight bg-gradient-to-r text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
            }}
          >
            15 Years of Turning
            <br />
            Dreams into Milestones.
          </h1>

          <p className="mt-8 max-w-[50rem] text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.75] font-sans text-black/80 drop-shadow-lg">
            At Schatzies Events PH, we believe you should be a guest at your own celebration. Since
            2011, we&rsquo;ve been the trusted partner for families and couples across the
            Philippines and beyond.
          </p>

          <Button className="mt-10 h-[80px] rounded-3xl bg-gradient-to-b from-[#FF0066] to-[#700F81] px-12 text-[1.5rem] font-bold uppercase tracking-wide shadow-[0_12px_28px_rgba(39,21,57,0.5)] hover:brightness-110">
            Inquire
          </Button>
        </div>
      </section>

      {/* ── Section 2: Stats Card + About Us Split ── */}
      <section className="bg-white px-6 py-20 lg:px-20 lg:py-28">
        {/* Stats Card */}
        <div className="mx-auto max-w-[90rem] rounded-3xl bg-[#fce4ef] px-12 py-12 shadow-[0_4px_24px_rgba(230,31,131,0.10)]">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-around sm:gap-0">
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(3rem,6vw,4rem)] font-bold text-[#FF0066]">
                15
              </span>
              <span className="mt-2 text-[1rem] font-sans text-[#4A1053]">
                Years in the Industry
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(3rem,6vw,4rem)] font-bold text-[#FF0066]">
                500+
              </span>
              <span className="mt-2 text-[1rem] font-sans text-[#4A1053]">
                Successful Events
                <br />
                (Weddings &amp; Debuts)
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(3rem,6vw,4rem)] font-bold text-[#FF0066]">
                100%
              </span>
              <span className="mt-2 text-[1rem] font-sans text-[#4A1053]">
                Commitment to
                <br />
                Stress-Free Planning
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(3rem,6vw,4rem)] font-bold text-[#FF0066]">
                1
              </span>
              <span className="mt-2 text-[1rem] font-sans text-[#4A1053]">
                Dedicated Team
                <br />
                for Every Client
              </span>
            </div>
          </div>
        </div>

        {/* About Us split layout */}
        <div className="mx-auto mt-20 flex max-w-[90rem] flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left column — text */}
          <div className="flex-1">
            <h2 className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[#FF0066]">
              About Us
            </h2>
            <p className="mt-6 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.8] text-justify font-sans text-[#4A1053]">
              Known for our complete and affordable packages, our goal is simple: simplicity. From
              venue styling to full program coordination, we work closely with you to ensure your
              event runs flawlessly.
            </p>
          </div>

          {/* Right column — image */}
          <div className="w-full flex-1 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:scale-105">
            <div
              className="h-[22rem] w-full bg-cover bg-center lg:h-[24rem]"
              style={{ backgroundImage: `url(/Pictures/about-section.jpg)` }}
              role="img"
              aria-label="Schatzies Events venue setup"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Why Choose Schatzies ── */}
      <section className="bg-[#fff0f5] px-6 py-28 lg:px-20 lg:py-36">
        <div className="mx-auto max-w-[90rem]">
          {/* Heading block - maximized spacing */}
          <div className="text-center">
            <h2 className="font-heading text-[clamp(3rem,7vw,4.5rem)] font-bold text-[#FF0066]">
              Why Choose Schatzies?
            </h2>
            <p className="mt-6 mx-auto max-w-[70rem] text-[clamp(1.2rem,2rem,1.7rem)] leading-[1.8] font-sans text-[#4A1053]">
              With over 15 years of expertise, we turn complex logistics into seamless celebrations.
              As your reliable on-the-ground partner, we handle the details so you can simply stay
              in the moment.
            </p>
          </div>

          {/* Feature grid — 4 columns with maximized spacing */}
          <div className="mt-24 grid grid-cols-1 gap-x-16 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
            {/* SVG gradient defs shared */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="wcsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF0066" />
                  <stop offset="100%" stopColor="#4A1053" />
                </linearGradient>
              </defs>
            </svg>

            {/* Card 1 — 15+ Years of Expertise */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                <svg viewBox="0 0 64 64" className="h-[100px] w-[100px]" fill="none">
                  <circle cx="32" cy="40" r="18" fill="url(#wcsGrad)" />
                  <circle cx="32" cy="40" r="14" fill="white" opacity="0.18" />
                  <path
                    d="M32 28 L34.2 34.6 L41.2 34.6 L35.5 38.8 L37.7 45.4 L32 41.2 L26.3 45.4 L28.5 38.8 L22.8 34.6 L29.8 34.6 Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="mt-8 text-[1.5rem] font-bold text-[#FF0066]">
                15+ Years of Expertise
              </h3>
              <p className="mt-4 text-[1.1rem] leading-[1.7] text-justify font-sans text-[#4A1053] max-w-[280px]">
                A decade and a half of helping many clients turn special occasions into perfectly
                managed, memorable events.
              </p>
            </div>

            {/* Card 2 — The Overseas Choice */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                <svg viewBox="0 0 64 64" className="h-[100px] w-[100px]" fill="none">
                  <circle cx="32" cy="32" r="24" fill="url(#wcsGrad)" />
                  <ellipse
                    cx="32"
                    cy="32"
                    rx="13"
                    ry="24"
                    stroke="white"
                    strokeWidth="1.8"
                    fill="none"
                  />
                  <line x1="8" y1="32" x2="56" y2="32" stroke="white" strokeWidth="1.8" />
                  <path d="M11 20 Q32 26 53 20" stroke="white" strokeWidth="1.4" fill="none" />
                  <path d="M11 44 Q32 38 53 44" stroke="white" strokeWidth="1.4" fill="none" />
                </svg>
              </div>
              <h3 className="mt-8 text-[1.5rem] font-bold text-[#FF0066]">The Overseas Choice</h3>
              <p className="mt-4 text-[1.1rem] leading-[1.7] text-justify font-sans text-[#4A1053] max-w-[280px]">
                A trusted partner for overseas brides and busy couples who need a reliable team to
                take over the preparations and coordination.
              </p>
            </div>

            {/* Card 3 — All-Inclusive Ease */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                <svg viewBox="0 0 64 64" className="h-[100px] w-[100px]" fill="none">
                  <circle cx="14" cy="20" r="7" fill="url(#wcsGrad)" opacity="0.75" />
                  <path d="M4 44c0-7 4.5-12 10-12s10 5 10 12" fill="url(#wcsGrad)" opacity="0.75" />
                  <circle cx="50" cy="20" r="7" fill="url(#wcsGrad)" opacity="0.75" />
                  <path
                    d="M40 44c0-7 4.5-12 10-12s10 5 10 12"
                    fill="url(#wcsGrad)"
                    opacity="0.75"
                  />
                  <circle cx="32" cy="16" r="9" fill="url(#wcsGrad)" />
                  <path d="M18 46c0-8 6.3-14 14-14s14 6 14 14" fill="url(#wcsGrad)" />
                </svg>
              </div>
              <h3 className="mt-8 text-[1.5rem] font-bold text-[#FF0066]">All-Inclusive Ease</h3>
              <p className="mt-4 text-[1.1rem] leading-[1.7] text-justify font-sans text-[#4A1053] max-w-[280px]">
                Complete event packages that handle everything&mdash;from elegant venue styling and
                buffet catering to professional photo and video coverage.
              </p>
            </div>

            {/* Card 4 — Budget-Friendly Luxury */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                <svg viewBox="0 0 64 64" className="h-[100px] w-[100px]" fill="none">
                  <circle cx="32" cy="32" r="24" fill="url(#wcsGrad)" />
                  <circle cx="32" cy="32" r="17" fill="white" opacity="0.18" />
                  <rect x="30" y="14" width="4" height="36" rx="2" fill="white" />
                  <path
                    d="M22 23c0-4 4-7 10-7s10 3 10 7c0 4-4 6-10 6s-10 2-10 6c0 4 4 8 10 8s10-4 10-8"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
              <h3 className="mt-8 text-[1.5rem] font-bold text-[#FF0066]">
                Budget-Friendly Luxury
              </h3>
              <p className="mt-4 text-[1.1rem] leading-[1.7] text-justify font-sans text-[#4A1053] max-w-[280px]">
                Expertly managing the details so you can focus on the moment. We specialize in
                all-inclusive event solutions that are both affordable and adaptable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo Footer ── */}
      <section className="border-t border-[#e8e8e8] bg-white py-16">
        <div className="relative mx-auto flex max-w-[90rem] items-center justify-center px-6 lg:px-20">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events logo"
            className="h-[160px] w-auto transition-transform duration-300 hover:scale-105"
          />
          {/* Scroll-to-top arrow — right aligned */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-6 text-[#555] transition hover:text-[#FF0066] lg:right-20"
            aria-label="Scroll to top"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-14 w-14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="5 15 12 8 19 15" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
