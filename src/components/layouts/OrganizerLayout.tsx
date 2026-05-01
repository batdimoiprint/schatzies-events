import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { useAuth } from '@/hooks/useAuth';

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

  return (
    <div className="min-h-screen bg-[#fbf8fd]">
      <div className="flex h-full flex-col md:flex-row">
        <aside
          className={[
            'relative w-full border-b border-[#ece7f2] bg-white md:h-full md:border-b-0 md:border-r',
            'transition-all duration-300 ease-in-out',
            isSidebarOpen ? 'md:w-62' : 'md:w-20',
          ].join(' ')}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3.5 top-9 z-50 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#f6f5f8] bg-linear-to-b from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_4px_12px_rgba(187,54,194,0.4)] transition-all duration-200 hover:scale-110"
            type="button"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>

          <div className="w-full">
            <div className="flex flex-col items-center px-5 pb-4 pt-6">
              <div
                className={[
                  'flex w-full items-center justify-center transition-all duration-300',
                  isSidebarOpen ? 'gap-3' : 'gap-0',
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
                    isSidebarOpen ? 'max-w-30 opacity-100' : 'max-w-0 opacity-0',
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
                  isSidebarOpen ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0',
                ].join(' ')}
              >
                Your <span className="text-[#df2b80]">MOST TRUSTED</span> team!
              </p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-3 pb-5 md:flex-col md:overflow-visible">
            {organizerNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => {
                  return [
                    'group flex items-center rounded-xl py-3 text-[15px] font-semibold transition-all duration-200 ease-in-out',
                    isSidebarOpen
                      ? 'min-w-42.5 justify-start gap-3 px-4'
                      : 'min-w-0 justify-center gap-0 px-3',
                    isActive
                      ? 'bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_10px_20px_rgba(187,54,194,0.28)]'
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
                    isSidebarOpen ? 'max-w-35 opacity-100' : 'max-w-0 opacity-0',
                  ].join(' ')}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminTopBar profilePath="/organizer/profile" />
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet context={{ searchTerm: '' }} />
          </main>
        </div>
      </div>
    </div>
  );
}
