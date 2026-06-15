import { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkle, Flower, Users } from '@phosphor-icons/react';
import { PackageCard, type PackageItem } from '@/components/PackageCard';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPackages, type EventPackage } from '@/api/packages';
import { sortPackages, toCardItem, toSlug } from '@/utils/package-display';

const heroImage = '/Pictures/packages-hero.jpg';

// ── Package Grid (No side scroll button, fits 5 on one row on desktop, wraps on mobile) ──
function PackageGrid({
  packages,
  onView,
}: {
  packages: PackageItem[];
  onView: (index: number) => void;
}) {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-14 2xl:px-16 max-w-full flex justify-center">
      <div className="flex flex-wrap justify-center gap-5 w-full">
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            className="animate-fade-in-up flex flex-col w-full max-w-[350px] sm:w-[calc(50%-10px)] sm:max-w-[340px] md:w-[calc(33.33%-14px)] md:max-w-[340px] lg:w-[calc(20%-16px)] lg:min-w-[180px] lg:max-w-[340px]"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <PackageCard pkg={pkg} onView={() => onView(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PackageCardsArea({
  cards,
  isLoading,
  emptyLabel,
  onView,
}: {
  cards: PackageItem[];
  isLoading: boolean;
  emptyLabel: string;
  onView: (index: number) => void;
}) {
  if (isLoading) {
    return <p className="py-12 text-center font-sans text-sm text-ink/50">Loading packages…</p>;
  }
  if (cards.length === 0) {
    return <p className="py-12 text-center font-sans text-sm text-ink/50">{emptyLabel}</p>;
  }
  return <PackageGrid packages={cards} onView={onView} />;
}

// ── Page ─────────────────────────────────────────────────────
export default function EventPackagesPage() {
  const weddingRef = useRef<HTMLDivElement>(null);
  const debutRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: weddingData = [], isLoading: weddingLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', 'Wedding'],
    queryFn: () => getPackages('Wedding'),
  });
  const { data: debutData = [], isLoading: debutLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', 'Debut'],
    queryFn: () => getPackages('Debut'),
  });

  const weddingPackages = sortPackages(weddingData).map(toCardItem);
  const debutPackages = sortPackages(debutData).map(toCardItem);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'wedding') {
      setTimeout(() => weddingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (type === 'debut') {
      setTimeout(() => debutRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [searchParams]);

  return (
    <>
      <LoadingScreen />

      {/* ── Hero ── */}
      <section
        className="relative -mt-20 flex min-h-[68vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-[82vh]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">Our Collections</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.96] text-ivory">
              Your dream celebration,{' '}
              <span className="italic text-gold">all-in-one.</span>
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              17 years of perfecting the hassle-free milestone. Explore our curated wedding
              and debut collections designed to handle every detail.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Wedding Packages ── */}
      <section ref={weddingRef} className="bg-ivory py-24 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-12">
            <p className="eyebrow text-brand">01 — Weddings</p>
            <h2 className="mt-5 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Wedding Packages<span className="italic text-brand">.</span>
            </h2>
            <div className="rule-gold mt-6 w-32" />
            <p className="mt-6 max-w-xl font-sans text-base text-ink/65">
              From intimate gatherings to grand estate celebrations, discover the curated
              package that perfectly mirrors your love story.
            </p>
          </ScrollReveal>
        </div>
        <div className="mt-10">
          <PackageCardsArea
            cards={weddingPackages}
            isLoading={weddingLoading}
            emptyLabel="No wedding packages available yet."
            onView={(i) => navigate(`/packages/wedding/${toSlug(weddingPackages[i].name)}`)}
          />
        </div>
      </section>

      {/* ── Debut Packages ── */}
      <section ref={debutRef} className="bg-secondary/30 py-24 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-12">
            <p className="eyebrow text-brand">02 — Debut</p>
            <h2 className="mt-5 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Debut Packages<span className="italic text-brand">.</span>
            </h2>
            <div className="rule-gold mt-6 w-32" />
            <p className="mt-6 max-w-xl font-sans text-base text-ink/65">
              From chic intimate parties to high-fashion galas, discover the package that
              perfectly captures your journey into adulthood.
            </p>
          </ScrollReveal>
        </div>
        <div className="mt-10">
          <PackageCardsArea
            cards={debutPackages}
            isLoading={debutLoading}
            emptyLabel="No debut packages available yet."
            onView={(i) => navigate(`/packages/debut/${toSlug(debutPackages[i].name)}`)}
          />
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="bg-ivory py-24 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1300px]">
          <ScrollReveal variant="up" className="mb-14 text-center">
            <p className="eyebrow text-brand">03 — The Promise</p>
            <h2 className="mt-5 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Seamless planning,{' '}
              <span className="italic text-brand">proven results.</span>
            </h2>
            <div className="rule-gold mx-auto mt-6 w-32" />
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                Icon: Sparkle,
                title: 'Stress-Free Planning',
                body: 'We handle the complex logistics so you can simply stay in the moment and enjoy your day.',
              },
              {
                Icon: Flower,
                title: 'Bespoke Design',
                body: 'Elegant venue setup and styling with decorations that match the unique theme of your celebration.',
              },
              {
                Icon: Users,
                title: 'Full Coordination',
                body: 'A reliable team that manages the program flow from preparation to the actual day.',
              },
            ].map(({ Icon, title, body }, i) => (
              <ScrollReveal key={title} variant="up" delay={i * 120}>
                <div className="flex flex-col items-center rounded-sm border border-border bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <Icon size={48} className="text-brand" weight="thin" />
                  <h3 className="mt-6 font-heading text-lg text-ink">{title}</h3>
                  <p className="mt-3 max-w-[18rem] font-sans text-sm leading-relaxed text-ink/65">
                    {body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
