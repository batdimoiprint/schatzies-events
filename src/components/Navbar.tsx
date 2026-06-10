import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navMenuItems = [
  { label: 'Home', href: '/' },
  { label: 'Events Packages', href: '/event-packages' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 lg:py-6">
      <div className="px-6 sm:px-8 lg:px-[4%] w-full">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between relative h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/Pictures/business-logo.png" 
                alt="Schatzies Events" 
                className="h-20 lg:h-24 w-auto object-contain transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Centered Menu Pill */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full px-12 py-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-10">
              {navMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-[15px] font-semibold transition-colors duration-200 ${
                    isActive(item.href) 
                      ? 'text-[#FF0066]' 
                      : 'text-[#1E002C] hover:text-[#FF0066]'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img 
              src="/Pictures/business-logo.png" 
              alt="Schatzies Events" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <svg
              className="h-6 w-6 text-[#1E002C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 lg:hidden">
            <div className="flex flex-col gap-4">
              {navMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(item.href)
                      ? 'text-[#FF0066]'
                      : 'text-[#1E002C] hover:text-[#FF0066]'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
