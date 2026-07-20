import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { useBusinessContact } from '@/hooks/useBusinessContact';
import { useContent, renderContentText } from '@/hooks/useContent';

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: contact } = useBusinessContact();
  const { sections } = useContent('footer');

  const brandTitle = sections.brand?.title ?? 'Schatzies *Events*';
  const brandBody = sections.brand?.body ?? 'Creating unforgettable moments and turning your dream events into reality with precision, passion, and perfection.';

  const firstAddress = contact?.addresses?.[0];
  const addressText = firstAddress
    ? [
        firstAddress.street,
        firstAddress.barangay,
        firstAddress.city,
        firstAddress.province,
      ]
        .filter(Boolean)
        .join(', ')
    : null;

  const allPhones = contact?.phones ?? [];
  const phoneDisplay = allPhones
    .map((p) => {
      const raw = p.number.replace(/\D/g, '');
      return raw.length === 11 && raw.startsWith('09')
        ? `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`
        : p.number;
    })
    .join(' / ');
  const firstPhone = allPhones[0];

  const firstEmail = contact?.emails?.[0];

  const facebookLink = contact?.links?.find((l) =>
    (l.platform ?? l.label).toLowerCase().includes('facebook')
  );
  const instagramLink = contact?.links?.find((l) =>
    (l.platform ?? l.label).toLowerCase().includes('instagram')
  );


  return (
    <footer className="grain relative overflow-hidden bg-black text-ivory">
      {/* Particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-brand/35 rounded-full animate-float-slow" />
        <div className="absolute top-[40%] left-[25%] w-1.5 h-1.5 bg-brand/55 rounded-full animate-float-medium" />
        <div className="absolute top-[75%] left-[15%] w-3 h-3 bg-brand/25 rounded-full animate-float-fast" />
        <div className="absolute top-[20%] left-[50%] w-2 h-2 bg-brand/45 rounded-full animate-float-slow" />
        <div className="absolute top-[65%] left-[45%] w-1.5 h-1.5 bg-brand/55 rounded-full animate-float-medium" />
        <div className="absolute top-[85%] left-[60%] w-2 h-2 bg-brand/35 rounded-full animate-float-slow" />
        <div className="absolute top-[30%] left-[75%] w-3 h-3 bg-brand/25 rounded-full animate-float-fast" />
        <div className="absolute top-[80%] left-[85%] w-1.5 h-1.5 bg-brand/45 rounded-full animate-float-medium" />
        <div className="absolute top-[15%] left-[85%] w-2 h-2 bg-brand/35 rounded-full animate-float-slow" />
      </div>
      <div className="rule-gold" />
      <div className="page-gutter relative z-10 mx-auto max-w-[1400px] py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr] text-center lg:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="mt-4 font-heading text-4xl leading-none text-ivory">
              {renderContentText(brandTitle, 'italic text-gold')}
            </h3>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ivory/60 mx-auto lg:mx-0">
              {brandBody}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="eyebrow text-ivory/40">Contact</h4>
            <ul className="mt-6 space-y-4 font-sans text-sm text-ivory/75 w-full">
              {addressText && (
                <li className="flex items-start justify-center lg:justify-start gap-3">
                  <MapPin size={17} weight="fill" className="mt-0.5 shrink-0 text-gold" />
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(addressText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-gold"
                  >
                    {addressText}
                  </a>
                </li>
              )}
              {phoneDisplay && firstPhone && (
                <li className="flex items-center justify-center lg:justify-start gap-3">
                  <Phone size={17} weight="fill" className="shrink-0 text-gold" />
                  <a
                    href={`tel:${firstPhone.number.replace(/\s/g, '')}`}
                    className="transition hover:text-gold"
                  >
                    {phoneDisplay}
                  </a>
                </li>
              )}
              {firstEmail && (
                <li className="flex items-center justify-center lg:justify-start gap-3">
                  <EnvelopeSimple size={17} weight="fill" className="shrink-0 text-gold" />
                  <a
                    href={`mailto:${firstEmail.email}`}
                    className="break-all transition hover:text-gold"
                  >
                    {firstEmail.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="eyebrow text-ivory/40">Explore</h4>
            <ul className="mt-6 space-y-3 font-sans text-sm text-ivory/75">
              {[
                { label: 'Event Packages', href: '/event-packages' },
                { label: 'Services', href: '/services' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'About Us', href: '/about-us' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="eyebrow text-ivory/40">Follow</h4>
            <div className="mt-6 flex gap-3 justify-center lg:justify-start">
              {facebookLink && (
                <a
                  href={facebookLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-all hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <FacebookLogo size={20} weight="fill" />
                </a>
              )}
              {instagramLink && (
                <a
                  href={instagramLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-all hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <InstagramLogo size={20} weight="fill" />
                </a>
              )}
            </div>
            {(facebookLink || firstEmail) && (
              <a
                href={facebookLink?.url ?? `mailto:${firstEmail?.email}`}
                target={facebookLink ? '_blank' : undefined}
                rel={facebookLink ? 'noopener noreferrer' : undefined}
                className="group mt-7 inline-flex items-center justify-center lg:justify-start gap-2 font-ui text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase w-fit mx-auto lg:mx-0"
              >
                Inquire Now
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-7 sm:flex-row">
          <p className="font-ui text-xs tracking-[0.1em] text-ivory/45">
            © {currentYear} Schatzies Events Management. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-ui text-xs text-ivory/45">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="transition hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
