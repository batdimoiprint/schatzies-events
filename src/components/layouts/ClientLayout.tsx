import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ClientSidebar } from '@/components/ClientSidebar';
import { ClientTopBar } from '@/components/client/ClientTopBar';

export function ClientLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fbf8fd]">
        <p className="text-base font-semibold text-[#4f4b57]">Loading client portal...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fbf8fd]">
      <div className="flex h-full flex-col md:flex-row">
        <ClientSidebar />

        <div className="flex min-h-0 flex-1 flex-col">
          <ClientTopBar />
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
