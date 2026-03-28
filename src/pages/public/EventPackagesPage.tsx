import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, Sparkles, Flower2, Users } from 'lucide-react';
import { PackageCard } from '@/components/PackageCard';
import { PackageModal } from '@/components/PackageModal';
import type { PackageWithModal } from '@/components/PackageModal';

// Replace with your actual hero photo placed in public/Pictures/
const heroImage = '/Pictures/packages-hero.jpg';

// ── Wedding package cards ──────────────────────────────────────
// Place card photos in public/Pictures/ and update the src values.
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
    image: '/Pictures/debut-blooms.jpg',
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
    image: '/Pictures/debut-blooms.jpg',
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
    image: '/Pictures/debut-blooms.jpg',
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
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronLeft className="h-6 w-6 text-[#3d2052]" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-8 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} onView={() => onView(i)} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronRight className="h-6 w-6 text-[#3d2052]" />
      </button>
    </div>
  );
}

export default function EventPackagesPage() {
  const [modal, setModal] = useState<{ packages: PackageWithModal[]; index: number } | null>(null);

  return (
    <>
      <div>
        {/* ── Section 1: Hero ── */}
        <section
          className="relative -mt-[173px] flex min-h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Pink gradient overlay to lighten and add warmth */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF589C]/60 via-[#FD78AD]/40 to-transparent" />

          {/* White overlay for extra brightness */}
          <div className="absolute inset-0 bg-white/40" />

          {/* Subtle dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

          {/* Spacer that matches navbar height so content sits below it visually */}
          <div className="h-[173px] shrink-0" />

          {/* Centered content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h1
              className="font-['Libre_Baskerville'] text-[clamp(3.5rem,10vw,140px)] font-bold leading-tight bg-gradient-to-r from-[#FF0066] via-[#FF0066] to-[#4A1053] text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Your Dream Celebration,
              <br />
              All-In-One.
            </h1>

            <p className="mt-6 max-w-[44rem] text-[clamp(1.1rem,1.8vw,1.35rem)] leading-[1.75] text-black">
              We&apos;ve spent 15 years perfecting the art of the hassle-free milestone. Explore our
              curated wedding and debut collections designed to handle every detail from your first
              photo to your final dance.
            </p>
            <div className="mt-10 flex gap-6">
              <Button className="h-[100px] min-w-[250px] rounded-2xl bg-gradient-to-b from-[#FF0066] to-[#700F81] font-['Montserrat'] text-[1.8rem] font-bold tracking-wide shadow-[0_12px_28px_rgba(39,21,57,0.5)] hover:brightness-110">
                Wedding
              </Button>
              <Button className="h-[100px] min-w-[250px] rounded-2xl bg-gradient-to-b from-[#FF0066] to-[#700F81] font-['Montserrat'] text-[1.8rem] font-bold tracking-wide shadow-[0_12px_28px_rgba(39,21,57,0.5)] hover:brightness-110">
                Debut
              </Button>
            </div>
          </div>
        </section>

        {/* ── Section 2: Wedding Packages carousel ── */}
        <section className="bg-white px-6 py-20 lg:px-20">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2
              className="font-heading text-[clamp(3.5rem,8vw,6rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Wedding Packages
            </h2>
            <p className="mt-4 text-[clamp(1.5rem,2rem,1.8rem)] font-bold font-sans text-[#4A1053]">
              Your Dream Day, Defined by Your Style.
            </p>
            <p className="mt-2 text-[clamp(1.1rem,1.8vw,1.4rem)] leading-relaxed text-[#4a4a4a]">
              From intimate gatherings to grand estate celebrations, discover
              <br className="hidden sm:block" />
              the curated package that perfectly mirrors your love story.
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full">
            <PackageCarousel
              packages={weddingPackages}
              onView={(i) => setModal({ packages: weddingPackages, index: i })}
            />
          </div>
        </section>

        {/* ── Section 3: Debut Packages carousel ── */}
        {/* ── Section 3: Debut Packages carousel ── */}
        <section className="bg-white px-6 py-20 lg:px-20">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2
              className="font-heading text-[clamp(3.5rem,8vw,6rem)] font-bold bg-gradient-to-r text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #FF0066 46%, #4A1053 100%)',
              }}
            >
              Debut Packages
            </h2>
            <p className="mt-4 text-[clamp(1.5rem,2rem,1.8rem)] font-bold font-sans text-[#4A1053]">
              Celebrate Your Glow-Up in Grand Style.
            </p>
            <p className="mt-2 text-[clamp(1.1rem,1.8vw,1.4rem)] leading-relaxed text-[#4a4a4a]">
              From chic intimate parties to high-fashion galas, discover the
              <br className="hidden sm:block" />
              package that perfectly captures your journey into adulthood.
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full">
            <PackageCarousel
              packages={debutPackages}
              onView={(i) => setModal({ packages: debutPackages, index: i })}
            />
          </div>
        </section>

        {/* ── Section 4: Seamless Planning + Footer ── */}
        <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,#fff0f7_0%,#fddcee_45%,#f9b8d8_100%)] px-6 pb-0 pt-24 lg:px-28">
          {/* Heading */}
          <div className="text-center">
            <h2 className="font-heading text-[clamp(3.5rem,8vw,6rem)] font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#FF0066] to-[#4A1053] bg-clip-text text-transparent">
                Seamless Planning,
              </span>{' '}
              <span className="bg-gradient-to-r from-[#4A1053] to-[#FF0066] bg-clip-text text-transparent">
                Proven Results
              </span>
            </h2>
            <p className="mt-4 text-[clamp(1.2rem,2vw,1.6rem)] font-bold font-sans text-[#4A1053]">
              Your Journey to a Flawless Celebration Starts Here
            </p>
          </div>

          {/* Feature cards - Full width with larger cards */}
          <div className="mx-auto mt-20 grid max-w-[90rem] grid-cols-1 gap-12 px-8 sm:grid-cols-3 lg:px-16">
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
                className="flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon box - larger */}
                <div className="flex h-[180px] w-[180px] items-center justify-center rounded-[32px] border-2 border-[#FF0066]/30 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <Icon className="h-[88px] w-[88px] text-[#FF0066]" strokeWidth={1.5} />
                </div>
                <h3 className="mt-8 text-[1.8rem] font-bold font-heading text-[#1a1a1a]">
                  {title}
                </h3>
                <p className="mt-4 max-w-[20rem] text-[1.2rem] leading-[1.8] font-sans text-[#3d2052]">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll-to-top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="absolute bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronUp className="h-6 w-6 text-[#3d2052]" />
          </button>

          {/* Footer */}
          <footer className="mt-24 flex flex-col items-center pb-14">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events logo"
              className="h-[140px] w-auto"
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
        />
      )}
    </>
  );
}
