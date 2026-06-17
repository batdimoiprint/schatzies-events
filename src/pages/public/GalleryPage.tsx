import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from '@phosphor-icons/react';
import { X } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPackages, type EventPackage } from '@/api/packages';
import { toGalleryItems, type GalleryItem } from '@/utils/package-display';

const heroImage = '/Pictures/packages-hero.jpg';

function GalleryGrid({
  items,
  isLoading,
  emptyLabel,
  onImageClick,
}: {
  items: GalleryItem[];
  isLoading: boolean;
  emptyLabel: string;
  onImageClick: (item: GalleryItem) => void;
}) {
  if (isLoading) {
    return <p className="py-12 text-center font-sans text-sm text-ink/50">Loading photos…</p>;
  }
  if (items.length === 0) {
    return <p className="py-12 text-center font-sans text-sm text-ink/50">{emptyLabel}</p>;
  }
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:balance] space-y-6 sm:space-y-0">
      {items.map((item, index) => (
        <ScrollReveal
          key={item.key}
          variant="up"
          delay={(index % 3) * 100}
          className="break-inside-avoid mb-6 block"
        >
          <figure
            onClick={() => onImageClick(item)}
            className="group overflow-hidden rounded-sm border border-border bg-card cursor-zoom-in transition-all hover:border-brand/30"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <figcaption className="px-5 py-4 text-center font-heading text-lg text-ink transition-colors group-hover:text-brand">
              {item.title}
            </figcaption>
          </figure>
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

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

      {/* ── Hero ── */}
      <section
        className="relative -mt-16 md:-mt-20 flex min-h-[60vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-[72vh]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/30" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-28 z-20 inline-flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.18em] text-ivory/80 uppercase transition hover:text-gold lg:left-[8%]"
        >
          <ArrowLeft size={16} weight="bold" /> Back
        </button>
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">The Portfolio</span>
            </div>
            <h1 className="mt-6 font-heading text-[clamp(3rem,9vw,7rem)] leading-[0.9] font-semibold text-ivory">
              Gallery<span className="text-gold">.</span>
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              A collection of timeless moments, unforgettable milestones, and dreams turned into
              reality.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Weddings ── */}
      <section className="bg-ivory py-24 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1300px]">
          <ScrollReveal variant="up" className="mb-12">
            <p className="eyebrow text-brand">01 — Weddings</p>
            <h2 className="mt-5 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Weddings<span className="italic text-brand">.</span>
            </h2>
            <div className="rule-gold mt-6 w-32" />
            <p className="mt-6 max-w-xl font-sans text-base text-ink/65">
              Step into our world of romance—where love stories are beautifully written in every
              detail.
            </p>
          </ScrollReveal>
          <GalleryGrid
            items={weddingItems}
            isLoading={weddingLoading}
            emptyLabel="Wedding photos are coming soon."
            onImageClick={setActivePhoto}
          />
        </div>
      </section>

      {/* ── Debut ── */}
      <section className="bg-secondary/30 py-24 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1300px]">
          <ScrollReveal variant="up" className="mb-12">
            <p className="eyebrow text-brand">02 — Debut</p>
            <h2 className="mt-5 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Debut<span className="italic text-brand">.</span>
            </h2>
            <div className="rule-gold mt-6 w-32" />
            <p className="mt-6 max-w-xl font-sans text-base text-ink/65">
              Celebrating growth, grace, and the beginning of a beautiful new chapter in full
              glamour.
            </p>
          </ScrollReveal>
          <GalleryGrid
            items={debutItems}
            isLoading={debutLoading}
            emptyLabel="Debut photos are coming soon."
            onImageClick={setActivePhoto}
          />
        </div>
      </section>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          {/* Overlay Close Button */}
          <button
            onClick={() => setActivePhoto(null)}
            aria-label="Close modal"
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 hover:text-gold transition-all duration-200 cursor-pointer"
          >
            <X className="size-6 sm:size-8" />
          </button>

          {/* Big Photo */}
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-md shadow-2xl select-none"
            />
            <p className="mt-3 text-center font-heading text-lg sm:text-xl text-white/90 drop-shadow">
              {activePhoto.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
