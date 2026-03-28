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
const weddingPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Blooms Package',
    description:
      'Professionally styled reception backdrops, photo and video coverage, and signature welcome treats like our Iced Coffee Bar.',
    image: '/Pictures/pkg-blooms.jpg',
    modal: {
      note: 'A comprehensive all-in-one collection designed for a seamless event experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 4 Coordinators', 'Staff with Handheld Radios', 'Professional Event Emcee'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Full Buffet (Beef, Pork, Chicken, Fish)', 'Signature Iced Coffee Bar', 'French Fries & Cookies Station'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['Elegant Reception Backdrop', 'Tiffany Chairs for all guests', 'Full Sound & Light System'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['1 Photographer & 2 Videographers', 'Cinematic Highlight Video', 'Airbrush Makeup for Bride & Mom'],
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
    name: 'Windy Packages',
    description:
      'An enchanted atmosphere brought to life with signature fairy-light dance floors, entrance tunnels, and immersive overhead ceiling treatments.',
    image: '/Pictures/pkg-windy.jpg',
    modal: {
      note: 'An ethereal wedding package ideal for couples who dream of a fairy-tale atmosphere. Designed for up to 300 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 8 Coordinators', 'Dedicated Day-of Concierge', 'Professional Event Emcee'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Premium Buffet with Live Stations', 'Open Bar (Cocktails & Mocktails)', 'Custom Wedding Cake'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['Fairy-Light Dance Floor', 'Overhead Ceiling Treatment', 'Entrance Tunnel & LED Pillars'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['Drone + 3 Photographers', '4K Cinematic Film', 'Airbrush Glam Team for Entourage'],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'De Luxe Package',
    description:
      'Sophisticated luxury defining experiences, featuring a chauffeured grand entrance and a free-flowing cocktail hour.',
    image: '/Pictures/pkg-deluxe.jpg',
    modal: {
      note: 'The pinnacle of wedding luxury — every detail curated to perfection. Designed for up to 500 guests with a dedicated concierge team.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 10 Coordinators', 'Dedicated Concierge & Butler', 'Celebrity-Level Emcee'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Plated Fine-Dining Service', 'Free-Flowing Cocktail Hour', 'Personalized Wedding Cake'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['Grand Floral & Chandelier Treatment', 'Chauffeured Grand Entrance', 'Full Venue Transformation'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['Full Glam Team for Entire Entourage', '8K Cinematic Wedding Film', 'Bespoke Photo Book & Digital Album'],
        },
      ],
    },
  },
];

