// Replace with your actual services hero photo placed in public/Pictures/
const heroImage = '/Pictures/services-hero.jpg';

/* ── Gradient icon components ───────────────────────────────── */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Left pin */}
      <rect x="15" y="2" width="7" height="16" rx="3.5" fill="url(#calGrad)" />
      {/* Right pin */}
      <rect x="42" y="2" width="7" height="16" rx="3.5" fill="url(#calGrad)" />
      {/* Calendar body */}
      <rect x="4" y="10" width="56" height="52" rx="7" fill="url(#calGrad)" />
      {/* White inner area */}
      <rect x="9" y="27" width="46" height="30" rx="4" fill="white" />
      {/* Center dot */}
      <circle cx="32" cy="42" r="6" fill="url(#calGrad)" />
    </svg>
  );
}

function VenueIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="venueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Back card (rotated) */}
      <rect
        x="6"
        y="14"
        width="40"
        height="46"
        rx="6"
        fill="url(#venueGrad)"
        opacity="0.45"
        transform="rotate(-18 26 37)"
      />
      {/* Front card */}
      <rect x="18" y="8" width="40" height="48" rx="6" fill="url(#venueGrad)" />
      {/* Card dot */}
      <circle cx="30" cy="22" r="5" fill="white" opacity="0.85" />
    </svg>
  );
}

function CateringIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Fork - left tine */}
      <rect x="14" y="4" width="4" height="18" rx="2" fill="url(#catGrad)" />
      {/* Fork - center tine */}
      <rect x="21" y="4" width="4" height="18" rx="2" fill="url(#catGrad)" />
      {/* Fork - right tine */}
      <rect x="28" y="4" width="4" height="18" rx="2" fill="url(#catGrad)" />
      {/* Fork - bridge */}
      <rect x="14" y="20" width="18" height="5" rx="2" fill="url(#catGrad)" />
      {/* Fork - handle */}
      <rect x="19" y="24" width="8" height="36" rx="4" fill="url(#catGrad)" />
      {/* Knife - blade */}
      <path d="M44 4 C54 4 56 14 50 26 L46 26 Z" fill="url(#catGrad)" />
      {/* Knife - handle */}
      <rect x="44" y="26" width="8" height="34" rx="4" fill="url(#catGrad)" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="camGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Camera body */}
      <rect x="4" y="20" width="50" height="36" rx="7" fill="url(#camGrad)" />
      {/* Viewfinder bump */}
      <rect x="20" y="14" width="18" height="10" rx="4" fill="url(#camGrad)" />
      {/* Lens ring */}
      <circle cx="29" cy="38" r="12" fill="white" opacity="0.25" />
      {/* Lens */}
      <circle cx="29" cy="38" r="8" fill="white" opacity="0.55" />
      {/* Sparkle top-right */}
      <path d="M52 10 L54 16 L60 18 L54 20 L52 26 L50 20 L44 18 L50 16 Z" fill="url(#camGrad)" />
    </svg>
  );
}

function CeilingIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ceilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Top bar */}
      <rect x="4" y="4" width="56" height="10" rx="4" fill="url(#ceilGrad)" />
      {/* Left light housing */}
      <rect x="8" y="14" width="14" height="10" rx="3" fill="url(#ceilGrad)" />
      <ellipse cx="15" cy="30" rx="9" ry="6" fill="url(#ceilGrad)" />
      <circle cx="15" cy="30" r="4" fill="white" opacity="0.4" />
      {/* Center light housing */}
      <rect x="25" y="14" width="14" height="10" rx="3" fill="url(#ceilGrad)" />
      <ellipse cx="32" cy="30" rx="9" ry="6" fill="url(#ceilGrad)" />
      <circle cx="32" cy="30" r="4" fill="white" opacity="0.4" />
      {/* Right light housing */}
      <rect x="42" y="14" width="14" height="10" rx="3" fill="url(#ceilGrad)" />
      <ellipse cx="49" cy="30" rx="9" ry="6" fill="url(#ceilGrad)" />
      <circle cx="49" cy="30" r="4" fill="white" opacity="0.4" />
      {/* Light beams */}
      <path d="M10 36 L4 58 L20 58 Z" fill="url(#ceilGrad)" opacity="0.35" />
      <path d="M27 36 L21 58 L37 58 Z" fill="url(#ceilGrad)" opacity="0.35" />
      <path d="M44 36 L38 58 L54 58 Z" fill="url(#ceilGrad)" opacity="0.35" />
    </svg>
  );
}

function CoordinationIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coordGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e61f83" />
          <stop offset="100%" stopColor="#501f5a" />
        </linearGradient>
      </defs>
      {/* Center person head */}
      <circle cx="32" cy="10" r="7" fill="url(#coordGrad)" />
      {/* Left person head */}
      <circle cx="12" cy="18" r="6" fill="url(#coordGrad)" />
      {/* Right person head */}
      <circle cx="52" cy="18" r="6" fill="url(#coordGrad)" />
      {/* Gear / connector ring */}
      <circle cx="32" cy="38" r="16" fill="url(#coordGrad)" />
      <circle cx="32" cy="38" r="8" fill="white" opacity="0.3" />
      {/* Gear teeth */}
      <rect x="29" y="20" width="6" height="6" rx="2" fill="url(#coordGrad)" />
      <rect x="29" y="50" width="6" height="6" rx="2" fill="url(#coordGrad)" />
      <rect x="48" y="35" width="6" height="6" rx="2" fill="url(#coordGrad)" />
      <rect x="10" y="35" width="6" height="6" rx="2" fill="url(#coordGrad)" />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section
        className="relative -mt-[173px] flex min-h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient overlay from #FF589C to #FD78AD */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF589C]/80 via-[#FD78AD]/60 to-transparent" />

        {/* Additional white overlay for brightness */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />

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
            Your Perfect Event
            <br />
            Starts Here
          </h1>

          <p className="mt-8 max-w-[50rem] text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.75] font-sans text-white drop-shadow-lg">
            From planning to execution, we offer everything you need to bring your dream event to
            life.
          </p>
        </div>
      </section>
      {/* ── Section 2: Services Offered ── */}
      <section className="bg-white pt-24 lg:pt-32">
        {/* Heading */}
        <div className="px-6 text-center">
          <h2
            className="font-heading text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[1.1] tracking-tight bg-gradient-to-r text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
            }}
          >
            Services Offered
          </h2>
          <p className="mx-auto mt-6 max-w-[52rem] text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.7] font-sans text-[#4A1053]">
            Schatzies Events offers complete event packages that include all the essential services
            for weddings and debut celebrations.
          </p>
        </div>

        {/* Service rows — full-bleed backgrounds, centred inner content */}
        <div className="mt-20 w-full">
          {/* ── Row 1 (LEFT): icon LEFT · text RIGHT ── */}
          <div className="w-full bg-[#fdf2f6] py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <CalendarIcon />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Event Planning and Coordination
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  Assistance in organizing and managing your event from preparation to the actual
                  day.
                </p>
              </div>
            </div>
          </div>

          {/* Divider with brand colors */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF0066]/50 to-transparent" />

          {/* ── Row 2 (RIGHT): text LEFT · icon RIGHT ── */}
          <div className="w-full bg-white py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="text-left flex-1">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Elegant Venue Setup and Styling
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  Beautiful decorations and designs tailored to match your event's theme and style.
                </p>
              </div>
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <VenueIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF0066]/50 to-transparent" />

          {/* ── Row 3 (LEFT): icon LEFT · text RIGHT ── */}
          <div className="w-full bg-[#fdf2f6] py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <CateringIcon />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Buffet Catering
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  Food prepared and served for guests to enjoy during the event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: More Services + Logo Footer ── */}
      <section className="bg-gradient-to-b from-white via-[#fce4ef] to-[#f9b8d4] pb-28 lg:pb-36">
        {/* Service rows — alternating left/right pattern */}
        <div className="w-full">
          {/* ── Row 1 (RIGHT): text LEFT · icon RIGHT ── */}
          <div className="w-full py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="text-left flex-1">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Photo and Video Coverage
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  Professional coverage that beautifully captures every special moment of your
                  event.
                </p>
              </div>
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <CameraIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Divider with brand colors */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF0066]/50 to-transparent" />

          {/* ── Row 2 (LEFT): icon LEFT · text RIGHT ── */}
          <div className="w-full py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <CeilingIcon />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Ceiling Treatment and Venue Design
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  Decorative ceiling setups that enhance the beauty and overall style of your venue.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF0066]/50 to-transparent" />

          {/* ── Row 3 (RIGHT): text LEFT · icon RIGHT ── */}
          <div className="w-full py-24 lg:py-32">
            <div className="mx-auto flex max-w-[1100px] flex-row items-center gap-20 px-10">
              <div className="text-left flex-1">
                <h3 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#FF0066]">
                  Full Event Coordination
                </h3>
                <p className="mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.7] text-[#4A1053] max-w-[600px]">
                  A dedicated team that manages the program flow and ensures your event runs
                  smoothly from start to finish.
                </p>
              </div>
              <div className="shrink-0 transform transition-transform duration-300 hover:scale-110">
                <div className="h-[90px] w-[90px] text-[#FF0066]">
                  <CoordinationIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo footer - larger */}
        <div className="mt-16 flex justify-center">
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
