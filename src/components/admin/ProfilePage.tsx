import { useEffect, useRef, useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const FALLBACK_AVATAR = '/Pictures/business-logo.png';

type ProfilePageProps = {
  profilePath?: string;
};

export function ProfilePage({ profilePath = '/admin/profile' }: ProfilePageProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
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
          </div>
        </div>
      )}
    </div>
  );
}
