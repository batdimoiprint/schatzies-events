import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, Sparkles, Flower2, Users } from 'lucide-react';
import { PackageCard } from '@/components/PackageCard';
import { PackageModal } from '@/components/PackageModal';
import { InquiryForm } from '@/components/InquiryForm';
import type { PackageWithModal } from '@/components/PackageModal';

const heroImage = '/Pictures/packages-hero.jpg';

// ── Wedding package cards ──────────────────────────────────────
const weddingPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Blooms Package',
    description:
      'Professionally styled reception backdrops, full photo and video coverage, and signature welcome treats like our Iced Coffee Bar.',
    image: '/Pictures/pkg-blooms.jpg',
    modal: {
      note: 'A comprehensive all-in-one collection designed for a seamless event experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            'Tiffany Chairs for all guests',
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            'Cinematic Highlight Video',
            'Airbrush Makeup for Bride & Mom',
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Fascinating Package',
    description:
      'A cinematic experience featuring high-end storytelling through drone coverage, LED visuals, and a professional magnetic leatherette album.',
    image: '/Pictures/pkg-fascinating.jpg',
    modal: {
      note: 'A premium visual-focused collection designed for cinematic storytelling. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Chauffeured Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Drone Coverage for Aerial Shots', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Airbrush Makeup for Bride & Mom',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Windy Package',
    description:
      'An enchanted atmosphere brought to life with signature fairy-light dance floors, entrance tunnels, and immersive overhead ceiling treatments.',
    image: '/Pictures/pkg-windy.jpg',
    modal: {
      note: 'An immersive atmosphere-focused collection designed for a magical, light-filled experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Chauffeured Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Signature Fairy-light Dance Floor', highlight: true },
            { text: 'Immersive Overhead Ceiling Treatment', highlight: true },
            { text: 'Elegant Entrance Tunnel Setup', highlight: true },
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Airbrush Makeup for Bride & Mom',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'De Luxe Package',
    description:
      'Sophisticated luxury defined by premium guest experiences, featuring a chauffeured Mercedes Benz and a free-flowing cocktail mobile bar.',
    image: '/Pictures/pkg-deluxe.jpg',
    modal: {
      note: 'A high-end hospitality collection designed for a refined and sophisticated celebration. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 5 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Mercedes Benz Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: 'Free-Flowing Mobile Bar (Cocktails)', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Panoramic Entrance Backdrop', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
            { text: 'Personalized Guest Souvenirs', highlight: true },
          ],
        },
      ],
    },
  },
];

// ── Debut package cards ────────────────────────────────────────
const debutPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Blooms Package',
    description:
      'Professionally styled reception backdrops, full photo and video coverage, and signature welcome treats like our Iced Coffee Bar.',
    image: '/Pictures/debut-blooms.jpg',
    modal: {
      note: 'A chic and stylish collection designed to handle your traditions with professional grace. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            'Coordination of 18 Roses & Treasures',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            'One Round of Iced Tea for All Guests',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Entrance Arch & Red Carpet',
            'Professionally Styled Debutante Stage',
            'Full Sound & Light System',
            'Tiffany Chairs for all guests',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            'Cinematic Debut Highlight Video',
            'High-Resolution Edited Photos',
            'Airbrush Makeup for Debutante',
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Irresistible Package',
    description:
      'The "Main Character" experience featuring social-media-ready tech with Same-Day Edit videos, LED walls, and signature craving stations.',
    image: '/Pictures/debut-irresistible.jpg',
    modal: {
      note: 'The "Main Character" experience featuring social-media-ready tech and cinematic storytelling. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            'Full Coordination of 18s Traditions',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            'Interactive Cravings Station (Nachos/Donuts)',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Entrance Arch & Red Carpet',
            'Professionally Styled Debutante Stage',
            'Full Sound & Light System',
            { text: 'High-Definition LED Wall Backdrop', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Debut Video', highlight: true },
            'Airbrush Makeup for Debutante',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Elegancia Package',
    description:
      'A sophisticated fusion of modern glamour and interactive luxury, featuring custom perfume bars and upgraded airbrush hair and makeup.',
    image: '/Pictures/debut-elegancia.jpg',
    modal: {
      note: 'A sophisticated collection designed for a refined and fragrant celebration. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            'Full Coordination of 18s Traditions',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            { text: 'Signature Perfume Bar for Guests', highlight: true },
            'Interactive Cravings Station (Nachos/Donuts)',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Panoramic Entrance Backdrop Gallery', highlight: true },
            'Professionally Styled Debutante Stage',
            'Full Sound & Light System',
            { text: 'High-Definition LED Wall Backdrop', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Debut Video', highlight: true },
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
            { text: 'Personalized Debutante Souvenirs', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Flawless Package',
    description:
      'The pinnacle of prestige for your 18th birthday, offering world-class chandelier production and personalized leather stamping souvenirs.',
    image: '/Pictures/debut-flawless.jpg',
    modal: {
      note: 'The ultimate debut experience — world-class production and personalized luxury throughout. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 5 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            'Full Coordination of 18s Traditions',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            { text: 'Signature Perfume Bar for Guests', highlight: true },
            { text: 'Free-Flowing Mobile Bar (Cocktails)', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'World-Class Chandelier Production', highlight: true },
            { text: 'Leather Stamping Souvenir Station', highlight: true },
            { text: 'High-Definition LED Wall Backdrop', highlight: true },
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Debut Video', highlight: true },
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
            'Airbrush Makeup for Debutante',
          ],
        },
      ],
    },
  },
];

// ── Carousel component ────────────────────────────────────────
function PackageCarousel({
  packages,
  onView,
}: {
  packages: PackageWithModal[];
  onView: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 32
      : 400;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative px-4 sm:px-0">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-left-5 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8"
      >
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} onView={() => onView(i)} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:-right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
      </button>
    </div>
  );
}