// ── Debut package cards ────────────────────────────────────────
// Place card photos in public/Pictures/ and update the src values.
const debutPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Blooms Package',
    description:
      'Professionally styled reception backdrops, photo and video coverage, and signature welcome treats like our Iced Coffee Bar.',
    image: '/Pictures/debut-blooms.jpg',
    modal: {
      note: 'A charming debut package for the debutante who wants elegance and warmth. Includes service and coordination for up to 150 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 4 Coordinators', 'Staff with Handheld Radios', 'Professional Event Emcee'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Full Buffet (Beef, Pork, Chicken, Fish)', 'Signature Iced Coffee Bar', 'French Fries & Cookies Station'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['Elegant Reception Backdrop', 'Tiffany Chairs for all guests', 'Full Sound & Light System'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['1 Photographer & 2 Videographers', 'Cinematic Highlight Video', 'Airbrush Makeup for Debutante'],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Irresistible Package',
    description:
      'The \u201cMain Character\u201d experience featuring social-media-ready tech with Same-Day Edit videos, LED walls, and signature craving stations.',
    image: '/Pictures/debut-irresistible.jpg',
    modal: {
      note: 'Designed for the social-media-savvy debutante who wants to make a statement. Covers up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 6 Coordinators', 'Dedicated Debut Emcee', 'Cotillion de Honor Management'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Full Buffet with Craving Stations', 'Signature Drinks & Mocktails', 'Dessert Station'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['LED Wall Backdrop', 'Full Sound & Light Production', 'Customized Stage Design'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['Same-Day Edit (SDE) Video', 'Photo & Video Coverage', 'Airbrush Glam for Debutante & Court'],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Elegancia Packages',
    description:
      'A sophisticated fusion of modern glamour and interactive luxury, featuring custom perfume bars and upgraded airbrush hair and makeup.',
    image: '/Pictures/debut-elegancia.jpg',
    modal: {
      note: 'For the debutante who desires a sophisticated and luxurious 18th birthday. Designed for up to 250 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 8 Coordinators', 'Grand Entrance Choreographer', 'Dedicated Concierge'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Premium Buffet with Live Stations', 'Custom Perfume Bar Favor', 'Personalized Debut Cake'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['Floral & Chandelier Treatment', 'Interactive Lux Stage Design', 'Premium Lighting System'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['Drone + 2 Photographers', 'Upgraded Airbrush Hair & Makeup', '4K Cinematic Debut Film'],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Flawless Packages',
    description:
      'The pinnacle of prestige for your 18th birthday, offering world-class chandelier production and personalized leather stamping souvenirs.',
    image: '/Pictures/debut-flawless.jpg',
    modal: {
      note: 'The ultimate debut experience — world-class production and personalized luxury throughout. Designed for up to 400 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: ['1 Lead Planner & 10 Coordinators', 'Celebrity-Level Emcee', 'Full Cotillion Choreography'],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: ['Plated Fine-Dining Service', 'Open Bar & Cocktail Hour', 'Bespoke Debut Cake & Dessert Table'],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: ['World-Class Chandelier Production', 'Leather Stamping Souvenir Station', 'Full Venue Transformation'],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: ['Full Glam Team for Court & Family', '8K Cinematic Debut Film', 'Bespoke Photo Album & Digital Gallery'],
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Spacer that matches navbar height so content sits below it visually */}
        <div className="h-[173px] shrink-0" />

        {/* Centered content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-bold italic leading-tight text-[#e61f83]">
            Your Dream Celebration,
            <br />
            All-In-One.
          </h1>

          <p className="mt-6 max-w-[44rem] text-[clamp(0.95rem,1.3vw,1.15rem)] leading-[1.75] text-white/90">
            We&apos;ve spent 15 years perfecting the art of the hassle-free
            milestone. Explore our curated wedding and debut collections designed
            to handle every detail from your first photo to your final dance.
          </p>

          <div className="mt-10 flex gap-6">
            <Button className="h-[56px] min-w-[160px] rounded-2xl bg-gradient-to-b from-[#e61f83] via-[#9b2d8a] to-[#501f5a] text-[1.1rem] font-bold uppercase tracking-wide shadow-[0_10px_24px_rgba(39,21,57,0.4)] hover:brightness-110">
              Wedding
            </Button>
            <Button className="h-[56px] min-w-[160px] rounded-2xl bg-gradient-to-b from-[#e61f83] via-[#9b2d8a] to-[#501f5a] text-[1.1rem] font-bold uppercase tracking-wide shadow-[0_10px_24px_rgba(39,21,57,0.4)] hover:brightness-110">
              Debut
            </Button>
          </div>
        </div>
      </section>

      {/* ── Section 2: Wedding Packages carousel ── */}
      <section className="bg-white px-6 py-20 lg:px-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-[clamp(2.2rem,5vw,4rem)] font-bold italic text-[#e61f83]">
            Wedding Packages
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.4vw,1.2rem)] font-bold text-[#3d2052]">
            Your Dream Day, Defined by Your Style.
          </p>
          <p className="mt-2 text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-[#4a4a4a]">
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
      <section className="bg-white px-6 py-20 lg:px-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-[clamp(2.2rem,5vw,4rem)] font-bold italic text-[#e61f83]">
            Debut Packages
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.4vw,1.2rem)] font-bold text-[#3d2052]">
            Celebrate Your Glow-Up in Grand Style.
          </p>
          <p className="mt-2 text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-[#4a4a4a]">
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
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5rem)] font-bold italic leading-tight">
            <span className="text-[#e61f83]">Seamless Planning,</span>{' '}
            <span className="text-[#3d2052]">Proven Results</span>
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.5vw,1.25rem)] font-bold text-[#3d2052]">
            Your Journey to a Flawless Celebration Starts Here
          </p>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-16 sm:grid-cols-3">
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
            <div key={title} className="flex flex-col items-center text-center">
              {/* Icon box */}
              <div className="flex h-[140px] w-[140px] items-center justify-center rounded-[28px] border border-[#f0a0c8] bg-white shadow-lg">
                <Icon className="h-[72px] w-[72px] text-[#e61f83]" strokeWidth={1.5} />
              </div>
              <h3 className="mt-8 text-[1.3rem] font-bold text-[#1a1a1a]">{title}</h3>
              <p className="mt-4 max-w-[18rem] text-[1.05rem] leading-[1.8] text-[#3d2052]">{body}</p>
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
        onNavigate={(i) => setModal((prev) => prev ? { ...prev, index: i } : null)}
      />
    )}
    </>
  );
}
