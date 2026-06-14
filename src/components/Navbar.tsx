import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const navMenuItems = [
  { label: 'Home', href: '/' },
  { label: 'Events Packages', href: '/event-packages' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/70 bg-ivory/90 shadow-sm shadow-ink/5 backdrop-blur-md'
          : 'border-b border-transparent bg-ivory/80 backdrop-blur-md'
      )}
    >
      <div className="page-gutter">
        {/* Desktop */}
        <div className="hidden h-20 grid-cols-[1fr_auto_1fr] items-center lg:grid">
          <Link to="/" className="flex w-fit items-center gap-3">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="flex items-center gap-9">
            {navMenuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group relative font-ui text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-300',
                  isActive(item.href) ? 'text-brand' : 'text-ink/70 hover:text-brand'
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute -bottom-2 left-1/2 h-px -translate-x-1/2 bg-brand transition-all duration-300',
                    isActive(item.href) ? 'w-5' : 'w-0 group-hover:w-5'
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end">
            <span className="font-heading text-[0.7rem] tracking-[0.28em] text-gold uppercase italic">
              Est. 2011
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-11 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center text-ink transition hover:text-brand"
          >
            {mobileOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile editorial drawer */}
      <div
        className={cn(
          'grain relative overflow-hidden bg-ink text-ivory transition-all duration-500 lg:hidden',
          mobileOpen ? 'max-h-[90vh] border-t border-gold/30' : 'max-h-0'
        )}
      >
        <div className="page-gutter flex flex-col gap-1 py-8">
          <p className="eyebrow mb-4 text-gold">The House of Schatzies</p>
          {navMenuItems.map((item, i) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ transitionDelay: mobileOpen ? `${i * 60 + 100}ms` : '0ms' }}
              className={cn(
                'border-b border-ivory/10 py-4 font-heading text-3xl transition-all duration-500',
                mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                isActive(item.href) ? 'text-gold italic' : 'text-ivory'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
