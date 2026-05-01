import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

export function AdminLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbf8fd]">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full border-b border-[#ece7f2] bg-white md:h-full md:w-62 md:border-b-0 md:border-r">
          <AdminSidebar />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
