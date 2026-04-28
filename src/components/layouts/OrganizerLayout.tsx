import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, User, LogOut } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/api/auth';

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
    icon: '/Pictures/organizerpics/email.png',
  },
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
  '/organizer/message': 'Messages',
  '/organizer/cost-breakdown': 'Cost Breakdown',
  '/organizer/profile': 'My Profile',
};

const pageDescriptions: Record<string, string> = {
  '/organizer': "Shows the overview of the Schatzies Events' performance",
  '/organizer/calendar': 'Shows the mark dates and important meetings',
  '/organizer/event-planner': 'Planning and organization of the overall event',
  '/organizer/event-manager': 'Manages the list of the events completed',
  '/organizer/rsvp': 'Helps organizer to plan, allocate resources, schedule and confirm the event.',
  '/organizer/message': 'Shows conversations with the client',
  '/organizer/cost-breakdown': 'Displays cost and budget breakdown of an event or services',
  '/organizer/profile': 'Manage your personal information and account details.',
};

export type OrganizerLayoutOutletContext = {
  searchTerm: string;
};

export function OrganizerLayout() {
  const { isLoading, setAuthenticatedUser, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);
  const [notifTab, setNotifTab] = useState('Today');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Admin Confirmation',
      desc: 'Admin just confirmed an event for December 26',
      time: '11:11 am | April 19, 2026',
      unread: true,
      filterCategory: 'Today',
    },
    {
      id: 2,
      title: 'Admin Confirmation',
      desc: 'Admin just confirmed an event for December 26',
      time: '11:11 am | April 19, 2026',
      unread: true,
      filterCategory: 'This Week',
    },
    {
      id: 3,
      title: 'Admin Confirmation',
      desc: 'Admin just confirmed an event for December 26',
      time: '11:11 am | April 19, 2026',
      unread: true,
      filterCategory: 'Earlier',
    },
    {
      id: 4,
      title: 'Admin Confirmation',
      desc: 'Admin just confirmed an event for December 26',
      time: '11:11 am | April 19, 2026',
      unread: false,
      filterCategory: 'Earlier',
    },
  ]);
  const filteredNotifications = notifications.filter((notif) => {
    if (notifTab === 'All') return true;
    return notif.filterCategory === notifTab;
  });

  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [hasNewInbox, setHasNewInbox] = useState(true);
  const [inboxTab, setInboxTab] = useState('Today');
  const messages = [
    {
      id: 1,
      name: 'Christian Dace Juliales',
      initial: 'C',
      color: 'bg-[#db4b88]',
      text: 'Hi, are you available for a meeting? I would like to dis...',
      time: '11:11 am | April 19, 2026',
      filterCategory: 'Today',
    },
    {
      id: 2,
      name: 'Diane M. Rotono',
      initial: 'D',
      color: 'bg-[#4bc783]',
      text: 'Oh yes! I have seen that earlier. But I have some revisio...',
      time: '11:11 am | April 19, 2026',
      filterCategory: 'This Week',
    },
    {
      id: 3,
      name: 'Sabrina Carpenter',
      initial: 'S',
      color: 'bg-[#5b54e3]',
      text: 'I will send the details later today.',
      time: '11:11 am | April 19, 2026',
      filterCategory: 'Earlier',
    },
    {
      id: 4,
      name: 'Zara Larson',
      initial: 'Z',
      color: 'bg-[#db5a9b]',
      text: 'Thank you for the updates.',
      time: '11:11 am | April 19, 2026',
      filterCategory: 'Earlier',
    },
  ];
  const filteredMessages = messages.filter((msg) => {
    if (inboxTab === 'All') return true;
    return msg.filterCategory === inboxTab;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return (
      localStorage.getItem('organizer_avatar_url') || '/Pictures/organizerpics/Profile Picture.png'
    );
  });
  const [coverUrl, setCoverUrl] = useState(() => {
    return localStorage.getItem('organizer_cover_url') || '';
  });
  const [avatarPos, setAvatarPos] = useState(() => {
    return Number(localStorage.getItem('organizer_avatar_pos')) || 50;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAvatarUrl(
        localStorage.getItem('organizer_avatar_url') ||
          '/Pictures/organizerpics/Profile Picture.png'
      );
      setCoverUrl(localStorage.getItem('organizer_cover_url') || '');
      setAvatarPos(Number(localStorage.getItem('organizer_avatar_pos')) || 50);
    };

    const interval = setInterval(handleStorageChange, 1000);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const showHeaderSearch = ['/organizer/event-planner', '/organizer/event-manager'].includes(
    location.pathname
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsSettingsOpen(false);
    try {
      await logout();
    } finally {
      setAuthenticatedUser(null);
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

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
          <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 text-center border-0 shadow-[0_20px_60px_rgba(223,43,128,0.15)]">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff0f5] mb-4 shadow-inner">
                <LogOut className="size-8 text-[#df2b80] translate-x-0.5" />
              </div>
              <DialogTitle className="text-2xl font-black text-[#2d2834] mb-2">Log Out</DialogTitle>
              <p className="text-sm font-semibold text-[#696373] mb-8 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-[#e2deea] font-bold text-[#4f4a56] hover:bg-[#f6f5f8] hover:text-[#2d2834] sm:w-auto px-8 h-10 transition-colors"
                  onClick={() => setIsLogoutModalOpen(false)}
                  disabled={isLoggingOut}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full rounded-full bg-linear-to-r from-[#f34da7] to-[#8f1fd1] font-bold text-white shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 sm:w-auto px-8 h-10"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, Log out'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full bg-white/25 text-white hover:bg-white/40 hover:text-white"
                    aria-label="Notifications"
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setHasNewNotif(false);
                      setIsSettingsOpen(false);
                      setIsInboxOpen(false);
                    }}
                  >
                    <div className="relative">
                      <img
                        src="/Pictures/organizerpics/notif dashboard.png"
                        alt="Notifications"
                        className="size-4"
                      />
                      {hasNewNotif && (
                        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#f44b9e] border border-white/50" />
                      )}
                    </div>
                  </Button>

                  {isNotifOpen ? (
                    <div className="absolute right-[-120px] sm:right-[-140px] top-full z-50 mt-4 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:w-[380px] animate-in fade-in slide-in-from-top-2">
                      <div className="border-b border-[#f0edf4] p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#2d2834]">Notification</h3>
                          <button
                            className="rounded-full border border-[#e2deea] px-3 py-1 text-[11px] font-semibold text-[#8f879f] transition-colors hover:bg-[#f6f5f8]"
                            type="button"
                            onClick={() => setNotifTab('All')}
                          >
                            See All
                          </button>
                        </div>
                        <div className="flex rounded-full bg-[#f6f5f8] p-1">
                          {['Today', 'This Week', 'Earlier'].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setNotifTab(tab)}
                              className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${notifTab === tab ? 'bg-white text-[#2d2834] shadow-sm' : 'text-[#8f879f] hover:text-[#4f4a56]'}`}
                              type="button"
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="scrollbar-thin scrollbar-thumb-[#e8e0eb] scrollbar-track-transparent max-h-[340px] overflow-y-auto">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className="flex cursor-pointer items-start gap-3 border-b border-[#f0edf4] p-4 transition-colors hover:bg-[#fafafa]"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f8f5fe] text-[#8f1fd1]">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <p className="truncate text-[13px] font-bold leading-tight text-[#2d2834]">
                                  {notif.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-[#696373]">
                                  {notif.desc}
                                </p>
                                <p className="mt-1.5 text-[9px] font-semibold text-[#a49cb3]">
                                  {notif.time}
                                </p>
                              </div>
                              <div className="shrink-0 pt-2">
                                <span
                                  className={`block size-2 rounded-full ${notif.unread ? 'bg-[#f44b9e]' : 'bg-[#d1cbd9]'}`}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-sm font-medium text-[#a49cb3]">
                            No notifications found.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-white hover:bg-white/20 hover:text-white"
                    aria-label="Email"
                    onClick={() => {
                      setIsInboxOpen(!isInboxOpen);
                      setHasNewInbox(false);
                      setIsNotifOpen(false);
                      setIsSettingsOpen(false);
                    }}
                  >
                    <div className="relative">
                      <img src="/Pictures/organizerpics/email.png" alt="Email" className="size-4" />
                      {hasNewInbox && (
                        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#f44b9e] border border-white/50" />
                      )}
                    </div>
                  </Button>

                  {isInboxOpen ? (
                    <div className="absolute right-[-60px] sm:right-[-80px] top-full z-50 mt-4 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:w-[380px] animate-in fade-in slide-in-from-top-2">
                      <div className="border-b border-[#f0edf4] p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#2d2834]">Message Inbox</h3>
                          <button
                            className="rounded-full border border-[#e2deea] px-3 py-1 text-[11px] font-semibold text-[#8f879f] transition-colors hover:bg-[#f6f5f8]"
                            type="button"
                            onClick={() => setInboxTab('All')}
                          >
                            See All
                          </button>
                        </div>
                        <div className="flex rounded-full bg-[#f6f5f8] p-1">
                          {['Today', 'This Week', 'Earlier'].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setInboxTab(tab)}
                              className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${inboxTab === tab ? 'bg-white text-[#2d2834] shadow-sm' : 'text-[#8f879f] hover:text-[#4f4a56]'}`}
                              type="button"
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="scrollbar-thin scrollbar-thumb-[#e8e0eb] scrollbar-track-transparent max-h-[340px] overflow-y-auto">
                        {filteredMessages.length > 0 ? (
                          filteredMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex cursor-pointer items-start gap-3 border-b border-[#f0edf4] p-4 transition-colors hover:bg-[#fafafa]"
                            >
                              <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white text-lg font-bold ${msg.color}`}
                              >
                                {msg.initial}
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <p className="truncate text-[13px] font-bold leading-tight text-[#2d2834]">
                                  {msg.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-[#696373]">
                                  {msg.text}
                                </p>
                                <p className="mt-1.5 text-[9px] font-semibold text-[#a49cb3]">
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-sm font-medium text-[#a49cb3]">
                            No messages found.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Profile Menu"
                    onClick={() => {
                      setIsSettingsOpen(!isSettingsOpen);
                      setIsNotifOpen(false);
                      setIsInboxOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full outline-none ring-2 ring-transparent transition-all hover:scale-105 hover:ring-white/50 focus:ring-white/50"
                  >
                    <img
                      src={avatarUrl}
                      alt="Organizer profile"
                      style={{ objectPosition: `${avatarPos}% center` }}
                      className="size-7 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  </button>

                  {isSettingsOpen ? (
                    <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_rgba(143,31,209,0.15)] ring-1 ring-[#e2deea] z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div
                        className="relative p-4 flex items-center gap-3 border-b border-[#f0edf4] bg-cover bg-center overflow-hidden"
                        style={{
                          backgroundImage: coverUrl
                            ? `url(${coverUrl})`
                            : 'linear-gradient(to right, #df2b80, #8f1fd1)',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/30" />
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          style={{ objectPosition: `${avatarPos}% center` }}
                          className="relative size-11 rounded-full object-cover border-2 border-white bg-white"
                        />
                        <div className="relative flex flex-col min-w-0 text-white">
                          <p className="text-sm font-bold truncate drop-shadow-md">cj Perandos</p>
                          <p className="text-[11px] font-semibold text-white/90 drop-shadow-md">
                            Organizer
                          </p>
                        </div>
                      </div>
                      <div className="p-2 space-y-1 bg-[#fcfbfc]">
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4f4a56] transition-colors hover:bg-[#f6f3fc] hover:text-[#8f1fd1]"
                          onClick={() => {
                            setIsSettingsOpen(false);
                            navigate('/organizer/profile');
                          }}
                        >
                          <User className="size-4 text-[#8f879f]" />
                          View Profile
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-[#df2b80] transition-colors hover:bg-[#fff0f5]"
                          onClick={() => {
                            setIsSettingsOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                        >
                          <LogOut className="size-4 text-[#df2b80]" />
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div
              key={location.pathname}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
            >
              <Outlet context={{ searchTerm }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
