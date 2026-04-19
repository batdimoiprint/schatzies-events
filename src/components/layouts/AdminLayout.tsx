import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
    <div className="h-screen bg-[#f6f5f8]">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full border-b border-[#ece7f2] bg-white md:h-full md:w-62 md:border-b-0 md:border-r">
          <AdminSidebar />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-start justify-between border-b border-[#e2deea] bg-[#f6f5f8] px-4 py-5 md:px-8">
            {/* Add header content if needed */}
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
