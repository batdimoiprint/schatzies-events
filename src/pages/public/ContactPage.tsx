import { useState } from 'react';
import { Phone, FacebookLogo, InstagramLogo, EnvelopeSimple, MapPin, Link } from '@phosphor-icons/react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useBusinessContact } from '@/hooks/useBusinessContact';
import type { ContactLink, ContactPhone, ContactEmail, ContactAddress } from '@/api/contacts';

const heroImage = '/Pictures/contact-hero.jpg';

function getPlatformIcon(platform?: string) {
  const p = (platform ?? '').toLowerCase();
  if (p.includes('facebook')) return FacebookLogo;
  if (p.includes('instagram')) return InstagramLogo;
  return Link;
}

function buildAddressText(a: ContactAddress): string {
  return [a.street, a.barangay, a.city, a.province, a.country, a.zipCode]
    .filter(Boolean)
    .join(', ');
}

function buildMapsHref(text: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(text)}`;
}

function buildMapsEmbedSrc(text: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(text)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/** Get a human-friendly display label for a social link */
function getSocialDisplayName(lnk: ContactLink): string {
  try {
    if (lnk.url.startsWith('http')) {
      const url = new URL(lnk.url);
      const path = url.pathname.replace(/^\/+|\/+$/g, '');
      const host = url.hostname.replace(/^www\./, '');

      // Show page/profile name for known platforms
      if (host.includes('facebook') && path) return `/${path}`;
      if (host.includes('instagram') && path) return `@${path}`;
      if (host.includes('tiktok') && path) return `@${path}`;

      // Fallback: show hostname
      return host;
    }
  } catch {
    // not a valid URL
  }
  return lnk.url;
}

export default function ContactPage() {
  const { data: contact } = useBusinessContact();

  const phones: ContactPhone[] = contact?.phones ?? [];
  const emails: ContactEmail[] = contact?.emails ?? [];
  const links: ContactLink[] = contact?.links ?? [];
  const addresses: ContactAddress[] = contact?.addresses ?? [];

  type Channel = {
    Icon: React.ElementType;
    label: string;
    lines: { display: string; href: string; external?: boolean }[];
  };

  const channels: Channel[] = [];

  if (phones.length > 0) {
    channels.push({
      Icon: Phone,
      label: 'Phone',
      lines: phones.map((p) => ({
        display: p.number,
        href: `tel:${p.number.replace(/\s/g, '')}`,
      })),
    });
  }

  if (emails.length > 0) {
    channels.push({
      Icon: EnvelopeSimple,
      label: 'Email',
      lines: emails.map((e) => ({
        display: e.email,
        href: `mailto:${e.email}`,
      })),
    });
  }

  for (const lnk of links) {
    const Icon = getPlatformIcon(lnk.platform);
    const label = lnk.platform || lnk.label;
    const existing = channels.find((c) => c.label === label);
    const item = {
      display: getSocialDisplayName(lnk),
      href: lnk.url,
      external: true,
    };
    if (existing) {
      existing.lines.push(item);
    } else {
      channels.push({ Icon, label, lines: [item] });
    }
  }

  // Determine grid columns based on channel count so the last row is never orphaned
  const count = channels.length;
  const gridCols =
    count === 1
      ? 'grid-cols-1'
      : count === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : count === 4
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <>
      <LoadingScreen />

      {/* ── Hero ── */}
      <section
        className="relative -mt-16 md:-mt-20 flex min-h-[62vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-[78vh]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">Get in Touch</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-semibold text-ivory">
              Let&rsquo;s begin your <span className="italic text-gold">story.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              Whether you have an event type in mind or just want to explore the possibilities, our
              team is ready to listen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Channels ── */}
      {channels.length > 0 && (
        <section className="bg-ivory py-24 lg:py-32">
          <div className="page-gutter mx-auto max-w-[1400px]">
            <ScrollReveal variant="up" className="mb-14 max-w-2xl">
              <p className="eyebrow text-brand">Reach Out</p>
              <h2 className="mt-6 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
                Start the <span className="italic text-brand">conversation</span>.
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
                Reach out to us through any of these channels and let&rsquo;s start planning your
                dream event.
              </p>
            </ScrollReveal>

            <div className={`grid gap-6 ${gridCols}`}>
              {channels.map(({ Icon, label, lines }) => (
                <ScrollReveal
                  key={label}
                  variant="up"
                  className="group flex flex-col rounded-2xl border border-brand/[0.08] bg-white p-8 lg:p-10 transition-all duration-300 hover:border-brand/20 hover:shadow-[0_15px_40px_-15px_rgba(255,0,102,0.12)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                    <Icon size={26} weight="duotone" />
                  </span>
                  <h3 className="mt-7 font-heading text-2xl font-semibold text-ink">{label}</h3>
                  <div className="mt-3 space-y-2">
                    {lines.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="block break-all font-sans text-[0.95rem] font-medium text-ink/85 transition hover:text-brand"
                        title={l.href}
                      >
                        {l.display}
                      </a>
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Visit our office ── */}
      {addresses.length > 0 && <AddressSection addresses={addresses} />}
    </>
  );
}

/** Separate component for interactive address/map switching */
function AddressSection({ addresses }: { addresses: ContactAddress[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeAddr = addresses[activeIdx];
  const activeText = buildAddressText(activeAddr);

  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-ivory lg:py-32">
      <div className="page-gutter relative z-10 mx-auto max-w-[1400px]">
        <ScrollReveal variant="up" className="mb-12 max-w-2xl">
          <p className="eyebrow text-gold">Visit Us</p>
          <h2 className="mt-6 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ivory">
            Visit our <span className="italic text-gold">office</span>.
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-ivory/70 lg:text-lg">
            We have dedicated office spaces designed for comfortable consultation.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Map — updates based on selected address card */}
          <ScrollReveal
            variant="left"
            className="relative min-h-[340px] h-full overflow-hidden rounded-2xl border border-ivory/15"
          >
            <iframe
              key={activeAddr.id}
              title="Office Location Map"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0 min-h-[340px]"
              src={buildMapsEmbedSrc(activeText || `${activeAddr.label}, Philippines`)}
              allowFullScreen
              loading="lazy"
            />
          </ScrollReveal>

          {/* Address cards — click to switch map */}
          <div className="flex flex-col gap-4">
            {addresses.map((addr, i) => {
              const text = buildAddressText(addr);
              const isActive = i === activeIdx;
              return (
                <ScrollReveal key={addr.id} variant="right" delay={i * 120}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`w-full text-left rounded-2xl border p-7 transition-all duration-300 ${
                      isActive
                        ? 'border-gold/50 bg-ivory/[0.08] shadow-[0_0_30px_-10px_rgba(200,160,60,0.3)]'
                        : 'border-ivory/12 bg-ivory/[0.04] hover:border-ivory/25 hover:bg-ivory/[0.07]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          isActive ? 'bg-gold text-ink' : 'bg-brand text-ivory'
                        }`}
                      >
                        <MapPin size={20} weight="fill" />
                      </span>
                      <div>
                        <h3 className="font-heading text-xl text-ivory">{addr.label}</h3>
                        {text && (
                          <a
                            href={buildMapsHref(text)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 block font-sans text-sm leading-relaxed text-ivory/65 transition hover:text-gold"
                          >
                            {text}
                          </a>
                        )}
                      </div>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
