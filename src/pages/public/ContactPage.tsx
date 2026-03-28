// Replace with your actual Contact hero photo placed in public/Pictures/
const heroImage = '/Pictures/contact-hero.jpg';

export default function ContactPage() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative -mt-[173px] min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* White-to-pink translucent overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-[#f9b8d4]/50" />

        {/* Spacer that matches navbar height */}
        <div className="h-[173px]" />

        {/* Centered hero text */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-32 pt-10 text-center">
          <h1 className="font-heading text-[clamp(2.8rem,6vw,5rem)] font-bold italic leading-tight text-[#e61f83]">
            Contact Us
          </h1>
          <p className="mt-4 whitespace-nowrap text-[clamp(0.9rem,1.2vw,1.05rem)] leading-[1.7] text-[#3d2052]">
            Whether you have an event type in mind or just want to explore the
            possibilities, our team is ready to listen.
          </p>
        </div>
      </section>

      {/* ── Bottom gradient section with overlapping cards ── */}
      <section className="bg-gradient-to-b from-white via-[#fce4ef] to-[#f9b8d4] pb-20">

        {/* Cards container — negative top margin pulls into hero */}
        <div className="relative z-10 mx-auto -mt-32 flex max-w-5xl flex-col gap-8 px-6 md:flex-row lg:px-4">

          {/* Business Location card */}
          <div className="w-full rounded-2xl bg-white p-10 shadow-xl md:w-1/2">
            <h2 className="text-center font-heading text-[clamp(1.4rem,2.5vw,1.8rem)] font-bold text-[#e61f83]">
              Business Location
            </h2>
            <p className="mx-auto mt-4 max-w-[22rem] text-center text-[0.92rem] leading-[1.65] text-[#555]">
              We have dedicated office spaces in both Quezon City and Tagaytay,
              designed for comfortable consultation.
            </p>

            <div className="mt-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f5]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <defs>
                      <linearGradient id="pinGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e61f83" />
                        <stop offset="100%" stopColor="#501f5a" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinGrad1)" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <span className="text-[1rem] font-bold text-[#501f5a]">Quezon City Branch</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f5]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinGrad1)" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <span className="text-[1rem] font-bold text-[#501f5a]">Tagaytay Branch</span>
              </div>
            </div>
          </div>

          {/* Contact Information card */}
          <div className="w-full rounded-2xl bg-white p-10 shadow-xl md:w-1/2">
            <h2 className="text-center font-heading text-[clamp(1.4rem,2.5vw,1.8rem)] font-bold text-[#e61f83]">
              Contact Information
            </h2>
            <p className="mx-auto mt-4 max-w-[22rem] text-center text-[0.92rem] leading-[1.65] text-[#555]">
              We have dedicated office spaces in both Quezon City and Tagaytay,
              designed for comfortable consultation.
            </p>

            <div className="mt-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f5]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <defs>
                      <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e61f83" />
                        <stop offset="100%" stopColor="#501f5a" />
                      </linearGradient>
                    </defs>
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" fill="url(#phoneGrad)" />
                  </svg>
                </div>
                <div>
                  <p className="text-[1rem] font-bold text-[#501f5a]">0933 380 7868</p>
                  <p className="text-[1rem] font-bold text-[#501f5a]">0917 502 3538</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f5]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <defs>
                      <linearGradient id="fbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e61f83" />
                        <stop offset="100%" stopColor="#501f5a" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#fbGrad)" />
                    <path d="M15.5 8H14c-.83 0-1 .37-1 .92V10h2.5l-.5 2.5H13V19h-3v-6.5H8V10h2V8.5C10 6.57 11.07 5 13.5 5H15.5v3z" fill="white" />
                  </svg>
                </div>
                <span className="text-[1rem] font-bold text-[#501f5a]">@schatziesevents</span>
              </div>
            </div>
          </div>

        </div>

        {/* Logo Footer */}
        <div className="mt-16 flex justify-center">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events logo"
            className="h-[110px] w-auto"
          />
        </div>
      </section>
    </div>
  );
}
