const heroImage = '/Pictures/Services.png';

import { useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
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

      {/* ── Hero — full-bleed editorial ── */}
      <section
        className="relative -mt-20 flex min-h-[78vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-screen"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40 lg:pb-28">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">Schatzies Atelier — Services</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-semibold text-ivory">
              Your perfect event, <span className="italic text-gold">starts here.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              From planning to execution, we offer everything you need to bring your dream event to
              life.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="page-gutter mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-16 max-w-3xl">
            <p className="eyebrow text-brand">What We Offer</p>
            <h2 className="mt-6 font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ink">
              Services <span className="italic text-brand">offered</span>.
            </h2>
            <div className="rule-gold mt-7 w-40" />
            <p className="mt-7 font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
              Schatzies Events offers complete event packages that include all the essential
              services for weddings and debut celebrations.
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ Icon, id, title, description }, index) => (
              <ScrollReveal key={id} variant="up" delay={(index % 3) * 100}>
                <button
                  type="button"
                  onClick={() => setActiveGallery(id)}
                  className="group flex h-full w-full flex-col items-start bg-card p-8 text-left transition-colors duration-300 hover:bg-secondary/40 lg:p-10"
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center text-brand [&>svg]:!h-11 [&>svg]:!w-11">
                      <Icon />
                    </div>
                    <span className="font-heading text-2xl italic text-gold/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl leading-tight text-ink">{title}</h3>
                  <p className="mt-3 flex-1 font-sans text-[0.95rem] leading-relaxed text-ink/65">
                    {description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-ui text-[0.7rem] font-semibold tracking-[0.18em] text-brand uppercase">
                    View Gallery
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
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
