import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';

const navMenuItems = [
  { label: 'Home', href: '/' },
  { label: 'Events Packages', href: '/event-packages' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      <div className="page-gutter mx-auto w-full max-w-[1400px]">
        {/* Desktop */}
        <div className="hidden h-20 items-center justify-between md:flex">
          <Link to="/" className="flex w-fit items-center gap-3">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          <div className="flex items-center gap-4 lg:gap-9">
            {navMenuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.scrollTo(0, 0)}
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
        </div>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link to="/">
            <img
              src="/Pictures/business-logo.png"
              alt="Schatzies Events"
              className="h-11 w-auto object-contain"
            />
          </Link>
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center text-ink transition hover:text-brand"
              >
                <List size={24} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="grain bg-ink text-ivory border-l border-gold/30 p-0 w-[280px] sm:w-[350px] z-[9999]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 py-8 px-6 mt-12 overflow-y-auto h-full">
                <p className="eyebrow mb-4 text-gold">The House of Schatzies</p>
                {navMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      setMobileOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className={cn(
                      'border-b border-ivory/10 py-4 font-heading text-3xl transition-all duration-300',
                      isActive(item.href) ? 'text-gold italic' : 'text-ivory'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
