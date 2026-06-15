import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowLeft } from '@phosphor-icons/react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPackageById, getPackages, type EventPackage, type EventType } from '@/api/packages';
import { groupInclusions, sortPackages, toSlug } from '@/utils/package-display';

const PLACEHOLDER = '/Pictures/packages-hero.jpg';

export default function PackageDetailsPage() {
  const { eventType, packageSlug } = useParams();
  const navigate = useNavigate();

  const apiEventType: EventType = eventType === 'debut' ? 'Debut' : 'Wedding';

  // List: resolve slug → id and get siblings for prev/next nav.
  const { data: allPackages = [], isLoading: listLoading } = useQuery<EventPackage[]>({
    queryKey: ['packages', apiEventType],
    queryFn: () => getPackages(apiEventType),
  });

  const siblings = sortPackages(allPackages);
  const matched = siblings.find((p) => toSlug(p.packageName) === packageSlug) ?? null;

  // Detail: includes inclusions + pax (not in list response).
  const { data: pkg, isLoading: detailLoading } = useQuery<EventPackage>({
    queryKey: ['packages', 'detail', matched?.id],
    queryFn: () => getPackageById(matched!.id),
    enabled: !!matched?.id,
  });

  const isLoading = listLoading || detailLoading;

  const goToPackage = (target: EventPackage) =>
    navigate(`/packages/${eventType}/${toSlug(target.packageName)}`);

  if (isLoading) {
    return (
      <>
        <LoadingScreen />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading package…</p>
        </div>
      </>
    );
  }

  if (!matched) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-ink">Package not found</h1>
          <button
            onClick={() => navigate('/event-packages')}
            className="mt-4 inline-flex items-center gap-2 font-ui text-sm font-semibold text-brand hover:underline"
          >
            <ArrowLeft size={14} /> Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  const currentIndex = siblings.findIndex((p) => p.id === matched.id);
  const prevPkg = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextPkg =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;

  const images = pkg.images ?? [];
  const coverImg = images[0]?.url ?? PLACEHOLDER;
  const galleryImgs = images.slice(1);

  const categories = groupInclusions(pkg.inclusions);
  const paxTiers = [...(pkg.pax ?? [])].sort((a, b) => (a.pax ?? 0) - (b.pax ?? 0));
  const label = eventType === 'debut' ? '02 — Debut' : '01 — Weddings';

  return (
    <>
      <LoadingScreen />

      {/* ── Top bar ── */}
      <div className="page-gutter mx-auto flex max-w-[1400px] items-center justify-between pb-6 pt-28 lg:pt-32">
        <button
          onClick={() => navigate('/event-packages')}
          className="inline-flex items-center gap-2 font-ui text-xs font-semibold tracking-[0.15em] text-ink/50 uppercase transition hover:text-brand"
        >
          <ArrowLeft size={14} weight="bold" /> All Packages
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => prevPkg && goToPackage(prevPkg)}
            disabled={!prevPkg}
            aria-label="Previous package"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink/50 transition hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-ui text-xs text-ink/40">
            {currentIndex + 1} / {siblings.length}
          </span>
          <button
            onClick={() => nextPkg && goToPackage(nextPkg)}
            disabled={!nextPkg}
            aria-label="Next package"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink/50 transition hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <ScrollReveal variant="up">
        <div className="page-gutter mx-auto max-w-[1400px] pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_440px] lg:gap-16 xl:grid-cols-[1fr_480px]">

            {/* LEFT: cover + gallery */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={coverImg}
                  alt={pkg.packageName}
                  className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[620px]"
                />
              </div>

              {galleryImgs.length > 0 && (
                <div
                  className={`grid gap-3 ${
                    galleryImgs.length === 1
                      ? 'grid-cols-1'
                      : galleryImgs.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-2 sm:grid-cols-3'
                  }`}
                >
                  {galleryImgs.map((img, i) => (
                    <div key={img.key} className="overflow-hidden rounded-sm">
                      <img
                        src={img.url}
                        alt={`${pkg.packageName} — photo ${i + 2}`}
                        loading="lazy"
                        className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-56"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: info panel */}
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:[scrollbar-width:thin]">
              <div className="space-y-8">

                {/* Header */}
                <div>
                  <p className="eyebrow text-brand">{label}</p>
                  <h1 className="mt-4 font-heading text-[clamp(2rem,5vw,3rem)] leading-[1.05] text-ink">
                    {pkg.packageName}
                    <span className="italic text-brand">.</span>
                  </h1>
                  <div className="rule-gold mt-5 w-20" />
                  {pkg.description && (
                    <p className="mt-5 font-sans text-sm leading-relaxed text-ink/65 lg:text-base">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Inclusions */}
                {categories.length > 0 ? (
                  <div className="space-y-6">
                    <h2 className="font-heading text-lg text-ink">What's Included</h2>
                    {categories.map((cat) => (
                      <div key={cat.title}>
                        <div className="mb-3 flex items-center gap-3">
                          <span className="h-px flex-1 bg-border" />
                          <span className="font-ui text-[10px] font-bold tracking-[0.18em] uppercase text-ink/40">
                            {cat.title}
                          </span>
                          <span className="h-px flex-1 bg-border" />
                        </div>
                        <ul className="space-y-2">
                          {cat.items.map((item) => {
                            const text = typeof item === 'object' ? item.text : item;
                            const isHighlight = typeof item === 'object';
                            return (
                              <li key={text} className="flex items-start gap-2.5">
                                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                                <span
                                  className={`font-sans text-sm leading-relaxed ${
                                    isHighlight ? 'font-semibold text-brand' : 'text-ink/70'
                                  }`}
                                >
                                  {text}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-sm text-ink/50">
                    Inclusions for this package are being finalized. Please inquire for details.
                  </p>
                )}

                {/* Pax pricing table */}
                {paxTiers.length > 0 && (
                  <div>
                    <h2 className="mb-4 font-heading text-lg text-ink">Pricing</h2>
                    <table className="w-full overflow-hidden rounded-sm border border-border text-sm">
                      <thead>
                        <tr className="bg-ink text-white">
                          <th className="px-4 py-3 text-left font-ui text-[10px] font-bold tracking-[0.15em] uppercase">
                            Guests
                          </th>
                          <th className="px-4 py-3 text-right font-ui text-[10px] font-bold tracking-[0.15em] uppercase">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left font-ui text-[10px] font-bold tracking-[0.15em] uppercase">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paxTiers.map((tier, i) => (
                          <tr
                            key={tier.id}
                            className={i % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}
                          >
                            <td className="px-4 py-3 font-sans font-semibold text-ink">
                              {tier.pax?.toLocaleString()} pax
                            </td>
                            <td className="px-4 py-3 text-right font-sans font-bold text-brand">
                              ₱{tier.paxPrice?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-sans text-ink/50">
                              {tier.note || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CTA */}
                <a
                  href="/contact"
                  className="block w-full rounded-sm bg-brand py-3.5 text-center font-ui text-xs font-bold tracking-[0.18em] text-white uppercase transition hover:bg-brand/90"
                >
                  Inquire About This Package
                </a>
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
