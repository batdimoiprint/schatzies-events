import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const organizerNavItems = [
  { label: 'Dashboard', to: '/organizer', icon: '/Pictures/organizerpics/dashboard 2.png' },
  {
    label: 'Calendar',
    to: '/organizer/calendar',
    icon: '/Pictures/organizerpics/Timeline Vector calendar.png',
  },
  {
    label: 'Event Planner',
    to: '/organizer/event-planner',
    icon: '/Pictures/organizerpics/event planner.png',
  },
  {
    label: 'Event Manager',
    to: '/organizer/event-manager',
    icon: '/Pictures/organizerpics/event manager.png',
  },
  {
    label: 'RSVP',
    to: '/organizer/rsvp',
    icon: '/Pictures/organizerpics/RSVP.png',
  },
  {
    label: 'Message',
    to: '/organizer/message',
    icon: '/Pictures/organizerpics/Message.png',
  },
  {
    label: 'Cost Breakdown',
    to: '/organizer/cost-breakdown',
    icon: '/Pictures/organizerpics/Cost Breakdown.png',
  },
];

export type OrganizerLayoutOutletContext = {
  searchTerm: string;
};

export function OrganizerLayout() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf8fd]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-2 animate-spin rounded-full border-r-4 border-t-4 border-transparent border-r-[#8f1fd1] border-t-[#f347a5]" />
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="Schatzies Events logo"
              className="size-20 animate-pulse rounded-full border-4 border-[#df2b80] object-cover shadow-[0_0_20px_rgba(223,43,128,0.4)]"
            />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#8f1fd1] animate-pulse">
            Loading Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ORGANIZER') {
    return <Navigate to="/login" replace />;
  }

  /* Shared navigation content */
  const navContent = (isMobile: boolean) => (
    <>
      <div className="w-full shrink-0">
        <div className="flex flex-col items-center px-5 pb-4 pt-4">
          <div
            className={[
              'flex w-full items-center justify-center transition-all duration-300',
              isMobile || isSidebarOpen ? 'gap-3' : 'gap-0',
            ].join(' ')}
          >
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="CSE logo"
              className="size-12 shrink-0 rounded-full border-2 border-[#df2b80] bg-white object-cover"
            />
            <div
              className={[
                'flex flex-col justify-center overflow-hidden leading-tight transition-all duration-300',
                isMobile || isSidebarOpen ? 'max-w-30 opacity-100' : 'max-w-0 opacity-0',
              ].join(' ')}
            >
              <p className="font-heading whitespace-nowrap text-base font-bold text-[#df2b80]">
                Schatzies
              </p>
              <p className="font-heading whitespace-nowrap text-base font-bold text-[#9a1eb9]">
                Events
              </p>
            </div>
          </div>
          <p
            className={[
              'mt-3 overflow-hidden text-center text-xs font-semibold tracking-wide text-[#7f7889] transition-all duration-300',
              isMobile || isSidebarOpen ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0',
            ].join(' ')}
          >
            Your <span className="text-[#df2b80]">MOST TRUSTED</span> team!
          </p>
        </div>
      </div>

      <nav
        className={`flex flex-col flex-1 overflow-y-auto pb-5 ${isMobile || isSidebarOpen ? 'gap-2 px-4' : 'gap-2 px-3 items-center'}`}
      >
        {organizerNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!isMobile && !isSidebarOpen ? item.label : undefined}
            className={({ isActive }) => {
              return [
                'group flex items-center rounded-xl py-3 text-[15px] font-semibold transition-all duration-200 ease-in-out',
                isMobile || isSidebarOpen
                  ? 'w-full justify-start gap-3 px-4'
                  : 'size-11 justify-center gap-0 px-0',
                isActive
                  ? 'bg-gradient-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_10px_20px_rgba(187,54,194,0.28)]'
                  : 'text-[#4f4a56] hover:bg-[#f0e8f5] hover:text-[#8f1fd0] hover:translate-x-1',
              ].join(' ');
            }}
            end={item.to === '/organizer'}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="size-4.5 shrink-0 object-contain transition-all duration-200"
            />
            <span
              className={[
                'whitespace-nowrap overflow-hidden transition-all duration-200',
                isMobile || isSidebarOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0',
              ].join(' ')}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fbf8fd]">
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside
        className={[
          'hidden md:flex relative flex-col z-40 bg-white transition-all duration-300 ease-in-out shrink-0 border-r border-[#ece7f2] h-full',
          isSidebarOpen ? 'w-[250px]' : 'w-20 items-center',
        ].join(' ')}
      >
        <div
          className={`flex w-full pt-3 pb-1 ${isSidebarOpen ? 'justify-end px-3' : 'justify-center'}`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#3d2052] transition-colors hover:bg-[#fdf2f8]"
          >
            <Menu className="size-7 stroke-[2.5]" />
          </button>
        </div>

        {navContent(false)}
      </aside>

      {/* ── Mobile hamburger button (visible only on mobile) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-3 z-50 flex size-10 items-center justify-center rounded-lg bg-white text-[#3d2052] shadow-md md:hidden"
      >
        <Menu className="size-6 stroke-[2.5]" />
      </button>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 animate-in fade-in duration-300"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex h-full w-[260px] flex-col bg-white shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex w-full justify-end px-3 pt-3 pb-1">
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

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        <AdminTopBar profilePath="/organizer/profile" />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <Outlet context={{ searchTerm: '' }} />
        </main>
      </div>
    </div>
  );
}
