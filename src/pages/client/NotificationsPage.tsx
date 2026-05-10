import { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Calendar,
  ClipboardList,
  UserCheck,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ICON_MAP: Record<string, typeof Bell> = {
  event: Calendar,
  task: ClipboardList,
  rsvp: UserCheck,
  message: MessageSquare,
};

const INITIAL_NOTIFICATIONS: Array<{ id: number; type: string; title: string; message: string; time: string; unread: boolean; }> = [];

type FilterType = 'all' | 'event' | 'task' | 'rsvp' | 'message';

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filtered =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Events', value: 'event' },
    { label: 'Tasks', value: 'task' },
    { label: 'RSVP', value: 'rsvp' },
    { label: 'Messages', value: 'message' },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ece7f2] bg-white text-[#696373] transition-all duration-200 hover:bg-[#fdf2f8] hover:text-[#df2b80] hover:border-[#df2b80]"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">
              Notifications
            </h1>
            <p className="mt-1 text-sm font-medium text-[#696373]">
              Stay updated on your event progress and responses.
            </p>
          </div>
        </div>
      </div>

      {/* Filters + Mark all */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f.value
                  ? 'bg-[#df2b80] text-white shadow-sm'
                  : 'bg-gray-100 text-[#696373] hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#df2b80] transition hover:text-[#c41e6d]"
          >
            <CheckCheck className="size-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="overflow-hidden rounded-xl border border-[#ece7f2] bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-3 size-10 text-gray-300" />
            <p className="text-sm font-medium text-[#696373]">No notifications</p>
          </div>
        ) : (
          <ul>
            {filtered.map((n, i) => {
              const Icon = ICON_MAP[n.type] ?? Bell;
              return (
                <li
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={[
                    'flex cursor-pointer items-start gap-4 border-b border-[#ece7f2] px-5 py-4 transition-all duration-200 last:border-b-0 hover:bg-[#fdf2f8]',
                    n.unread ? 'bg-pink-50/60' : '',
                  ].join(' ')}
                  style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                      n.unread
                        ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white'
                        : 'bg-gray-100 text-[#696373]'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${n.unread ? 'font-bold text-[#2d2834]' : 'font-medium text-[#4f4a56]'}`}
                      >
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#e61f83]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#696373]">{n.message}</p>
                    <p className="mt-1.5 text-[11px] text-gray-400">{n.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
