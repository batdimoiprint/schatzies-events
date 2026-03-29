import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Events Packages', href: '/event-packages' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

const logoImagePath = '/Pictures/business-logo.png';

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-20 w-full border-b border-transparent">
      <div className="flex w-full items-center px-5 py-3 sm:px-8 md:px-12 md:py-4 lg:px-20">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src={logoImagePath}
            alt="Schatzies Events logo"
            className="h-20 w-auto sm:h-24 md:h-[140px]"
          />
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-16 lg:flex xl:gap-20">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href) && item.href !== '#';

            const classes = isActive
              ? 'text-[1.05rem] font-semibold text-[#e61f83]'
              : 'text-[1.05rem] font-semibold text-[#1a1a1a] transition-colors hover:text-[#e61f83]';

            return item.href === '#' ? (
              <span key={item.label} className={classes}>
                {item.label}
              </span>
            ) : (
              <Link key={item.label} to={item.href} className={classes}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop gap + LOGIN button */}
        <div className="hidden w-28 lg:block xl:w-32" />
        <Button
          asChild
          className="hidden h-[52px] min-w-[140px] shrink-0 rounded-3xl bg-gradient-to-b from-[#FF589C] to-[#700F81] px-10 text-[1.05rem] font-bold tracking-wide uppercase shadow-[0_8px_22px_rgba(39,21,57,0.4)] hover:brightness-110 lg:inline-flex"
        >
          <Link to="/login">Login</Link>
        </Button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#3d2052] transition hover:bg-gray-100 lg:hidden"
        >
          {mobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-5 pb-5 pt-3 shadow-lg lg:hidden">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-[1rem] font-semibold transition ${
                  isActive
                    ? 'bg-[#fff0f6] text-[#e61f83]'
                    : 'text-[#1a1a1a] hover:bg-gray-50 hover:text-[#e61f83]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#FF589C] to-[#700F81] text-[1rem] font-bold tracking-wide text-white uppercase shadow-lg"
          >
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
