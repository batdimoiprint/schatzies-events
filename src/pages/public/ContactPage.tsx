// Replace with your actual Contact hero photo placed in public/Pictures/
const heroImage = '/Pictures/contact-hero.jpg';
const textureImage = '/Pictures/texture.jpg';

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
          {/* Overall white overlay to lighten the whole image */}
          <div className="absolute inset-0 bg-white/40" />

          {/* Stronger white wash at the top behind navbar */}
          <div className="absolute top-0 left-0 right-0 h-[200px] sm:h-[260px] lg:h-[320px] bg-gradient-to-b from-white via-white/80 to-transparent z-[5]" />

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

        {/* ── Get in Touch Section ── */}
        <section 
          className="relative py-12 sm:py-20 lg:py-28 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/Pictures/texture.jpg)' }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-white/95" />
          
          <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-20">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[#FF0066] mb-3 sm:mb-4">
                Get in touch
              </h2>
              <p className="mx-auto max-w-[45rem] text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.6] text-[#4A1053]">
                Reach out to us through any of these channels and let's start planning your dream event.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 lg:gap-10">
              {/* Phone Card */}
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-[#FFB6D9]/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="phoneGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
                      fill="url(#phoneGrad2)"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-[1.1rem] sm:text-[1.2rem] font-bold text-[#FF0066] text-center">
                  Phone Number
                </h3>
                <p className="mt-3 text-center text-[0.85rem] sm:text-[0.9rem] text-[#4A1053] space-y-1.5">
                  <a
                    href="tel:+639333807868"
                    className="block hover:text-[#FF0066] transition-colors"
                  >
                    +63 933 380 7868
                  </a>
                  <a
                    href="tel:+639175023538"
                    className="block hover:text-[#FF0066] transition-colors"
                  >
                    +63 917 502 3538
                  </a>
                </p>
              </div>

              {/* Facebook Card */}
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-[#FFB6D9]/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="fbGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#fbGrad2)" />
                    <path
                      d="M15.5 8H14c-.83 0-1 .37-1 .92V10h2.5l-.5 2.5H13V19h-3v-6.5H8V10h2V8.5C10 6.57 11.07 5 13.5 5H15.5v3z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-[1.1rem] sm:text-[1.2rem] font-bold text-[#FF0066] text-center">
                  Facebook
                </h3>
                <a
                  href="https://www.facebook.com/debutandweddingpackage"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-center text-[0.85rem] sm:text-[0.9rem] text-[#4A1053] hover:text-[#FF0066] transition-colors"
                >
                  Schatzies Events PH
                </a>
              </div>

              {/* Email Card */}
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-[#FFB6D9]/30 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="emailGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF0066" />
                        <stop offset="100%" stopColor="#4A1053" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#emailGrad2)" />
                    <path d="M22 7L12 13L2 7" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <h3 className="font-heading text-[1.1rem] sm:text-[1.2rem] font-bold text-[#FF0066] text-center">
                  Email
                </h3>
                <a
                  href="mailto:schatziesevents@gmail.com"
                  className="mt-3 text-center text-[0.85rem] sm:text-[0.9rem] text-[#4A1053] hover:text-[#FF0066] transition-colors"
                >
                  schatziesevents@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <svg
            className="absolute bottom-0 left-0 w-full h-auto"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 Q300,80 600,30 T1200,30 L1200,120 L0,120 Z"
              fill="#000000"
            />
          </svg>
        </section>

        {/* ── Visit Our Office Section Header ── */}
        <section 
          className="relative py-8 sm:py-12 lg:py-16 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${textureImage})` }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-20 text-center">
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[#FF0066] mb-3 sm:mb-4">
              Visit Our Office
            </h2>
            <p className="mx-auto max-w-[45rem] text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.6] text-white">
              We have dedicated office spaces in both Quezon City and Tagaytay, designed for comfortable consultation.
            </p>
          </div>
        </section>

        {/* ── Map Section ── */}
        <section
          className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/map.png)' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Location Cards */}
          <div className="relative z-10 flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] px-4 py-12 sm:py-20 lg:py-28">
            <div className="w-full max-w-[90rem] mx-auto">
              <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
                <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
                  {/* QC Location Card */}
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#FF0066]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        fill="white"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" fill="#000" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] sm:text-[1.15rem] lg:text-[1.2rem] font-bold text-[#FF0066]">
                        Quezon City Branch
                      </h3>
                      <p className="mt-2 text-[0.8rem] sm:text-[0.85rem] lg:text-[0.9rem] text-[#4A1053] leading-[1.6]">
                        27, Novaliches, Mendoza Village, Project 8, Quezon City, Metro Manila
                      </p>
                    </div>
                  </div>

                  {/* Tagaytay Location Card */}
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#FF0066]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        fill="white"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" fill="#000" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] sm:text-[1.15rem] lg:text-[1.2rem] font-bold text-[#FF0066]">
                        Tagaytay Branch
                      </h3>
                      <p className="mt-2 text-[0.8rem] sm:text-[0.85rem] lg:text-[0.9rem] text-[#4A1053] leading-[1.6]">
                        Ministop bldg Marasigan st Tagaytay Nasugbu High way Brgy. Mendez, Tagaytay City, 4120 Cavite
                      </p>
                    </div>
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
