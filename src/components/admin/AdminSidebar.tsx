import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Images, Package, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const adminNavItems = [
  { label: 'Event Packages', to: '/admin', icon: Package },
  { label: 'Business Profile', to: '/admin/business-profile', icon: Building2 },
  { label: 'Gallery', to: '/admin/gallery', icon: Images },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleExpanded = () => {
    setExpanded((v) => {
      const next = !v;
      localStorage.setItem('adminSidebarExpanded', String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  /* ── Shared nav content ── */
  const navContent = (isMobile: boolean) => (
    <>
      {/* Logo area */}
      <div className="flex w-full shrink-0 flex-col items-center justify-start px-5 pt-3 pb-2">
        {isMobile || expanded ? (
          <div className="flex items-center gap-3">
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="Admin logo"
              className="size-12 rounded-full border-2 border-brand bg-white object-cover"
            />
            <div className="leading-tight">
              <p className="font-heading text-base font-bold text-brand">Admin</p>
              <p className="font-heading text-base font-bold text-brand-deep">Panel</p>
            </div>
          </div>
        ) : (
          <div className="size-10 overflow-hidden rounded-full border-2 border-brand bg-white">
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="Admin logo"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {(isMobile || expanded) && (
          <p className="mt-3 text-center text-xs font-semibold tracking-wide text-muted-foreground">
            Your <span className="text-brand">ADMIN</span> dashboard!
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={`flex flex-1 w-full flex-col overflow-y-auto pb-3 ${
          isMobile || expanded ? 'gap-0.5 px-3' : 'items-center gap-1.5 px-2'
        }`}
      >
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            title={!isMobile && !expanded ? item.label : undefined}
            className={({ isActive }) =>
              isMobile || expanded
                ? [
                    'group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-all duration-200 ease-in-out',
                    isActive
                      ? 'bg-gradient-brand text-white shadow-[0_10px_20px_rgba(187,54,194,0.28)]'
                      : 'text-foreground/75 hover:bg-brand/5 hover:text-brand-deep hover:translate-x-1',
                  ].join(' ')
                : [
                    'flex size-10 items-center justify-center rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-brand text-white shadow-[0_6px_16px_rgba(187,54,194,0.3)]'
                      : 'text-muted-foreground hover:bg-brand/5 hover:text-brand-deep',
                  ].join(' ')
            }
          >
            <item.icon className="size-[18px] shrink-0 transition-all duration-200" />
            {(isMobile || expanded) && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        className={`shrink-0 border-t border-border py-3 ${
          isMobile || expanded ? 'px-3' : 'flex justify-center px-2'
        }`}
      >
        {isMobile || expanded ? (
          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand/10 px-4 py-3 text-[15px] font-semibold text-brand-deep hover:bg-brand/15"
          >
            <LogOut className="size-4.5" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="ghost"
            size="icon"
            title={isLoggingOut ? 'Logging out...' : 'Logout'}
            className="size-10 rounded-xl text-brand-deep hover:bg-brand/10"
          >
            <LogOut className="size-[18px]" />
          </Button>
        )}
      </div>
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
        {/* Hamburger toggle */}
        <div
          className={`flex w-full shrink-0 pt-3 pb-1 ${
            expanded ? 'justify-end px-3' : 'justify-center'
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
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
            <div className="flex w-full shrink-0 justify-end px-3 pt-3 pb-1">
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
