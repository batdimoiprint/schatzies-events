interface FooterProps {
  showScrollTop?: boolean;
}

const Footer = ({ showScrollTop = true }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#f8d0e3] to-[#f5c3d9] pt-12 pb-6 lg:pt-16 lg:pb-8">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events logo"
              className="h-16 w-auto lg:h-20"
            />
            <p className="text-sm text-[#3d2052] leading-relaxed">
              Creating unforgettable moments and turning your dream events into reality with
              precision, passion, and perfection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#1a1225] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#3d2052]">
              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#1a1225] mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-[#3d2052]">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  +63 912 345 6789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="hover:text-[#e61f83] transition-colors"
                >
                  hello@schatziesevents.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#1a1225] mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-[#3d2052] transition-all hover:bg-[#e61f83] hover:text-white hover:shadow-md"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-[#3d2052] transition-all hover:bg-[#e61f83] hover:text-white hover:shadow-md"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="18.5" y1="5.5" x2="18.5" y2="5.5" />
                </svg>
              </a>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-[#3d2052] transition-all hover:bg-[#e61f83] hover:text-white hover:shadow-md"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V9.47a6.33 6.33 0 003.76 1.13 6.34 6.34 0 003.46-1.03v-3.8a4.79 4.79 0 01-2.88 1.05z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#c2649b]/50 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-[#3d2052] md:flex-row">
          <p>© {currentYear} Schatzies Events Management. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="hover:text-[#e61f83] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="hover:text-[#e61f83] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-md transition-all hover:bg-pink-200 hover:text-gray-700 hover:shadow-lg active:scale-95 lg:bottom-8 lg:right-8 lg:h-12 lg:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 lg:h-6 lg:w-6"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </footer>
  );
};

export default Footer;
