import { Search } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const organizerNavItems = [
  { label: 'Dashboard', to: '/organizer', icon: '/Pictures/organizerpics/dashboard.png' },
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
  { label: 'RSVP', to: '/organizer/rsvp', icon: '/Pictures/organizerpics/RSVP.png' },
  {
    label: 'Cost Breakdown',
    to: '/organizer/cost-breakdown',
    icon: '/Pictures/organizerpics/Cost Breakdown.png',
  },
];

const pageTitles: Record<string, string> = {
  '/organizer': 'Dashboard',
  '/organizer/calendar': 'Calendar',
  '/organizer/event-planner': 'Event Planner',
  '/organizer/event-manager': 'Event Manager',
  '/organizer/rsvp': 'RSVP',
  '/organizer/cost-breakdown': 'Cost Breakdown',
};

const pageDescriptions: Record<string, string> = {
  '/organizer': "Shows the overview of the Schatzies Events' performance",
  '/organizer/calendar': 'Shows marked dates, bookings, meetings, and reminders.',
  '/organizer/event-planner': 'Planning and organization of the overall event',
  '/organizer/event-manager': 'Manages the list of the events completed',
  '/organizer/rsvp': 'Helps organizer to plan, allocate resources, schedule and confirm the event.',
  '/organizer/cost-breakdown': 'Displays cost and budget breakdown of an event or services',
};

export function OrganizerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const location = useLocation();
  const showHeaderSearch = location.pathname === '/organizer/event-planner';

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f5f8]">
        <p className="text-base font-semibold text-[#4f4b57]">Loading organizer workspace...</p>
      </div>
    );
  }

  //if (!isAuthenticated || user?.role !== 'ORGANIZER') {
  //  return <Navigate to="/login" replace />;
  //  }

  const currentPageTitle = pageTitles[location.pathname] ?? 'Organizer Workspace';
  const currentPageDescription = pageDescriptions[location.pathname] ?? '';

  return (
    //dito  yung sa may sidebar bandang logo at text.
    <div className="h-screen bg-[#f6f5f8]">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full border-b border-[#ece7f2] bg-white md:h-full md:w-62 md:border-b-0 md:border-r">
          <div className="flex flex-col items-center px-5 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <img
                src="/Pictures/organizerpics/Logo.png.png"
                alt="CSE logo"
                className="size-12 rounded-full border-2 border-[#df2b80] bg-white object-cover"
              />
              <div className="leading-tight">
                <p className="font-heading text-base font-bold text-[#df2b80]">Schatzies</p>
                <p className="font-heading text-base font-bold text-[#9a1eb9]">Events</p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-semibold tracking-wide text-[#7f7889]">
              Your <span className="text-[#df2b80]">MOST TRUSTED</span> team!
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-3 pb-5 md:flex-col md:overflow-visible">
            {organizerNavItems.map((item) => {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => {
                    return [
                      'group flex min-w-42.5 items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition-all duration-200 ease-in-out',
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
                    className="size-4.5 object-contain transition-all duration-200"
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-start justify-between border-b border-[#e2deea] bg-[#f6f5f8] px-4 py-5 md:px-8">
            <div>
              <h1 className="text-5xl font-black leading-none tracking-tight text-[#2d2834]">
                {currentPageTitle}
              </h1>
              {currentPageDescription ? (
                <p className="mt-1 text-sm font-semibold text-[#696373]">
                  {currentPageDescription}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              {showHeaderSearch ? (
                <div className="relative hidden w-[240px] lg:block">
                  <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
                  <Input
                    type="search"
                    placeholder="Search something...."
                    className="h-11 rounded-2xl border border-[#ddd8e8] bg-white px-4 pr-10 text-sm text-[#5d566f] placeholder:text-[#b2acbf]"
                  />
                </div>
              ) : null}

              <div className="flex items-center gap-4 rounded-3xl bg-linear-to-r from-[#ef4aa4] to-[#8b1bce] px-4 py-3 shadow-[0_10px_24px_rgba(161,37,193,0.33)]">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-white hover:bg-white/20 hover:text-white"
                  aria-label="Notifications"
                >
                  <img
                    src="/Pictures/organizerpics/notif dashboard.png"
                    alt="Notifications"
                    className="size-6"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-white hover:bg-white/20 hover:text-white"
                  aria-label="Email"
                >
                  <img src="/Pictures/organizerpics/email.png" alt="Email" className="size-6" />
                </Button>
                <img
                  src="/cse-logo.png"
                  alt="Organizer profile"
                  className="size-8 rounded-full border-2 border-white/70 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-white hover:bg-white/20 hover:text-white"
                  aria-label="Settings"
                >
                  <img
                    src="/Pictures/organizerpics/settings dashboard.png"
                    alt="Settings"
                    className="size-6"
                  />
                </Button>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
