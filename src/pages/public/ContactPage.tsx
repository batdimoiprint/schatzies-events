// Replace with your actual Contact hero photo placed in public/Pictures/
const heroImage = '/Pictures/contact-hero.jpg';

import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactPage() {
  return (
    <>
      <LoadingScreen />
      {/* ── Hero Section ── */}
      <ScrollReveal>
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

          {/* Centered hero text */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12 text-center sm:px-6 sm:pb-16 lg:pb-[173px] animate-fade-in-up">
            <h1
              className="font-heading text-[clamp(2rem,8vw,5rem)] font-bold leading-tight bg-gradient-to-r text-transparent bg-clip-text animate-fade-in"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Contact Us
            </h1>
            <p className="mt-3 max-w-[40rem] text-[clamp(0.9rem,1.8vw,1.3rem)] leading-[1.7] font-sans text-black drop-shadow-lg sm:mt-4 sm:max-w-[45rem] lg:mt-6 lg:max-w-[50rem] lg:text-[1.4rem] animate-slide-in-left animation-delay-200">
              Whether you have an event type in mind or just want to explore the possibilities, our
              team is ready to listen.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Bottom section with overlapping cards ── */}
      <ScrollReveal>
        <section className="bg-gradient-to-b from-white via-[#fce4ef] to-[#f9b8d4] pb-12 sm:pb-20 lg:pb-28">
          {/* Cards container — negative top margin pulls into hero */}
          <div className="relative z-10 mx-auto -mt-12 flex max-w-[80rem] flex-col gap-5 px-4 sm:-mt-24 sm:max-w-[85rem] sm:gap-8 sm:px-6 md:flex-row lg:-mt-32 lg:max-w-[90rem] lg:gap-10 lg:px-20">
            {/* Business Location card */}
            <div className="w-full rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl sm:rounded-2xl sm:p-8 md:w-1/2 lg:rounded-3xl lg:p-10">
              <h2 className="text-center font-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold text-[#FF0066]">
                Business Location
              </h2>
              <p className="mx-auto mt-3 max-w-[25rem] text-center text-[clamp(0.85rem,1.3vw,1rem)] leading-[1.6] font-sans text-[#4A1053] sm:mt-4">
                We have dedicated office spaces in both Quezon City and Tagaytay, designed for
                comfortable consultation.
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 lg:mt-10">
                {/* QC Branch */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      fill="none"
                    >
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
                    <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                      Quezon City Branch
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      27, Novaliches, Mendoza Village, Project 8, Quezon City, Metro Manila
                    </p>
                  </div>{' '}
                  {/* closes inner flex container */}
                </div>{' '}
                {/* closes Contact Information card */}
                {/* Tagaytay Branch */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      fill="none"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill="url(#pinGrad1)"
                      />
                      <circle cx="12" cy="9" r="2.5" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                      Tagaytay Branch
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      Ministop bldg Marasigan st Tagaytay Nasugbu High way Brgy. Mendez, Tagaytay
                      City, 4120 Cavite
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information card */}
            <div className="w-full rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl sm:rounded-2xl sm:p-8 md:w-1/2 lg:rounded-3xl lg:p-10">
              <h2 className="text-center font-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold text-[#FF0066]">
                Contact Information
              </h2>
              <p className="mx-auto mt-3 max-w-[25rem] text-center text-[clamp(0.85rem,1.3vw,1rem)] leading-[1.6] font-sans text-[#4A1053] sm:mt-4">
                Reach out to us through any of these channels and let's start planning your dream
                event.
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 lg:mt-10">
                {/* Phone Numbers */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      fill="none"
                    >
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
                    <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                      Phone Numbers
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      0933 380 7868
                    </p>
                    <p className="text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      0917 502 3538
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      fill="none"
                    >
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
                    <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                      Email
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      schatziesevents@gmail.com
                    </p>
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                      fill="none"
                    >
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
                    <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                      Facebook
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                      Schatzies Events PH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
