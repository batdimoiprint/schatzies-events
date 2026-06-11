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
      <ScrollReveal variant="fade">
        <section
          className="relative -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Overall white overlay to lighten the whole image */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Stronger white wash at the top behind navbar */}
          <div className="absolute top-0 left-0 right-0 h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-b from-white via-white/70 via-white/30 to-transparent z-[5]" />

          {/* Content centered in middle of section */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-[160px] sm:py-[260px] md:py-[360px] lg:py-[420px] text-center sm:px-6 animate-fade-in-up">
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

          {/* Wave at bottom — textured dark wave into Get in Touch */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 transform translate-y-[1px]">
            <svg
              className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="contact-wave-tex"
                  patternUnits="userSpaceOnUse"
                  width="1440"
                  height="120"
                >
                  <image
                    href={textureImage}
                    x="0"
                    y="0"
                    width="1440"
                    height="120"
                    preserveAspectRatio="none"
                  />
                </pattern>
              </defs>
              <path
                d="M0,60 C320,130 720,10 1080,80 C1260,105 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="url(#contact-wave-tex)"
              />
              <path
                d="M0,60 C320,130 720,10 1080,80 C1260,105 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="black"
                fillOpacity="0.45"
              />
            </svg>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Get in Touch Header — Dark textured band ── */}
      <ScrollReveal variant="fade">
        <section
          className="relative py-10 sm:py-14 lg:py-18 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${textureImage})` }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-20 text-center">
            <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[#FF0066] mb-3 sm:mb-4">
              Get in touch
            </h2>
            <p className="mx-auto max-w-[45rem] text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.6] text-gray-200">
              Reach out to us through any of these channels and let's start planning your dream
              event.
            </p>
          </div>

          {/* White wave at bottom */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
            <svg
              className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="white"
              />
            </svg>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Contact Cards Section — White ── */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 lg:gap-10">
            {/* Phone Card */}
            <ScrollReveal variant="up" delay={0}>
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none">
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
            </ScrollReveal>

            {/* Facebook Card */}
            <ScrollReveal variant="up" delay={150}>
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none">
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
            </ScrollReveal>

            {/* Email Card */}
            <ScrollReveal variant="up" delay={300}>
              <div className="flex flex-col items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 mb-4 sm:mb-6">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-9 sm:w-9" fill="none">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Visit Our Office — Dark textured band with waves ── */}
      <ScrollReveal variant="up">
        <div className="relative z-10">
          {/* Textured wave at top */}
          <div className="relative w-full overflow-hidden leading-[0] z-20">
            <svg
              className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="office-wave-tex"
                  patternUnits="userSpaceOnUse"
                  width="1440"
                  height="120"
                >
                  <image
                    href={textureImage}
                    x="0"
                    y="0"
                    width="1440"
                    height="120"
                    preserveAspectRatio="none"
                  />
                </pattern>
              </defs>
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="url(#office-wave-tex)"
              />
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="black"
                fillOpacity="0.45"
              />
            </svg>
          </div>

          <section
            className="relative py-10 sm:py-14 lg:py-18 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${textureImage})` }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-20 text-center">
              <h2 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold text-[#FF0066] mb-3 sm:mb-4">
                Visit Our Office
              </h2>
              <p className="mx-auto max-w-[45rem] text-[clamp(0.9rem,1.5vw,1.1rem)] leading-[1.6] text-gray-200">
                We have dedicated office spaces in both Quezon City and Tagaytay, designed for
                comfortable consultation.
              </p>
            </div>

            {/* White wave at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
              <svg
                className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0,60 C320,130 720,10 1080,80 C1260,105 1380,95 1440,75 L1440,120 L0,120 Z"
                  fill="white"
                />
              </svg>
            </div>
          </section>
        </div>
      </ScrollReveal>

      {/* ── Map Section ── */}
      <ScrollReveal variant="scale">
        <section className="relative bg-white">
          <div
            className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] mx-4 sm:mx-6 lg:mx-20 rounded-2xl overflow-hidden shadow-xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/map.png)' }}
          >
            {/* Location Cards Overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-4 py-8 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl max-w-[600px] w-full pointer-events-auto">
                <div className="space-y-6 sm:space-y-8">
                  {/* QC Location */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FF0066]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="white">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" fill="#000" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] sm:text-[1.15rem] font-bold text-[#FF0066]">
                        Quezon City Branch
                      </h3>
                      <a
                        href="https://www.google.com/maps/search/27+Novaliches+Mendoza+Village+Project+8+Quezon+City"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 block text-[0.8rem] sm:text-[0.85rem] text-gray-600 leading-[1.6] hover:text-[#FF0066] transition-colors"
                      >
                        27, Novaliches, Mendoza Village, Project 8, Quezon City, Metro Manila
                      </a>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Tagaytay Location */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FF0066]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="white">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" fill="#000" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] sm:text-[1.15rem] font-bold text-[#FF0066]">
                        Tagaytay Branch
                      </h3>
                      <a
                        href="https://www.google.com/maps/search/Ministop+Marasigan+st+Tagaytay+Nasugbu+Highway+Brgy+Mendez+Tagaytay+City+Cavite"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 block text-[0.8rem] sm:text-[0.85rem] text-gray-600 leading-[1.6] hover:text-[#FF0066] transition-colors"
                      >
                        Ministop bldg Marasigan st Tagaytay Nasugbu High way Brgy. Mendez, Tagaytay
                        City, 4120 Cavite
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="h-16 sm:h-20 lg:h-24 bg-white" />
        </section>
      </ScrollReveal>
    </>
  );
}