export default function EventPackagesPage() {
  const [modal, setModal] = useState<{ packages: PackageWithModal[]; index: number } | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const weddingRef = useRef<HTMLDivElement>(null);
  const debutRef = useRef<HTMLDivElement>(null);

  const scrollToWedding = () => {
    weddingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDebut = () => {
    debutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        {/* ── Section 1: Hero ── */}
        <section
          className="relative -mt-[88px] flex min-h-[60vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Pink gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF589C]/60 via-[#FD78AD]/40 to-transparent" />

          {/* White overlay */}
          <div className="absolute inset-0 bg-white/40" />

          {/* Subtle dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

          {/* Spacer */}
          <div className="h-[88px] shrink-0 sm:h-[110px] lg:h-[173px]" />

          {/* Centered content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
            <h1
              className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight bg-gradient-to-r from-[#FF0066] via-[#FF0066] to-[#4A1053] text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Your Dream Celebration,
              <br />
              All-In-One.
            </h1>

            <p className="mt-4 max-w-[40rem] text-[clamp(0.9rem,1.5vw,1.2rem)] leading-[1.7] text-black sm:mt-6">
              We&apos;ve spent 15 years perfecting the art of the hassle-free milestone. Explore our
              curated wedding and debut collections designed to handle every detail from your first
              photo to your final dance.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:gap-5">
              <Button
                onClick={scrollToWedding}
                className="h-12 min-w-[140px] rounded-full bg-gradient-to-b from-[#FF0066] to-[#700F81] font-sans text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.4)] hover:brightness-110 sm:h-14 sm:min-w-[160px] sm:text-base lg:h-16 lg:min-w-[180px] lg:text-lg"
              >
                Wedding
              </Button>
              <Button
                onClick={scrollToDebut}
                className="h-12 min-w-[140px] rounded-full bg-gradient-to-b from-[#FF0066] to-[#700F81] font-sans text-sm font-bold uppercase tracking-wide shadow-[0_10px_20px_rgba(39,21,57,0.4)] hover:brightness-110 sm:h-14 sm:min-w-[160px] sm:text-base lg:h-16 lg:min-w-[180px] lg:text-lg"
              >
                Debut
              </Button>
            </div>
          </div>
        </section>

        {/* ── Section 2: Wedding Packages carousel ── */}
        <div ref={weddingRef}>
          <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
            <div className="mb-6 text-center sm:mb-8 lg:mb-10">
              <h2
                className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
                }}
              >
                Wedding Packages
              </h2>
              <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-[#4A1053] sm:mt-3">
                Your Dream Day, Defined by Your Style.
              </p>
              <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-[#4a4a4a] sm:mt-2">
                From intimate gatherings to grand estate celebrations, discover
                <br className="hidden sm:block" />
                the curated package that perfectly mirrors your love story.
              </p>
            </div>

            <div className="w-full">
              <PackageCarousel
                packages={weddingPackages}
                onView={(i) => setModal({ packages: weddingPackages, index: i })}
              />
            </div>
          </section>
        </div>

        {/* ── Section 3: Debut Packages carousel ── */}
        <div ref={debutRef}>
          <section className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
            <div className="mb-6 text-center sm:mb-8 lg:mb-10">
              <h2
                className="font-heading text-[clamp(2rem,5vw,4rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
                }}
              >
                Debut Packages
              </h2>
              <p className="mt-2 text-[clamp(1rem,1.8vw,1.5rem)] font-bold font-sans text-[#4A1053] sm:mt-3">
                Celebrate Your Glow-Up in Grand Style.
              </p>
              <p className="mt-1 text-[clamp(0.85rem,1.5vw,1.2rem)] leading-relaxed text-[#4a4a4a] sm:mt-2">
                From chic intimate parties to high-fashion galas, discover the
                <br className="hidden sm:block" />
                package that perfectly captures your journey into adulthood.
              </p>
            </div>

            <div className="w-full">
              <PackageCarousel
                packages={debutPackages}
                onView={(i) => setModal({ packages: debutPackages, index: i })}
              />
            </div>
          </section>
        </div>

        {/* ── Section 4: Seamless Planning + Footer ── */}
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#fff0f7_0%,#fddcee_45%,#f9b8d8_100%)] px-4 pb-0 pt-12 sm:px-6 sm:pt-16 lg:px-28 lg:pt-20">
          <div className="text-center">
            <h2 className="font-heading text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#FF0066] to-[#4A1053] bg-clip-text text-transparent">
                Seamless Planning,
              </span>{' '}
              <span className="bg-gradient-to-r from-[#4A1053] to-[#FF0066] bg-clip-text text-transparent">
                Proven Results
              </span>
            </h2>
            <p className="mt-3 text-[clamp(1rem,1.8vw,1.3rem)] font-bold font-sans text-[#4A1053] sm:mt-4">
              Your Journey to a Flawless Celebration Starts Here
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[80rem] grid-cols-1 gap-6 px-2 sm:mt-14 sm:grid-cols-3 sm:gap-8 sm:px-4 lg:mt-16 lg:gap-10">
            {[
              {
                Icon: Sparkles,
                title: 'Stress-Free Planning',
                body: 'We handle the complex logistics so you can simply stay in the moment and enjoy your day.',
              },
              {
                Icon: Flower2,
                title: 'Bespoke Design',
                body: 'Elegant venue setup and styling with decorations and designs that match the unique theme and style of your celebration.',
              },
              {
                Icon: Users,
                title: 'Full Coordination',
                body: 'A reliable team that manages the program flow from preparation to the actual day, ensuring everything runs smoothly.',
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-[#FF0066]/30 bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:h-28 sm:w-28 sm:rounded-2xl lg:h-32 lg:w-32">
                  <Icon
                    className="h-10 w-10 text-[#FF0066] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mt-4 text-[1rem] font-bold font-heading text-[#1a1a1a] sm:mt-5 sm:text-[1.2rem] lg:mt-6 lg:text-[1.3rem]">
                  {title}
                </h3>
                <p className="mt-2 max-w-[18rem] text-[0.85rem] leading-[1.6] font-sans text-[#3d2052] sm:mt-3 sm:text-[0.9rem] lg:mt-4 lg:text-[1rem]">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
          >
            <ChevronUp className="h-5 w-5 text-[#3d2052] sm:h-6 sm:w-6" />
          </button>

          <footer className="mt-12 flex flex-col items-center pb-8 sm:mt-16 sm:pb-10 lg:mt-20 lg:pb-12">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events logo"
              className="h-16 w-auto sm:h-20 lg:h-24"
            />
          </footer>
        </section>
      </div>

      {/* ── Package detail modal ── */}
      {modal && (
        <PackageModal
          packages={modal!.packages}
          activeIndex={modal!.index}
          onClose={() => setModal(null)}
          onNavigate={(i) => setModal((prev) => (prev ? { ...prev, index: i } : null))}
          onInquire={() => setInquiryOpen(true)}
        />
      )}

      {/* ── Inquiry Form Modal ── */}
      {inquiryOpen && <InquiryForm onClose={() => setInquiryOpen(false)} />}
    </>
  );
}
