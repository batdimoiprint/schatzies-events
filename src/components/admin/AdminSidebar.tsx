import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col items-center px-5 pb-4 pt-6">
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
        <p className="mt-3 text-center text-xs font-semibold tracking-wide text-[#7f7889]">
          Your <span className="text-[#df2b80]">ADMIN</span> dashboard!
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 pb-5 md:flex-1 md:flex-col md:overflow-y-auto md:overflow-x-visible">
        {adminNavItems.map((item) => {
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
              end={item.to === '/admin'}
            >
              <item.icon className="size-4.5 object-contain transition-all duration-200" />
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#ece7f2] px-3 py-3">
        <Button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7e9f1] px-4 py-3 text-[15px] font-semibold text-[#8f1fd1] hover:bg-[#efd8e6]"
        >
          <LogOut className="size-4.5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </Button>
      </div>
    </div>
  );
}
