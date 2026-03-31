import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { InquiryForm } from '@/components/InquiryForm';

// Replace with your actual About Us hero photo placed in public/Pictures/
const heroImage = '/Pictures/about-hero.jpg';

export default function AboutUsPage() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section
        className="relative -mt-[88px] flex min-h-[60vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient overlay from bottom - #FF589C 0% to #FD78AD 58% */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF589C] via-[#FD78AD]/60 to-transparent" />

        {/* Additional white overlay for brightness at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />

        {/* Subtle dark overlay for text readability at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Spacer that matches navbar height */}
        <div className="h-[88px] shrink-0 sm:h-[110px] lg:h-[173px]" />

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12 text-center sm:px-6 sm:pb-16 lg:pb-[173px]">
          <h1
            className="font-heading text-[clamp(2rem,8vw,5rem)] font-bold leading-tight bg-gradient-to-r text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
            }}
          >
            15 Years of Turning
            <br />
            Dreams into Milestones.
          </h1>

          <p className="mt-3 max-w-[40rem] text-[clamp(0.9rem,1.8vw,1.3rem)] leading-[1.7] font-sans text-black/80 drop-shadow-lg sm:mt-4 sm:max-w-[45rem] lg:mt-6 lg:max-w-[50rem] lg:text-[1.4rem]">
            At Schatzies Events PH, we believe you should be a guest at your own celebration. Since
            2011, we&rsquo;ve been the trusted partner for families and couples across the
            Philippines and beyond.
          </p>

          <Button
            variant="outline"
            onClick={() => setInquiryOpen(true)}
            className="mt-5 h-10 rounded-full border-2 border-[#FF0066] bg-transparent px-6 text-[0.85rem] font-bold uppercase tracking-wide text-[#FF0066] shadow-[0_8px_20px_rgba(39,21,57,0.2)] hover:bg-[#fff0f6] hover:text-[#FF0066] sm:mt-6 sm:h-12 sm:px-8 sm:text-[1rem] lg:mt-8 lg:h-14 lg:px-10 lg:text-[1.1rem]"
          >
            Inquire
          </Button>
        </div>
      </section>

      {/* ── Section 2: Stats Card + About Us Split ── */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        {/* Stats Card */}
        <div className="mx-auto max-w-[80rem] rounded-2xl bg-[#fce4ef] px-5 py-6 shadow-[0_4px_20px_rgba(230,31,131,0.08)] sm:max-w-[85rem] sm:rounded-3xl sm:px-8 sm:py-10 lg:max-w-[90rem] lg:px-12 lg:py-12">
          <div className="grid grid-cols-2 gap-6 sm:flex sm:flex-row sm:justify-around sm:gap-0">
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,5vw,3.2rem)] font-bold bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                15
              </span>
              <span className="mt-1 text-[0.85rem] font-sans text-[#4A1053] sm:mt-2 sm:text-[0.9rem] lg:text-[1rem]">
                Years in the Industry
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,5vw,3.2rem)] font-bold bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                500+
              </span>
              <span className="mt-1 text-[0.85rem] font-sans text-[#4A1053] sm:mt-2 sm:text-[0.9rem] lg:text-[1rem]">
                Successful Events
                <br />
                (Weddings &amp; Debuts)
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,5vw,3.2rem)] font-bold bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                100%
              </span>
              <span className="mt-1 text-[0.85rem] font-sans text-[#4A1053] sm:mt-2 sm:text-[0.9rem] lg:text-[1rem]">
                Commitment to
                <br />
                Stress-Free Planning
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-heading text-[clamp(2.2rem,5vw,3.2rem)] font-bold bg-gradient-to-r from-[#FF0066] to-[#700F81] bg-clip-text text-transparent">
                1
              </span>
              <span className="mt-1 text-[0.85rem] font-sans text-[#4A1053] sm:mt-2 sm:text-[0.9rem] lg:text-[1rem]">
                Dedicated Team
                <br />
                for Every Client
              </span>
            </div>
          </div>
        </div>

        {/* About Us split layout */}
        <div className="mx-auto mt-12 flex max-w-[80rem] flex-col items-center gap-10 sm:mt-16 sm:max-w-[85rem] sm:gap-12 lg:mt-20 lg:max-w-[90rem] lg:flex-row lg:gap-16">
          {/* Left column — text */}
          <div className="flex-1">
            <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#FF0066]">
              About Us
            </h2>
            <p className="mt-4 text-[clamp(0.9rem,1.5vw,1.2rem)] leading-[1.7] text-justify font-sans text-[#4A1053] sm:mt-5 lg:mt-6 lg:text-[1.25rem]">
              Known for our complete and affordable packages, our goal is simple: simplicity. From
              venue styling to full program coordination, we work closely with you to ensure your
              event runs flawlessly.
            </p>
          </div>

          {/* Right column — image */}
          <div className="w-full flex-1 overflow-hidden rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 sm:rounded-2xl">
            <div
              className="h-[16rem] w-full bg-cover bg-center sm:h-[18rem] lg:h-[20rem]"
              style={{ backgroundImage: `url(/Pictures/about-section.jpg)` }}
              role="img"
              aria-label="Schatzies Events venue setup"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Why Choose Schatzies ── */}
      <section className="bg-[#fff0f5] px-4 py-12 sm:px-6 sm:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[80rem] sm:max-w-[85rem] lg:max-w-[90rem]">
          {/* Heading block */}
          <div className="text-center">
            <h2 className="font-heading text-[clamp(1.8rem,6vw,3.5rem)] font-bold text-[#FF0066]">
              Why Choose Schatzies?
            </h2>
            <p className="mt-3 mx-auto max-w-[50rem] text-[clamp(0.9rem,1.6vw,1.2rem)] leading-[1.7] font-sans text-[#4A1053] sm:mt-4 sm:max-w-[55rem] lg:mt-5 lg:max-w-[60rem] lg:text-[1.25rem]">
              With over 15 years of expertise, we turn complex logistics into seamless celebrations.
              As your reliable on-the-ground partner, we handle the details so you can simply stay
              in the moment.
            </p>
          </div>

          {/* Feature grid — 4 columns */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:mt-16 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-14">
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
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                <svg
                  viewBox="0 0 64 64"
                  className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  fill="none"
                >
                  <circle cx="32" cy="40" r="18" fill="url(#wcsGrad)" />
                  <circle cx="32" cy="40" r="14" fill="white" opacity="0.18" />
                  <path
                    d="M32 28 L34.2 34.6 L41.2 34.6 L35.5 38.8 L37.7 45.4 L32 41.2 L26.3 45.4 L28.5 38.8 L22.8 34.6 L29.8 34.6 Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-[1rem] font-bold text-[#FF0066] sm:mt-4 sm:text-[1.2rem] lg:mt-5 lg:text-[1.3rem]">
                15+ Years of Expertise
              </h3>
              <p className="mt-2 text-[0.85rem] leading-[1.6] text-justify font-sans text-[#4A1053] max-w-[240px] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[0.95rem]">
                A decade and a half of helping many clients turn special occasions into perfectly
                managed, memorable events.
              </p>
            </div>

            {/* Card 2 — The Overseas Choice */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                <svg
                  viewBox="0 0 64 64"
                  className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  fill="none"
                >
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
              <h3 className="mt-3 text-[1rem] font-bold text-[#FF0066] sm:mt-4 sm:text-[1.2rem] lg:mt-5 lg:text-[1.3rem]">
                The Overseas Choice
              </h3>
              <p className="mt-2 text-[0.85rem] leading-[1.6] text-justify font-sans text-[#4A1053] max-w-[240px] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[0.95rem]">
                A trusted partner for overseas brides and busy couples who need a reliable team to
                take over the preparations and coordination.
              </p>
            </div>

            {/* Card 3 — All-Inclusive Ease */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                <svg
                  viewBox="0 0 64 64"
                  className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  fill="none"
                >
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
              <h3 className="mt-3 text-[1rem] font-bold text-[#FF0066] sm:mt-4 sm:text-[1.2rem] lg:mt-5 lg:text-[1.3rem]">
                All-Inclusive Ease
              </h3>
              <p className="mt-2 text-[0.85rem] leading-[1.6] text-justify font-sans text-[#4A1053] max-w-[240px] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[0.95rem]">
                Complete event packages that handle everything&mdash;from elegant venue styling and
                buffet catering to professional photo and video coverage.
              </p>
            </div>

            {/* Card 4 — Budget-Friendly Luxury */}
            <div className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                <svg
                  viewBox="0 0 64 64"
                  className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  fill="none"
                >
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
              <h3 className="mt-3 text-[1rem] font-bold text-[#FF0066] sm:mt-4 sm:text-[1.2rem] lg:mt-5 lg:text-[1.3rem]">
                Budget-Friendly Luxury
              </h3>
              <p className="mt-2 text-[0.85rem] leading-[1.6] text-justify font-sans text-[#4A1053] max-w-[240px] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[0.95rem]">
                Expertly managing the details so you can focus on the moment. We specialize in
                all-inclusive event solutions that are both affordable and adaptable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo Footer ── */}
      <section className="border-t border-[#e8e8e8] bg-white py-8 sm:py-12">
        <div className="relative mx-auto flex max-w-[80rem] items-center justify-center px-4 sm:max-w-[85rem] sm:px-6 lg:max-w-[90rem] lg:px-20">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events logo"
            className="h-14 w-auto transition-transform duration-300 hover:scale-105 sm:h-20 lg:h-24"
          />
          {/* Scroll-to-top arrow */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute right-4 text-[#555] transition hover:text-[#FF0066] sm:right-6 lg:right-8"
            aria-label="Scroll to top"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
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

      {/* ── Inquiry Form Modal ── */}
      {inquiryOpen && <InquiryForm onClose={() => setInquiryOpen(false)} />}
    </div>
  );
}
