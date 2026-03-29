// Replace with your actual Contact hero photo placed in public/Pictures/
const heroImage = '/Pictures/contact-hero.jpg';

export default function ContactPage() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative -mt-[173px] flex min-h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient overlay from bottom - #FF589C 0% to #FD78AD 58% */}

        {/* Additional white overlay for brightness at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />

        {/* Subtle dark overlay for text readability at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Spacer that matches navbar height */}
        <div className="h-[173px] shrink-0" />

        {/* Centered hero text */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-[173px] text-center">
          <h1
            className="font-heading text-[clamp(4rem,10vw,8rem)] font-bold leading-tight bg-gradient-to-r text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
            }}
          >
            Contact Us
          </h1>
          <p className="mt-8 max-w-[50rem] text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.75] font-sans text-black drop-shadow-lg">
            Whether you have an event type in mind or just want to explore the possibilities, our
            team is ready to listen.
          </p>
        </div>
      </section>

      {/* ── Bottom gradient section with overlapping cards ── */}
      <section className="bg-gradient-to-b from-white via-[#fce4ef] to-[#f9b8d4] pb-28 lg:pb-36">
        {/* Cards container — negative top margin pulls into hero */}
        <div className="relative z-10 mx-auto -mt-40 flex max-w-[90rem] flex-col gap-10 px-6 md:flex-row lg:px-20">
          {/* Business Location card */}
          <div className="w-full rounded-3xl bg-white p-12 shadow-xl transition-all duration-300 hover:shadow-2xl md:w-1/2">
            <h2 className="text-center font-heading text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
              Business Location
            </h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-center text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] font-sans text-[#4A1053]">
              We have dedicated office spaces in both Quezon City and Tagaytay, designed for
              comfortable consultation.
            </p>

            <div className="mt-12 flex flex-col gap-8">
              {/* QC Branch */}
              <div className="flex items-center gap-6">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
                    <defs>
                      <linearGradient id="pinGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="url(#pinGrad1)"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div>
                  <p className="text-[1.3rem] font-bold text-[#FF0066]">Quezon City Branch</p>
                  <p className="mt-1 text-[1rem] text-[#4A1053]">123 QC Avenue, Quezon City</p>
                </div>
              </div>

              {/* Tagaytay Branch */}
              <div className="flex items-center gap-6">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="url(#pinGrad1)"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div>
                  <p className="text-[1.3rem] font-bold text-[#FF0066]">Tagaytay Branch</p>
                  <p className="mt-1 text-[1rem] text-[#4A1053]">
                    456 Tagaytay Ridge, Tagaytay City
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information card */}
          <div className="w-full rounded-3xl bg-white p-12 shadow-xl transition-all duration-300 hover:shadow-2xl md:w-1/2">
            <h2 className="text-center font-heading text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
              Contact Information
            </h2>
            <p className="mx-auto mt-4 max-w-[28rem] text-center text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] font-sans text-[#4A1053]">
              Reach out to us through any of these channels and let's start planning your dream
              event.
            </p>

            <div className="mt-12 flex flex-col gap-8">
              {/* Phone Numbers */}
              <div className="flex items-center gap-6">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
                    <defs>
                      <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
                      fill="url(#phoneGrad)"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[1.3rem] font-bold text-[#FF0066]">Phone Numbers</p>
                  <p className="mt-1 text-[1rem] text-[#4A1053]">0933 380 7868</p>
                  <p className="text-[1rem] text-[#4A1053]">0917 502 3538</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-6">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
                    <defs>
                      <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#emailGrad)" />
                    <path d="M22 7L12 13L2 7" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <div>
                  <p className="text-[1.3rem] font-bold text-[#FF0066]">Email</p>
                  <p className="mt-1 text-[1rem] text-[#4A1053]">info@schatziesevents.com</p>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-6">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
                    <defs>
                      <linearGradient id="fbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#fbGrad)" />
                    <path
                      d="M15.5 8H14c-.83 0-1 .37-1 .92V10h2.5l-.5 2.5H13V19h-3v-6.5H8V10h2V8.5C10 6.57 11.07 5 13.5 5H15.5v3z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[1.3rem] font-bold text-[#FF0066]">Facebook</p>
                  <p className="mt-1 text-[1rem] text-[#4A1053]">@schatziesevents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Footer - larger */}
        <div className="mt-20 flex justify-center">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events logo"
            className="h-[140px] w-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
      </section>
    </div>
  );
}
