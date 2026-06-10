import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Images
const heroImage = '/Pictures/Services.png';
const textureImage = '/Pictures/texture.jpg';
const aboutImage = '/Pictures/about-section.jpg';
const teamImage = '/Pictures/team1.png';

export default function AboutUsPage() {
  return (
    <>
      <LoadingScreen />

      {/* ── Section 1: Hero ── */}
      <ScrollReveal>
        <section
          className="relative -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[60vh] lg:-mt-[173px] lg:min-h-[85vh]"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Overall white overlay to lighten the whole image */}
          <div className="absolute inset-0 bg-white/40" />

          {/* Stronger white wash at the top behind navbar */}
          <div className="absolute top-0 left-0 right-0 h-[200px] sm:h-[260px] lg:h-[320px] bg-gradient-to-b from-white via-white/80 to-transparent z-[5]" />

          {/* Content centered with spacing to start below navbar */}
          <div className="relative z-10 flex flex-col items-center px-4 pt-[180px] pb-[160px] text-center sm:px-6 sm:pt-[240px] sm:pb-[200px] lg:pt-[320px] lg:pb-[240px] animate-fade-in-up">
            <h1
              className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight bg-gradient-to-r text-transparent bg-clip-text animate-fade-in drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Years of Turning
              <br />
              Dreams into Milestones.
            </h1>

            <p className="mt-4 max-w-[40rem] text-[clamp(0.9rem,1.5vw,1.2rem)] leading-[1.7] text-black font-medium sm:mt-6 lg:max-w-[50rem] lg:text-[1.3rem] animate-slide-in-left animation-delay-400 font-['Montserrat',sans-serif]">
              At Schatzies Events PH, we believe you should be a guest at your own celebration.
              Since 2011, we've been the trusted partner for families and couples across the
              Philippines and beyond.
            </p>
          </div>

          {/* White wave at bottom transitioning to About Us section */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 transform translate-y-[1px]">
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

        {/* ── Section 2: About Us Split ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-20 lg:py-24">
          <div className="mx-auto flex max-w-[80rem] flex-col items-center gap-12 sm:max-w-[85rem] sm:gap-16 lg:max-w-[90rem] lg:flex-row lg:gap-24">
            {/* Left column — text */}
            <div className="flex-1 lg:max-w-[50%]">
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#FF0066] drop-shadow-sm">
                About Us
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.8] text-justify font-['Montserrat',sans-serif] text-black lg:mt-8">
                Known for our complete and affordable packages, our goal is simple: simplicity. From
                venue styling to full program coordination, we work closely with you to ensure your
                event runs flawlessly.
              </p>
            </div>

            {/* Right column — image */}
            <div className="w-full flex-1 relative mt-10 lg:mt-0">
              {/* Pink glow / drop shadow */}
              <div className="absolute -inset-1 rounded-xl bg-[#FF0066]/20 blur-xl" />
              <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-xl">
                <img 
                  src={aboutImage} 
                  alt="Schatzies Events venue setup"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Why Choose Schatzies ── */}
        <div className="relative z-10 mt-10 lg:mt-16">
          {/* Textured SVG Wave at the top — sweeps into the white section */}
          <div className="relative w-full overflow-hidden leading-[0] z-20">
            <svg
              className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="satin-wave-pattern" patternUnits="userSpaceOnUse" width="1440" height="120">
                  <image href={textureImage} x="0" y="0" width="1440" height="120" preserveAspectRatio="none" />
                </pattern>
              </defs>
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="url(#satin-wave-pattern)"
              />
              <path
                d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
                fill="black"
                fillOpacity="0.4"
              />
            </svg>
          </div>

          <section
            className="relative overflow-hidden bg-cover bg-center bg-no-repeat pb-24 pt-10 sm:pb-32 lg:pb-40"
            style={{ backgroundImage: `url(${textureImage})` }}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[80rem] px-4 sm:max-w-[85rem] sm:px-6 lg:max-w-[90rem] lg:px-20">
              {/* Heading block */}
              <div className="mb-12 sm:mb-16">
                <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#FF0066] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Why Choose Schatzies?
                </h2>
                <p className="mt-4 max-w-[50rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] font-['Montserrat',sans-serif] text-gray-200 sm:mt-5 lg:mt-6 lg:text-[1.25rem]">
                  With over 17 years of expertise, we turn complex logistics into seamless celebrations.
                  As your reliable on-the-ground partner, we handle the details so you can simply stay
                  in the moment.
                </p>
              </div>

              {/* Feature grid — 4 columns */}
              <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-20 lg:grid-cols-4 lg:gap-x-10">
                {/* Card 1 — 17+ Years of Expertise */}
                <div className="group relative flex flex-col items-center bg-white rounded-2xl px-6 pb-8 pt-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#FF0066]" fill="none">
                      <path d="M16 32v28l16-8 16 8V32" fill="currentColor" />
                      <circle cx="32" cy="24" r="24" fill="currentColor" />
                      <path d="M32 10l3.5 10.5h11l-9 6.5 3.5 10.5-9-6.5-9 6.5 3.5-10.5-9-6.5h11z" fill="white" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-[#FF0066] sm:text-[1.2rem]">
                    17+ Years of Expertise
                  </h3>
                  <p className="mt-3 text-[0.85rem] leading-[1.6] text-black sm:text-[0.9rem] font-['Montserrat',sans-serif]">
                    A decade and a half of helping many clients turn special occasions into perfectly
                    managed, memorable events.
                  </p>
                </div>

                {/* Card 2 — The Local's Choice */}
                <div className="group relative flex flex-col items-center bg-white rounded-2xl px-6 pb-8 pt-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 mt-4 sm:mt-0">
                  <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#FF0066]" fill="none">
                      <circle cx="32" cy="32" r="30" fill="currentColor" />
                      <ellipse cx="32" cy="32" rx="14" ry="30" stroke="white" strokeWidth="3" />
                      <path d="M2 32h60M8 18h48M8 46h48" stroke="white" strokeWidth="3" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-[#FF0066] sm:text-[1.2rem]">
                    The Local's Choice
                  </h3>
                  <p className="mt-3 text-[0.85rem] leading-[1.6] text-black sm:text-[0.9rem] font-['Montserrat',sans-serif]">
                    Your trusted partner right here in the Philippines. We handle every detail of your
                    local celebration so you can focus on enjoying your special day with loved ones.
                  </p>
                </div>

                {/* Card 3 — All-Inclusive Ease */}
                <div className="group relative flex flex-col items-center bg-white rounded-2xl px-6 pb-8 pt-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 mt-4 lg:mt-0">
                  <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#FF0066]" fill="none">
                      {/* Left person */}
                      <circle cx="16" cy="20" r="10" fill="currentColor" />
                      <path d="M4 56c0-12 5-18 12-18h8v18H4z" fill="currentColor" />
                      {/* Right person */}
                      <circle cx="48" cy="20" r="10" fill="currentColor" />
                      <path d="M40 38h8c7 0 12 6 12 18H40V38z" fill="currentColor" />
                      {/* Middle person (overlaps) */}
                      <circle cx="32" cy="24" r="12" fill="currentColor" stroke="white" strokeWidth="2" />
                      <path d="M16 56c0-14 6-20 16-20s16 6 16 20H16z" fill="currentColor" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-[#FF0066] sm:text-[1.2rem]">
                    All-Inclusive Ease
                  </h3>
                  <p className="mt-3 text-[0.85rem] leading-[1.6] text-black sm:text-[0.9rem] font-['Montserrat',sans-serif]">
                    Complete event packages that handle everything—from elegant venue styling and
                    buffet catering to professional photo and video coverage.
                  </p>
                </div>

                {/* Card 4 — Budget-Friendly Luxury */}
                <div className="group relative flex flex-col items-center bg-white rounded-2xl px-6 pb-8 pt-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 mt-4 lg:mt-0">
                  <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#FF0066]" fill="none">
                      <circle cx="32" cy="32" r="30" fill="currentColor" />
                      <path d="M32 14v36M24 24c0-4 6-4 8-4s8 4 8 8c0 6-16 6-16 12s2 8 8 8c6 0 8-4 8-4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-[#FF0066] sm:text-[1.2rem]">
                    Budget-Friendly Luxury
                  </h3>
                  <p className="mt-3 text-[0.85rem] leading-[1.6] text-black sm:text-[0.9rem] font-['Montserrat',sans-serif]">
                    Expertly managing the details so you can focus on the moment. We specialize in
                    all-inclusive event solutions that are both affordable and adaptable.
                  </p>
                </div>
              </div>
            </div>

            {/* White wave at bottom transitioning to Meet our Team */}
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
        </div>

        {/* ── Section 4: Meet our Team ── */}
        <section className="bg-white px-4 pb-24 sm:px-6 sm:pb-32 lg:px-20 lg:pb-40">
          <div className="mx-auto max-w-[80rem] sm:max-w-[85rem] lg:max-w-[90rem]">
            {/* Heading block */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#FF0066] drop-shadow-sm">
                Meet our Team
              </h2>
              <p className="mt-3 text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] font-['Montserrat',sans-serif] text-gray-700">
                The Experts Behind Your Seamless Events
              </p>
            </div>

            {/* Team Grid - Centered like iOS design */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-16 sm:gap-24 lg:gap-32">
              {/* Member 1 */}
              <div className="relative w-full max-w-[340px] pt-[140px]">
                {/* The Box */}
                <div className="relative rounded-[2.5rem] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] hover:-translate-y-2 overflow-visible">
                  {/* The Image overflowing top */}
                  <img 
                    src={teamImage} 
                    alt="Juana Dela Cruz" 
                    className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-[320px] h-[400px] object-cover object-top z-10 pointer-events-none drop-shadow-lg"
                  />
                  
                  <div className="h-[240px]" /> {/* Spacer for body */}

                  {/* Footer Name Plate */}
                  <div className="relative z-20 w-full bg-black py-7 text-center rounded-b-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                    <h3 className="text-[#FF0066] font-bold text-[1.4rem] tracking-wide">Juana Dela Cruz</h3>
                    <p className="text-gray-300 text-[0.95rem] mt-1 font-['Montserrat',sans-serif]">President</p>
                  </div>
                </div>
              </div>

              {/* Member 2 */}
              <div className="relative w-full max-w-[340px] pt-[140px]">
                {/* The Box */}
                <div className="relative rounded-[2.5rem] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] hover:-translate-y-2 overflow-visible">
                  {/* The Image overflowing top */}
                  <img 
                    src={teamImage} 
                    alt="Juan Dela Cruz" 
                    className="absolute bottom-[90px] left-1/2 -translate-x-1/2 w-[320px] h-[400px] object-cover object-top z-10 pointer-events-none drop-shadow-lg"
                  />
                  
                  <div className="h-[240px]" /> {/* Spacer for body */}

                  {/* Footer Name Plate */}
                  <div className="relative z-20 w-full bg-black py-7 text-center rounded-b-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                    <h3 className="text-[#FF0066] font-bold text-[1.4rem] tracking-wide">Juan Dela Cruz</h3>
                    <p className="text-gray-300 text-[0.95rem] mt-1 font-['Montserrat',sans-serif]">Vice-President</p>
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
