import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Events Packages', href: '/event-packages' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

const otherEvents = [
  { label: 'Wedding Events', href: '/event-packages?type=wedding' },
  { label: 'Debut Events', href: '/event-packages?type=debut' },
];

const logoImagePath = '/Pictures/business-logo.png';

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
              ? 'relative pb-1 text-[1.2rem] font-semibold text-[#FF0066] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF0066] after:origin-left after:scale-x-100 transition-all duration-300'
              : 'relative pb-1 text-[1.2rem] font-semibold text-[#4A1053] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF0066] after:origin-left after:scale-x-0 hover:text-[#FF0066] hover:after:scale-x-100 after:transition-transform after:duration-300 transition-colors duration-300';

            if (item.label === 'Events Packages') {
              return (
                <Popover key={item.label} open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button className={classes}>
                      {item.label}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0">
                    <div className="flex flex-col">
                      <Link
                        to={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="group relative px-4 py-3 text-sm font-semibold overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF0066] hover:to-[#4A1053]"
                      >
                        <span
                          className="transition-all duration-300"
                          style={{
                            backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          All Packages
                        </span>
                        <span
                          className="absolute inset-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: 'white' }}
                        >
                          All Packages
                        </span>
                      </Link>
                      {otherEvents.map((event) => (
                        <Link
                          key={event.label}
                          to={event.href}
                          onClick={() => setDropdownOpen(false)}
                          className="group relative px-4 py-3 text-sm font-semibold overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF0066] hover:to-[#4A1053]"
                        >
                          <span
                            className="transition-all duration-300"
                            style={{
                              backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                            }}
                          >
                            {event.label}
                          </span>
                          <span
                            className="absolute inset-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ color: 'white' }}
                          >
                            {event.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

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
          className="hidden h-[52px] min-w-[140px] shrink-0 rounded-full bg-white px-10 text-[1.2rem] font-bold tracking-wide uppercase shadow-[0_8px_22px_rgba(39,21,57,0.2)] hover:bg-gray-100 hover:shadow-lg lg:inline-flex"
        >
          <Link to="/login">
            <span
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Login
            </span>
          </Link>
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

      {/* ── Right-side mobile drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[75vw] max-w-[320px] flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(160deg, #4A1053 0%, #7B1F8C 35%, #FF0066 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute bottom-20 -right-8 h-52 w-52 rounded-full bg-[#FF0066]/20 blur-3xl" />

        {/* Header row */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <img
            src={logoImagePath}
            alt="Schatzies Events"
            className="h-14 w-auto brightness-0 invert"
          />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/20" />

        {/* Nav links */}
        <nav className="mt-4 flex flex-col gap-1 px-4">
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
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[1.1rem] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {/* Active indicator dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all ${isActive ? 'bg-white' : 'bg-transparent'}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Login button */}
        <div className="px-6 pb-10">
          <div className="mb-3 h-px bg-white/20" />
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-[1.1rem] font-bold uppercase tracking-wide shadow-lg transition hover:bg-white/90"
            style={{
              backgroundImage: 'none',
            }}
          >
            <span
              style={{
                backgroundImage: 'linear-gradient(to right, #FF0066 0%, #4A1053 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Login
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
