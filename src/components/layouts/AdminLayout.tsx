import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

export function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fbf8fd]">
        <div className="text-center">
          <p className="text-base font-semibold text-[#4f4b57]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fbf8fd]">
      <div className="flex h-full w-full flex-col md:flex-row">
        <AdminSidebar />

        <div className="flex min-h-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
