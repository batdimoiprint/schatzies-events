// Replace with your actual services hero photo placed in public/Pictures/
const heroImage = '/Pictures/Services.png';
const textureImage = '/Pictures/texture.jpg';

import { useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { GalleryModal } from '@/components/GalleryModal';

/* ── Gallery Data ──────────────────────────────────────────── */
const galleryData = [
  {
    id: 'event-planning',
    title: 'Event Planning & Coordination',
    folder: '_EventPics',
    images: ['EPC.jpg', 'EPC1.jpg', 'EPC2.jpg', 'EPC3.jpg', 'EPC4.jpg'],
  },
  {
    id: 'venue-styling',
    title: 'Elegant Venue Setup & Styling',
    folder: '_EventPics',
    images: ['V.jpg', 'V2.jpg', 'V3.jpg', 'V4.jpg', 'V5.jpg'],
  },
  {
    id: 'catering',
    title: 'Buffet Catering',
    folder: '_EventPics',
    images: ['BnC.jpg', 'BnC2.jpg', 'BnC3.jpg', 'BnC4.jpg', 'BnC5.jpg'],
  },
  {
    id: 'photo-video',
    title: 'Photo & Video Coverage',
    folder: '_EventPics',
    images: ['PC.jpg', 'PC2.jpg', 'PC3.jpg', 'PC4.jpg', 'PC5.jpg'],
  },
  {
    id: 'ceiling-design',
    title: 'Ceiling Treatment & Venue Design',
    folder: '_EventPics',
    images: ['C1.jpg', 'C2.jpg', 'C3.jpg', 'C4.jpg', 'C5.jpg'],
  },
  {
    id: 'full-coordination',
    title: 'Full Event Coordination',
    folder: '_EventPics',
    images: ['FEC.jpg', 'FEC1.jpg', 'FEC2.jpg', 'FEC3.jpg', 'FEC4.jpg'],
  },
];

/* ── Gradient icon components ───────────────────────────────── */
function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="venueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="camGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ceilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="coordGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="100%" stopColor="#4A1053" />
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

/* ── Service card data ─────────────────────────────────────── */
const services = [
  {
    Icon: CalendarIcon,
    id: 'event-planning',
    title: 'Event Planning and Coordination',
    description:
      'Assistance in organizing and managing your event from preparation to the actual day.',
  },
  {
    Icon: VenueIcon,
    id: 'venue-styling',
    title: 'Elegant Venue Setup and Styling',
    description:
      "Beautiful decorations and designs tailored to match your event's theme and style.",
  },
  {
    Icon: CateringIcon,
    id: 'catering',
    title: 'Buffet Catering',
    description: 'Food prepared and served for guests to enjoy during the event.',
  },
  {
    Icon: CameraIcon,
    id: 'photo-video',
    title: 'Photo and Video Coverage',
    description:
      'Professional coverage that beautifully captures every special moment of your event.',
  },
  {
    Icon: CeilingIcon,
    id: 'ceiling-design',
    title: 'Ceiling Treatment and Venue Design',
    description:
      'Decorative ceiling setups that enhance the beauty and overall style of your venue.',
  },
  {
    Icon: CoordinationIcon,
    id: 'full-coordination',
    title: 'Full Event Coordination',
    description:
      'A dedicated team that manages the program flow and ensures your event runs smoothly from start to finish.',
  },
];

export default function ServicesPage() {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);

  const gallery = galleryData.find((g) => g.id === activeGallery);
  const galleryImages = gallery
    ? gallery.images.map((img) => `/Pictures/${gallery.folder}/${img}`)
    : [];

  return (
    <>
      <LoadingScreen />

      {/* ── Section 1: Hero ── */}
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
              Your Perfect Event
              <br />
              Starts Here
            </h1>

            <p className="mt-3 max-w-[40rem] text-[clamp(0.9rem,1.8vw,1.3rem)] leading-[1.7] font-sans text-black font-medium sm:mt-4 sm:max-w-[45rem] lg:mt-6 lg:max-w-[50rem] lg:text-[1.4rem] animate-slide-in-left animation-delay-200">
              From planning to execution, we offer everything you need to bring your dream event to
              life.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Section 2: Services Offered (texture bg) ── */}
      <ScrollReveal variant="up">
        <div className="relative -mt-[60px] sm:-mt-[90px] lg:-mt-[120px] z-10">
          {/* Textured SVG Wave at the top — sweeps into the hero */}
          <div className="relative w-full overflow-hidden leading-[0] z-20">
            <svg
              className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="satin-wave-pattern"
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
            className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${textureImage})` }}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Heading */}
            <div className="relative z-10 px-4 pt-6 pb-8 text-center sm:px-6 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16">
              <h2
                className="font-heading text-[clamp(1.8rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-transparent bg-clip-text animate-fade-in"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #FF0066 100%)',
                }}
              >
                Services Offered
              </h2>
              <p className="mx-auto mt-3 max-w-[45rem] text-[clamp(0.9rem,1.6vw,1.2rem)] leading-[1.6] font-sans text-gray-300 sm:mt-4 lg:max-w-[50rem] lg:text-[1.3rem] animate-slide-in-left animation-delay-200">
                Schatzies Events offers complete event packages that include all the essential
                services for weddings and debut celebrations.
              </p>
            </div>

            {/* White wave at the bottom — transition to cards */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
              <svg
                className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
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
      </ScrollReveal>

      {/* ── Section 3: Service Cards Grid ── */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-20 lg:py-28">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-y-20 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-24">
          {services.map(({ Icon, id, title, description }, index) => (
            <ScrollReveal key={id} variant="up" delay={index * 100}>
              <div className="group relative flex flex-col items-center bg-white px-6 pb-32 pt-28 text-center shadow-[0_8px_35px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] border border-gray-100 sm:px-8 sm:pb-36">
                {/* Icon Circle overlapping the top */}
                <div className="absolute -top-14 left-1/2 flex h-28 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-300">
                  <div className="flex h-12 w-12 items-center justify-center text-[#FF0066] [&>svg]:!h-full [&>svg]:!w-full">
                    <Icon />
                  </div>
                </div>

                <h3 className="mt-2 text-[1.3rem] font-bold text-[#FF0066] sm:text-[1.5rem] lg:text-[1.6rem]">
                  {title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.7] text-gray-600 sm:text-[1.05rem] lg:text-[1.1rem]">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Gallery Modal ── */}
      {gallery && (
        <GalleryModal
          isOpen={activeGallery !== null}
          onClose={() => setActiveGallery(null)}
          title={gallery.title}
          images={galleryImages}
        />
      )}
    </>
  );
}
