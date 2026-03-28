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

  return (
    <header className="relative z-20 w-full border-b border-transparent">
      <div className="flex w-full items-center px-12 py-4 lg:px-20">
        {/* Logo — far LEFT */}
        <Link to="/" className="shrink-0">
          <img src={logoImagePath} alt="Schatzies Events logo" className="h-[140px] w-auto" />
        </Link>

        {/* Spacer pushes nav+button to the right */}
        <div className="flex-1" />

        {/* Nav items — RIGHT side */}
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

        {/* Double gap between Contact and LOGIN */}
        <div className="hidden w-28 lg:block xl:w-32" />

        {/* LOGIN button — far RIGHT */}
        <Button
          asChild
          className="hidden h-[52px] min-w-[140px] shrink-0 rounded-3xl bg-gradient-to-b from-[#FF589C] to-[#700F81] px-10 text-[1.05rem] font-bold tracking-wide uppercase shadow-[0_8px_22px_rgba(39,21,57,0.4)] hover:brightness-110 lg:inline-flex"
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
