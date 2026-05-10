import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  NotebookPen,
  Wallet,
  Briefcase,
  UsersRound,
  UserCheck,
  MailQuestion,
  MessageSquareDotIcon,
  DatabaseBackup,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const adminNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Inquiries', to: '/admin/inquiries', icon: MailQuestion },
  { label: 'Message', to: '/admin/message', icon: MessageSquareDotIcon },
  { label: 'Event Manager', to: '/admin/event-manager', icon: CalendarCheck },
  { label: 'Event Planner', to: '/admin/event-planner', icon: NotebookPen },
  { label: 'RSVP', to: '/admin/rsvp', icon: UserCheck },
  { label: 'User Management', to: '/admin/users', icon: UsersRound },
  { label: 'Calendar', to: '/admin/calendar', icon: Calendar },
  { label: 'Cost Breakdown', to: '/admin/costs', icon: Wallet },
  { label: 'Vendor Pool', to: '/admin/vendors', icon: Briefcase },
  { label: 'Data Backup', to: '/admin/data-backup', icon: DatabaseBackup },
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
              className="size-12 rounded-full border-2 border-[#df2b80] bg-white object-cover"
            />
            <div className="leading-tight">
              <p className="font-heading text-base font-bold text-[#df2b80]">Admin</p>
              <p className="font-heading text-base font-bold text-[#9a1eb9]">Panel</p>
            </div>
          </div>
        ) : (
          <div className="size-10 overflow-hidden rounded-full border-2 border-[#df2b80] bg-white">
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="Admin logo"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {(isMobile || expanded) && (
          <p className="mt-3 text-center text-xs font-semibold tracking-wide text-[#7f7889]">
            Your <span className="text-[#df2b80]">ADMIN</span> dashboard!
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
                      ? 'bg-gradient-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_10px_20px_rgba(187,54,194,0.28)]'
                      : 'text-[#4f4a56] hover:bg-[#f0e8f5] hover:text-[#8f1fd0] hover:translate-x-1',
                  ].join(' ')
                : [
                    'flex size-10 items-center justify-center rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-to-b from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_6px_16px_rgba(187,54,194,0.3)]'
                      : 'text-[#6b6279] hover:bg-[#f0e8f5] hover:text-[#8f1fd0]',
                  ].join(' ')
            }
          >
            <item.icon className="size-[18px] shrink-0 transition-all duration-200" />
            {(isMobile || expanded) && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        className={`shrink-0 border-t border-[#ece7f2] py-3 ${
          isMobile || expanded ? 'px-3' : 'flex justify-center px-2'
        }`}
      >
        {isMobile || expanded ? (
          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7e9f1] px-4 py-3 text-[15px] font-semibold text-[#8f1fd1] hover:bg-[#efd8e6]"
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
            className="size-10 rounded-xl text-[#8f1fd1] hover:bg-[#f7e9f1]"
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
        className={`hidden md:flex h-full shrink-0 flex-col border-r border-[#ece7f2] bg-white transition-all duration-200 ${
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
            className="size-11 shrink-0 text-[#3d2052] hover:bg-[#fdf2f8]"
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
        className="fixed left-3 top-3 z-40 flex size-10 items-center justify-center rounded-lg bg-white text-[#3d2052] shadow-md md:hidden"
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
                className="size-11 shrink-0 text-[#3d2052] hover:bg-[#fdf2f8]"
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
