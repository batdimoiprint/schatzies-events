import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  '/organizer/calendar': 'Shows the mark dates and important meetings',
  '/organizer/event-planner': 'Planning and organization of the overall event',
  '/organizer/event-manager': 'Manages the list of the events completed',
  '/organizer/rsvp': 'Helps organizer to plan, allocate resources, schedule and confirm the event.',
  '/organizer/cost-breakdown': 'Displays cost and budget breakdown of an event or services',
};

export type OrganizerLayoutOutletContext = {
  searchTerm: string;
};

export function OrganizerLayout() {
  const { isLoading, setAuthenticatedUser, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const showHeaderSearch = ['/organizer/event-planner', '/organizer/event-manager'].includes(
    location.pathname
  );

  //Loading screen pag nag login sa Organizer na Account.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f5f8]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-[-8px] rounded-full border-t-4 border-r-4 border-transparent border-t-[#f347a5] border-r-[#8f1fd1] animate-spin"></div>
            <img
              src="/Pictures/organizerpics/Logo.png.png"
              alt="Schatzies Events logo"
              className="size-20 rounded-full border-4 border-[#df2b80] object-cover animate-pulse shadow-[0_0_20px_rgba(223,43,128,0.4)]"
            />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#8f1fd1] animate-pulse">
            Loading Workspace...
          </p>
        </div>
      </div>
    );
  }

  //wag nyo na galawin this please...
  if (!isAuthenticated || user?.role !== 'ORGANIZER') {
    return <Navigate to="/login" replace />;
  }

  const currentPageTitle = pageTitles[location.pathname] ?? 'Organizer Workspace';
  const currentPageDescription = pageDescriptions[location.pathname] ?? '';

  return (
    //dito  yung sa may sidebar bandang logo at text.
    <div className="h-screen bg-[#f6f5f8]">
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
                    'flex flex-col justify-center leading-tight overflow-hidden transition-all duration-300',
                    isSidebarOpen ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0',
                  ].join(' ')}
                >
                  <p className="font-heading text-base font-bold text-[#df2b80] whitespace-nowrap">
                    Schatzies
                  </p>
                  <p className="font-heading text-base font-bold text-[#9a1eb9] whitespace-nowrap">
                    Events
                  </p>
                </div>
              </div>
              <p
                className={[
                  'mt-3 text-center text-xs font-semibold tracking-wide text-[#7f7889] overflow-hidden transition-all duration-300',
                  'animate-in fade-in slide-in-from-left-4 duration-500',
                  isSidebarOpen ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0',
                ].join(' ')}
              >
                Your <span className="text-[#df2b80]">MOST TRUSTED</span> team!
              </p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-3 pb-5 md:flex-col md:overflow-visible">
            {organizerNavItems.map((item) => {
              return (
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
                      isSidebarOpen ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0',
                    ].join(' ')}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#e2deea] bg-[#f6f5f8] px-4 py-5 md:pl-8 md:pr-14 lg:pr-16">
            <div>
              <h1
                key={location.pathname}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-5xl font-black leading-none tracking-tight text-[#2d2834]"
              >
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
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="h-11 rounded-2xl border border-[#ddd8e8] bg-white px-4 pr-10 text-sm text-[#5d566f] placeholder:text-[#b2acbf]"
                  />
                </div>
              ) : null}

              <div className="flex items-center gap-4 rounded-3xl bg-linear-to-r from-[#ef4aa4] to-[#8b1bce] px-4 py-3 shadow-[0_10px_24px_rgba(161,37,193,0.33)]">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full bg-white/25 text-white hover:bg-white/40 hover:text-white"
                  aria-label="Notifications"
                >
                  <img
                    src="/Pictures/organizerpics/notif dashboard.png"
                    alt="Notifications"
                    className="size-4"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-white hover:bg-white/20 hover:text-white"
                  aria-label="Email"
                >
                  <img src="/Pictures/organizerpics/email.png" alt="Email" className="size-4" />
                </Button>
                <img
                  src="/Pictures/organizerpics/Profile Picture.png"
                  alt="Organizer profile"
                  className="size-7 rounded-full border-2 border-white object-cover"
                />
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-white hover:bg-white/20 hover:text-white"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    <img
                      src="/Pictures/organizerpics/settings dashboard.png"
                      alt="Settings"
                      className="size-4"
                    />
                  </Button>
                  {isSettingsOpen ? (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-[#e2deea] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <button
                        type="button"
                        className="cursor-pointer hover:bg-[#f6f5f8] text-sm font-semibold text-[#4f4a56] px-4 py-2 w-full text-left transition-colors"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        My Profile
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer hover:bg-[#f6f5f8] text-sm font-semibold text-[#df2b80] px-4 py-2 w-full text-left transition-colors"
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setAuthenticatedUser(null);
                          navigate('/login');
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet context={{ searchTerm }} />
          </main>
        </div>
      </div>
    </div>
  );
}