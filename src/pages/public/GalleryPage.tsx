import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPackages, type EventPackage } from '@/api/packages';
import { toGalleryItems, type GalleryItem } from '@/utils/package-display';

const heroImage = '/Pictures/packages-hero.jpg';

// ── Gallery grid: loading / empty / cards ─────────────────────
function GalleryGrid({
  items,
  isLoading,
  emptyLabel,
}: {
  items: GalleryItem[];
  isLoading: boolean;
  emptyLabel: string;
}) {
  if (isLoading) {
    return <p className="py-10 text-center text-gray-500">Loading photos…</p>;
  }
  if (items.length === 0) {
    return <p className="py-10 text-center text-gray-500">{emptyLabel}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {items.map((item, index) => (
        <ScrollReveal key={item.key} variant="up" delay={index * 100}>
          <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            {/* Image */}
            <div className="relative w-full pt-[100%] overflow-hidden bg-gray-200">
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            {/* Title */}
            <div className="bg-white px-5 sm:px-6 py-4 sm:py-5">
              <h3 className="font-semibold text-gray-800 text-[0.95rem] sm:text-[1rem] lg:text-[1.05rem] text-center font-['Montserrat',sans-serif]">
                {item.title}
              </h3>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const navigate = useNavigate();

  const { data: weddingPackages = [], isLoading: weddingLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', 'Wedding'],
    queryFn: () => getPackages('Wedding'),
  });
  const { data: debutPackages = [], isLoading: debutLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', 'Debut'],
    queryFn: () => getPackages('Debut'),
  });

  const weddingItems = toGalleryItems(weddingPackages);
  const debutItems = toGalleryItems(debutPackages);

  return (
    <>
      <LoadingScreen />

      {/* ── Hero Section ── */}
      <ScrollReveal variant="fade">
        <section
          className="relative -mt-[88px] flex min-h-[50vh] flex-col overflow-hidden bg-cover bg-center bg-no-repeat sm:-mt-[110px] md:min-h-[70vh] lg:-mt-[173px] lg:min-h-screen"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Stronger white wash at top for navbar */}
          <div className="absolute top-0 left-0 right-0 h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-b from-white via-white/70 via-white/30 to-transparent z-[5]" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[120px] left-4 sm:left-6 lg:left-8 z-20 flex items-center gap-2 text-[#3d2052] hover:text-[#FF0066] transition sm:top-[140px] lg:top-[180px]"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-semibold text-[0.9rem] sm:text-[1rem]">Back</span>
          </button>

          {/* Content centered */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-[160px] sm:py-[260px] md:py-[360px] lg:py-[420px] text-center sm:px-6 animate-fade-in-up">
            <h1 className="font-heading text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight text-white drop-shadow-lg">
              GALLERY
            </h1>

            <p className="mt-3 max-w-[40rem] text-[clamp(0.9rem,1.8vw,1.3rem)] leading-[1.7] font-sans text-gray-100 font-medium sm:mt-4 sm:max-w-[45rem] lg:mt-6 lg:max-w-[50rem] lg:text-[1.4rem] animate-fade-in-up animation-delay-200">
              A collection of timeless moments, unforgettable milestones, and dreams turned into
              reality.
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-8 bg-[#FF0066] hover:bg-[#e60060] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in-up animation-delay-400"
            >
              Back to home
            </button>
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

      {/* ── Weddings Section ── */}
      <ScrollReveal variant="up">
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1200px]">
            {/* Section Title */}
            <ScrollReveal variant="up" className="text-center mb-12">
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-[#FF0066] mb-3 font-heading">
                WEDDINGS
              </h2>
              <p className="text-[0.95rem] sm:text-[1rem] lg:text-[1.1rem] text-gray-600 max-w-[600px] mx-auto font-['Montserrat',sans-serif]">
                Step into our world of romance—where love stories are beautifully written in every
                detail.
              </p>
            </ScrollReveal>

            {/* Gallery Grid */}
            <GalleryGrid
              items={weddingItems}
              isLoading={weddingLoading}
              emptyLabel="Wedding photos are coming soon."
            />
          </div>
        </section>
      </ScrollReveal>

      {/* ── Debut Section ── */}
      <ScrollReveal variant="up">
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1200px]">
            {/* Section Title */}
            <ScrollReveal variant="up" className="text-center mb-12">
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-[#FF0066] mb-3 font-heading">
                DEBUT
              </h2>
              <p className="text-[0.95rem] sm:text-[1rem] lg:text-[1.1rem] text-gray-600 max-w-[600px] mx-auto font-['Montserrat',sans-serif]">
                Celebrating growth, grace, and the beginning of a beautiful new chapter in full
                glamour.
              </p>
            </ScrollReveal>

            {/* Gallery Grid */}
            <GalleryGrid
              items={debutItems}
              isLoading={debutLoading}
              emptyLabel="Debut photos are coming soon."
            />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
