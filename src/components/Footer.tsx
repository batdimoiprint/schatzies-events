import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-ink text-ivory">
      <div className="rule-gold" />
      <div className="page-gutter relative z-10 mx-auto max-w-[1400px] py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_0.9fr]">
          {/* Brand */}
          <div>
            <p className="eyebrow text-gold">Est. 2011 — Philippines</p>
            <h3 className="mt-4 font-heading text-4xl leading-none text-ivory">
              Schatzies <span className="italic text-gold">Events</span>
            </h3>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ivory/60">
              Creating unforgettable moments and turning your dream events into reality with
              precision, passion, and perfection.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow text-ivory/40">Contact</h4>
            <ul className="mt-6 space-y-4 font-sans text-sm text-ivory/75">
              <li className="flex items-start gap-3">
                <MapPin size={17} weight="fill" className="mt-0.5 shrink-0 text-gold" />
                <a
                  href="https://www.google.com/maps/search/27+Novaliches+Mendoza+Village+Project+8+Quezon+City"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-gold"
                >
                  27 Novaliches Mendoza Village Project 8 Quezon City
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} weight="fill" className="shrink-0 text-gold" />
                <a href="tel:+639333807868" className="transition hover:text-gold">
                  +63 933 380 7868 / 917 502 3538
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={17} weight="fill" className="shrink-0 text-gold" />
                <a
                  href="mailto:schatziesevents@gmail.com"
                  className="break-all transition hover:text-gold"
                >
                  schatziesevents@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
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
          <div>
            <h4 className="eyebrow text-ivory/40">Follow</h4>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/debutandweddingpackage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-all hover:border-gold hover:bg-gold hover:text-ink"
              >
                <FacebookLogo size={20} weight="fill" />
              </a>
              <a
                href="https://www.instagram.com/schatziesevents25/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-all hover:border-gold hover:bg-gold hover:text-ink"
              >
                <InstagramLogo size={20} weight="fill" />
              </a>
            </div>
            <a
              href="https://www.facebook.com/debutandweddingpackage"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2 font-ui text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase"
            >
              Enquire Now
              <ArrowUpRight
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
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
