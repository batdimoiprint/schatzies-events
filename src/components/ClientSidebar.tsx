import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { SquaresFour, ClipboardText, QrCode, Chat } from '@phosphor-icons/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/api/auth';

const logoImagePath = '/Pictures/business-logo.png';

const clientNavItems = [
  { label: 'Overview', to: '/client', Icon: SquaresFour },
  { label: 'Event Plan Viewing', to: '/client/event-plan', Icon: ClipboardText },
  { label: 'QR CODE', to: '/client/qr-code', Icon: QrCode },
  { label: 'Message', to: '/client/message', Icon: Chat },
];

export function ClientSidebar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-[#ece7f2] bg-white transition-all duration-200 ${
        expanded ? 'w-64' : 'w-16 items-center'
      }`}
    >
      {/* ── Hamburger — larger in both states ── */}
      <div className={`flex w-full pt-3 pb-1 ${expanded ? 'justify-end px-3' : 'justify-center'}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle sidebar"
          className="size-11 shrink-0 text-[#3d2052] hover:bg-[#fdf2f8]"
        >
          <Menu className="size-7 stroke-[2.5]" />
        </Button>
      </div>

      {/* ── Logo area — fixed height so nav always starts at the same Y ── */}
      <div className="flex h-36 w-full shrink-0 flex-col items-center justify-start pt-3 px-5">
        {expanded ? (
          <>
            <img src={logoImagePath} alt="Schatzies Events logo" className="h-24 w-auto" />
            <p className="mt-1 text-xs font-semibold tracking-wide text-[#7f7889]">
              Your <span className="font-bold text-[#df2b80]">MOST TRUSTED</span> team!
            </p>
          </>
        ) : (
          <div className="size-10 overflow-hidden rounded-full border-2 border-[#e61f83] bg-white">
            <img
              src={logoImagePath}
              alt="Schatzies Events"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav
        className={`flex w-full flex-col pb-5 mt-6 ${expanded ? '' : 'items-center gap-1.5 px-2'}`}
      >
        {clientNavItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/client'}
            title={!expanded ? label : undefined}
            className={({ isActive }) =>
              expanded
                ? [
                    'flex w-full items-center gap-4 px-6 py-3 text-[15px] font-semibold transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-[#f347a5] to-[#8f1fd1] text-white'
                      : 'text-[#4f4a56] hover:bg-[#fdf2f8] hover:text-[#df2b80]',
                  ].join(' ')
                : [
                    'flex size-10 items-center justify-center rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-to-b from-[#f347a5] to-[#8f1fd1] text-white shadow-[0_6px_16px_rgba(187,54,194,0.3)]'
                      : 'text-[#6b6279] hover:bg-[#fdf2f8] hover:text-[#df2b80]',
                  ].join(' ')
            }
          >
            <Icon weight="fill" size={20} className="shrink-0" />
            {expanded && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout Button ── */}
      <div className={`mt-auto mb-4 w-full px-3 ${expanded ? '' : 'flex justify-center'}`}>
        <Button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="ghost"
          className={`flex items-center gap-3 rounded-xl bg-[#fdf2f8] text-[#df2b80] hover:bg-[#fae7f2] hover:text-[#c41e6d] ${
            expanded ? 'w-full justify-start px-4 py-3' : 'size-10 justify-center p-0'
          }`}
          title={!expanded ? 'Logout' : undefined}
          aria-label="Logout"
        >
          <LogOut className="size-5 shrink-0" />
          {expanded && (
            <span className="font-semibold text-[15px]">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
