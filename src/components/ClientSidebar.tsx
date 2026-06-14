import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, ClipboardList, UserCheck, MessageSquare } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const logoImagePath = '/Pictures/business-logo.png';

const clientNavItems = [
  { label: 'Overview', to: '/client', Icon: LayoutDashboard },
  { label: 'Event Plan Viewing', to: '/client/event-plan', Icon: ClipboardList },
  { label: 'RSVP', to: '/client/rsvp', Icon: UserCheck },
  { label: 'Message', to: '/client/message', Icon: MessageSquare },
];

export function ClientSidebar() {
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('clientSidebarExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleExpanded = () => {
    setExpanded((v) => {
      const next = !v;
      localStorage.setItem('clientSidebarExpanded', String(next));
      return next;
    });
  };

  /* Shared nav content */
  const navContent = (isMobile: boolean) => (
    <>
      {/* Logo area */}
      <div className="flex h-36 w-full shrink-0 flex-col items-center justify-start px-5 pt-3">
        {isMobile || expanded ? (
          <>
            <img src={logoImagePath} alt="Schatzies Events logo" className="h-24 w-auto" />
            <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground">
              Your <span className="font-bold text-brand">MOST TRUSTED</span> team!
            </p>
          </>
        ) : (
          <div className="size-10 overflow-hidden rounded-full border-2 border-brand bg-white">
            <img
              src={logoImagePath}
              alt="Schatzies Events"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={`mt-6 flex w-full flex-col pb-5 ${isMobile || expanded ? '' : 'items-center gap-1.5 px-2'}`}
      >
        {clientNavItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/client'}
            title={!isMobile && !expanded ? label : undefined}
            className={({ isActive }) =>
              isMobile || expanded
                ? [
                    'flex w-full items-center gap-4 px-6 py-3 text-[15px] font-semibold transition-colors',
                    isActive
                      ? 'bg-gradient-brand text-white'
                      : 'text-foreground/75 hover:bg-brand/5 hover:text-brand',
                  ].join(' ')
                : [
                    'flex size-10 items-center justify-center rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-brand text-white shadow-[0_6px_16px_rgba(187,54,194,0.3)]'
                      : 'text-muted-foreground hover:bg-brand/5 hover:text-brand',
                  ].join(' ')
            }
          >
            <Icon size={20} className="shrink-0" />
            {(isMobile || expanded) && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside
        className={`hidden md:flex h-full shrink-0 flex-col border-r border-border bg-white transition-all duration-200 ${
          expanded ? 'w-64' : 'w-16 items-center'
        }`}
      >
        {/* Hamburger */}
        <div
          className={`flex w-full pt-3 pb-1 ${expanded ? 'justify-end px-3' : 'justify-center'}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleExpanded()}
            aria-label="Toggle sidebar"
            className="size-11 shrink-0 text-brand-deep hover:bg-brand/5"
          >
            <Menu className="size-7 stroke-[2.5]" />
          </Button>
        </div>
        {navContent(false)}
      </aside>

      {/* ── Mobile hamburger button (visible only on mobile) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-3 z-40 flex size-10 items-center justify-center rounded-lg bg-white text-brand-deep shadow-md md:hidden"
      >
        <Menu className="size-6 stroke-[2.5]" />
      </button>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <aside className="relative z-10 flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="flex w-full justify-end px-3 pt-3 pb-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="size-11 shrink-0 text-brand-deep hover:bg-brand/5"
              >
                <X className="size-7 stroke-[2.5]" />
              </Button>
            </div>
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
