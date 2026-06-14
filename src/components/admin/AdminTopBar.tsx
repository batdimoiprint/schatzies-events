import { ProfilePage } from '@/components/admin/ProfilePage';

type AdminTopBarProps = {
  profilePath?: string;
};

export function AdminTopBar({ profilePath = '/admin/profile' }: AdminTopBarProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1 border-b border-border bg-white px-4 py-3 pl-14 sm:px-6 md:pl-6">
      <ProfilePage profilePath={profilePath} />
    </div>
  );
}
