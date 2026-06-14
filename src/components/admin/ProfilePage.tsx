import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';

const FALLBACK_AVATAR = '/Pictures/business-logo.png';

type ProfilePageProps = {
  profilePath?: string;
};

export function ProfilePage({ profilePath = '/admin/profile' }: ProfilePageProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userAvatar = user?.profilePic || FALLBACK_AVATAR;
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Admin';
  const displayRole = user?.role || 'ADMIN';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openLogoutModal = () => {
    setProfileOpen(false);
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
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
    <>
      <LoadingScreen isLoading={isLoggingOut} />
      <div ref={profileRef} className="relative">
        <button
          onClick={() => {
            setProfileOpen((current) => !current);
          }}
          className="flex items-center gap-1.5 rounded-lg p-1 transition hover:bg-brand/5"
          aria-label="Profile menu"
          aria-expanded={profileOpen}
        >
          <img
            src={userAvatar}
            alt="User avatar"
            className="size-8 rounded-full object-cover ring-2 ring-brand/30"
          />
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white shadow-lg shadow-black/10">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <img
                src={userAvatar}
                alt="User avatar"
                className="size-9 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{displayRole}</p>
              </div>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => {
                  navigate(profilePath);
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-brand/5 hover:text-brand"
              >
                <User className="size-4 shrink-0" />
                View Profile
              </button>
              <button
                onClick={openLogoutModal}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <LogOut className="size-4 shrink-0" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <LogOut className="size-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Confirm Logout</h3>
                </div>
                <button
                  onClick={closeLogoutModal}
                  className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-center text-foreground/80">Are you sure you want to log out?</p>
                <p className="mt-1 text-center text-sm text-gray-400">
                  You&apos;ll need to log in again to access your account.
                </p>
              </div>

              <div className="flex gap-3 border-t border-gray-100 p-4">
                <button
                  onClick={closeLogoutModal}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
