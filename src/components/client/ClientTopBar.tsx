import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, LogOut, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/api/auth';

const AVATAR_SRC = '/Pictures/organizerpics/Profile Picture.png';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Event Update',
    message: 'Your organizer updated the program flow.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Meeting Scheduled',
    message: 'A meeting has been set for May 3 at Zus Coffee.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 3,
    title: 'Task Completed',
    message: 'Technicals manpower has been confirmed.',
    time: '2 days ago',
    unread: false,
  },
];

export function ClientTopBar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { setAuthenticatedUser, user } = useAuth();

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setAuthenticatedUser(null);
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name ?? user?.email ?? 'Client';

  return (
    <div className="flex shrink-0 items-center justify-end gap-1 border-b border-[#ece7f2] bg-white px-4 py-3 pl-14 sm:px-6 md:pl-6">
      {/* ── Bell / Notifications ── */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => {
            setNotifOpen((v) => !v);
            setProfileOpen(false);
          }}
          aria-label="Notifications"
          className="relative rounded-lg p-1.5 text-[#696373] transition hover:bg-[#fdf2f8] hover:text-[#df2b80]"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e61f83] text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-lg shadow-black/10">
            <div className="flex items-center justify-between border-b border-[#ece7f2] px-4 py-3">
              <p className="text-sm font-bold text-[#2d2834]">Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-[#df2b80]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition hover:bg-[#fdf2f8] ${n.unread ? 'bg-pink-50/60' : ''}`}
                >
                  {n.unread && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e61f83]" />
                  )}
                  {!n.unread && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2d2834]">{n.title}</p>
                    <p className="mt-0.5 text-xs text-[#696373]">{n.message}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#ece7f2] px-4 py-2.5">
              <button
                onClick={() => {
                  navigate('/client/notifications');
                  setNotifOpen(false);
                }}
                className="w-full text-center text-xs font-semibold text-[#df2b80] transition hover:text-[#c41e6d]"
              >
                See all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Profile picture + dropdown ── */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => {
            setProfileOpen((v) => !v);
            setNotifOpen(false);
          }}
          className="flex items-center gap-1.5 rounded-lg p-1 transition hover:bg-[#fdf2f8]"
          aria-label="Profile menu"
          aria-expanded={profileOpen}
        >
          <img
            src={AVATAR_SRC}
            alt="User avatar"
            className="size-8 rounded-full object-cover ring-2 ring-[#e61f83]/30"
          />
          <ChevronDown
            className={`size-3.5 text-[#696373] transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-lg shadow-black/10">
            {/* User info */}
            <div className="flex items-center gap-3 border-b border-[#ece7f2] px-4 py-3">
              <img
                src={AVATAR_SRC}
                alt="User avatar"
                className="size-9 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#2d2834]">{displayName}</p>
                <p className="truncate text-xs text-[#696373]">Client</p>
              </div>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => {
                  navigate('/client/profile');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#4f4a56] transition hover:bg-[#fdf2f8] hover:text-[#df2b80]"
              >
                <User className="size-4 shrink-0" />
                View Profile
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut className="size-4 shrink-0" />
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Settings ── */}
      <button
        onClick={() => navigate('/client/settings')}
        aria-label="Settings"
        className="rounded-lg p-1.5 text-[#696373] transition hover:bg-[#fdf2f8] hover:text-[#df2b80]"
      >
        <Settings className="size-5" />
      </button>
    </div>
  );
}
