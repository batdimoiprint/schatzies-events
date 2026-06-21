import { Phone, EnvelopeSimple, MapPin, FacebookLogo, InstagramLogo, Link as LinkIcon } from '@phosphor-icons/react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useBusinessContact } from '@/hooks/useBusinessContact';
import type { ContactAddress, ContactLink } from '@/api/contacts';

const heroImage = '/Pictures/contact-hero.jpg';

/** Build a single-line text from an address record */
function buildAddressText(a: ContactAddress): string {
  return [a.street, a.barangay, a.city, a.province, a.country, a.zipCode]
    .filter(Boolean)
    .join(', ');
}

/** Return the correct Phosphor icon for a social platform */
function getPlatformIcon(platform?: string) {
  const p = (platform ?? '').toLowerCase();
  if (p.includes('facebook')) return FacebookLogo;
  if (p.includes('instagram')) return InstagramLogo;
  return LinkIcon;
}

/** Get a human-friendly display name for a social link */
function getSocialDisplayName(lnk: ContactLink): string {
  try {
    if (lnk.url.startsWith('http')) {
      const url = new URL(lnk.url);
      const path = url.pathname.replace(/^\/+|\/+$/g, '');
      const host = url.hostname.replace(/^www\./, '');

      if (host.includes('facebook') && path) return `/${path}`;
      if (host.includes('instagram') && path) return `@${path}`;
      if (host.includes('tiktok') && path) return `@${path}`;

      return host;
    }
  } catch {
    // not a valid URL
  }
  return lnk.url;
}

export default function ContactPage() {
  const { data: contact, isLoading } = useBusinessContact();

  const addresses = contact?.addresses ?? [];
  const phones = contact?.phones ?? [];
  const emails = contact?.emails ?? [];
  const links = contact?.links ?? [];

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

      {/* ── Contact Cards Section ── */}
      <section className="bg-gradient-to-b from-ivory via-[#fce4ef]/30 to-ivory py-16 sm:py-20 lg:py-28">
        <div className="page-gutter mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-12 max-w-2xl">
            <p className="eyebrow text-brand">Reach Out</p>
            <h2 className="mt-6 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Start the <span className="italic text-brand">conversation</span>.
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
              Reach out to us through any of these channels and let&rsquo;s start planning your
              dream event.
            </p>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF0066]/30 border-t-[#FF0066]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
              {/* ─── Business Location Card ─── */}
              {addresses.length > 0 && (
                <ScrollReveal variant="up">
                  <div className="h-full rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8 lg:p-10">
                    <h3 className="text-center font-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold text-[#FF0066]">
                      Business Location
                    </h3>
                    <p className="mx-auto mt-3 max-w-[25rem] text-center text-[clamp(0.85rem,1.3vw,1rem)] leading-[1.6] font-sans text-[#4A1053] sm:mt-4">
                      We have dedicated office spaces designed for comfortable consultation.
                    </p>

                    <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 lg:mt-10">
                      {addresses.map((addr) => {
                        const text = buildAddressText(addr);
                        const mapsHref = `https://www.google.com/maps/search/${encodeURIComponent(text)}`;

                        return (
                          <a
                            key={addr.id}
                            href={mapsHref}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 sm:gap-4 lg:gap-5 transition-all hover:opacity-75"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                              <MapPin
                                size={24}
                                weight="fill"
                                className="text-[#FF0066] sm:text-[1.5rem] lg:text-[1.75rem]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                                {addr.label || 'Office'}
                              </p>
                              <p className="mt-0.5 break-words text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                                {text}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* ─── Contact Information Card ─── */}
              {(phones.length > 0 || emails.length > 0 || links.length > 0) && (
                <ScrollReveal variant="up" delay={150}>
                  <div className="h-full rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8 lg:p-10">
                    <h3 className="text-center font-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold text-[#FF0066]">
                      Contact Information
                    </h3>
                    <p className="mx-auto mt-3 max-w-[25rem] text-center text-[clamp(0.85rem,1.3vw,1rem)] leading-[1.6] font-sans text-[#4A1053] sm:mt-4">
                      Reach out to us through any of these channels and let&rsquo;s start planning
                      your dream event.
                    </p>

                    <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 lg:mt-10">
                      {/* Phone Numbers */}
                      {phones.length > 0 && (
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                            <Phone
                              size={24}
                              weight="fill"
                              className="text-[#FF0066] sm:text-[1.5rem] lg:text-[1.75rem]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                              Phone Numbers
                            </p>
                            {phones.map((ph) => (
                              <a
                                key={ph.id}
                                href={`tel:${ph.number.replace(/\s/g, '')}`}
                                className="mt-0.5 block break-all text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem] hover:text-[#FF0066] transition-colors"
                              >
                                {ph.number}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Emails */}
                      {emails.length > 0 && (
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                            <EnvelopeSimple
                              size={24}
                              weight="fill"
                              className="text-[#FF0066] sm:text-[1.5rem] lg:text-[1.75rem]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                              Email
                            </p>
                            {emails.map((em) => (
                              <a
                                key={em.id}
                                href={`mailto:${em.email}`}
                                className="mt-0.5 block break-all text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem] hover:text-[#FF0066] transition-colors"
                              >
                                {em.email}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links (Facebook, Instagram, etc.) */}
                      {links.map((lnk) => {
                        const Icon = getPlatformIcon(lnk.platform);
                        const displayName = getSocialDisplayName(lnk);

                        return (
                          <a
                            key={lnk.id}
                            href={lnk.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 sm:gap-4 lg:gap-5 transition-all hover:opacity-75"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0066]/10 to-[#4A1053]/10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                              <Icon
                                size={24}
                                weight="fill"
                                className="text-[#FF0066] sm:text-[1.5rem] lg:text-[1.75rem]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.9rem] font-bold text-[#FF0066] sm:text-[1rem] lg:text-[1.1rem]">
                                {lnk.label || lnk.platform || 'Link'}
                              </p>
                              <p className="mt-0.5 break-words text-[0.75rem] text-[#4A1053] sm:text-[0.85rem] lg:text-[0.9rem]">
                                {displayName}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
