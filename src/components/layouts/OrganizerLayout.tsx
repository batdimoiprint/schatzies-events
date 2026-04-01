import {
  Bell,
  CalendarDays,
  ClipboardList,
  FolderKanban,
  HandCoins,
  LayoutGrid,
  Mail,
  ScanSearch,
} from 'lucide-react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const organizerNavItems = [
  { label: 'Dashboard', to: '/organizer', icon: LayoutGrid },
  { label: 'Calendar', to: '/organizer/calendar', icon: CalendarDays },
  { label: 'Event Planner', to: '/organizer/event-planner', icon: ClipboardList },
  { label: 'Event Manager', to: '/organizer/event-manager', icon: FolderKanban },
  { label: 'RSVP', to: '/organizer/rsvp', icon: ScanSearch },
  { label: 'Cost Breakdown', to: '/organizer/cost-breakdown', icon: HandCoins },
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
  '/organizer/calendar': '',
  '/organizer/event-planner': '',
  '/organizer/event-manager': '',
  '/organizer/rsvp': '',
  '/organizer/cost-breakdown': '',
};

export function OrganizerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f5f8]">
        <p className="text-base font-semibold text-[#4f4b57]">Loading organizer workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ORGANIZER') {
    return <Navigate to="/login" replace />;
  }

  const currentPageTitle = pageTitles[location.pathname] ?? 'Organizer Workspace';
  const currentPageDescription = pageDescriptions[location.pathname] ?? '';

  return (
    <div className="h-screen bg-[#f6f5f8]">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full border-b border-[#ece7f2] bg-white md:h-full md:w-62 md:border-b-0 md:border-r">
          <div className="px-5 pb-4 pt-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#ece7f4]">
              <img
                src="/cse-logo.png"
                alt="CSE logo"
                className="size-12 rounded-full border border-[#f4cde3] bg-white object-cover"
              />
              <div className="leading-tight">
                <p className="font-heading text-base font-bold text-[#df2b80]">Schatzies</p>
                <p className="font-heading text-base font-bold text-[#9a1eb9]">Events</p>
              </div>
            </div>
            <p className="mt-3 px-1 text-xs font-semibold tracking-wide text-[#7f7889]">
              Your <span className="text-[#df2b80]">MOST TRUSTED</span> team!
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-3 pb-5 md:flex-col md:overflow-visible">
            {organizerNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => {
                    return [
                      'group flex min-w-42.5 items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition-all',
                      isActive
                        ? 'bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_10px_20px_rgba(187,54,194,0.28)]'
                        : 'text-[#4f4a56] hover:bg-white hover:text-[#2b2730]',
                    ].join(' ');
                  }}
                  end={item.to === '/organizer'}
                >
                  <Icon className="size-4.5" />
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

            <div className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#ef4aa4] to-[#8b1bce] p-1 shadow-[0_10px_24px_rgba(161,37,193,0.33)]">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-white hover:bg-white/20 hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-white hover:bg-white/20 hover:text-white"
                aria-label="Messages"
              >
                <Mail className="size-4" />
              </Button>
              <img
                src="/cse-logo.png"
                alt="Organizer profile"
                className="size-7 rounded-full border border-white/70 object-cover"
              />
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
