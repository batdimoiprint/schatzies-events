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

export default function ContactPage() {
  const { data: contact } = useBusinessContact();

  const phones: ContactPhone[] = contact?.phones ?? [];
  const emails: ContactEmail[] = contact?.emails ?? [];
  const links: ContactLink[] = contact?.links ?? [];
  const addresses: ContactAddress[] = contact?.addresses ?? [];

  type Channel = {
    Icon: React.ElementType;
    label: string;
    lines: { text: string; href: string; external?: boolean }[];
  };

  const channels: Channel[] = [];

  if (phones.length > 0) {
    channels.push({
      Icon: Phone,
      label: 'Phone',
      lines: phones.map((p) => ({
        text: p.number,
        href: `tel:${p.number.replace(/\s/g, '')}`,
      })),
    });
  }

  if (emails.length > 0) {
    channels.push({
      Icon: EnvelopeSimple,
      label: 'Email',
      lines: emails.map((e) => ({
        text: e.email,
        href: `mailto:${e.email}`,
      })),
    });
  }

  for (const lnk of links) {
    const Icon = getPlatformIcon(lnk.platform);
    const label = lnk.platform || lnk.label;
    const existing = channels.find((c) => c.label === label);
    if (existing) {
      existing.lines.push({ text: lnk.url, href: lnk.url, external: true });
    } else {
      channels.push({
        Icon,
        label,
        lines: [{ text: lnk.url, href: lnk.url, external: true }],
      });
    }
  }

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

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map(({ Icon, label, lines }) => (
                <ScrollReveal
                  key={label}
                  variant="up"
                  className="flex flex-col rounded-2xl border border-brand/[0.08] bg-white p-8 lg:p-10 transition-all duration-300 hover:border-brand/20 hover:shadow-[0_15px_40px_-15px_rgba(255,0,102,0.08)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon size={26} weight="duotone" />
                  </span>
                  <h3 className="mt-7 font-heading text-2xl font-semibold text-ink">{label}</h3>
                  <div className="mt-3 space-y-2">
                    {lines.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="block font-sans text-[0.95rem] font-medium text-ink/85 transition hover:text-brand"
                      >
                        {l.text}
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
      {addresses.length > 0 && (
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
              <ScrollReveal
                variant="left"
                className="relative min-h-[340px] h-full overflow-hidden rounded-sm border border-ivory/15"
              >
                <iframe
                  title="Office Location Map"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0 min-h-[340px]"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(buildAddressText(addresses[0]))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                />
              </ScrollReveal>

              <div className="flex flex-col gap-6">
                {addresses.map((addr, i) => {
                  const text = buildAddressText(addr);
                  return (
                    <ScrollReveal
                      key={addr.id}
                      variant="right"
                      delay={i * 120}
                      className="rounded-sm border border-ivory/12 bg-ivory/[0.04] p-7"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-ivory">
                          <MapPin size={20} weight="fill" />
                        </span>
                        <div>
                          <h3 className="font-heading text-xl text-ivory">{addr.label}</h3>
                          {text && (
                            <a
                              href={buildMapsHref(text)}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 block font-sans text-sm leading-relaxed text-ivory/65 transition hover:text-gold"
                            >
                              {text}
                            </a>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
