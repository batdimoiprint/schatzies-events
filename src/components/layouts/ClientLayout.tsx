import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ClientLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Prevent other roles from accessing the client portal
  // if (user.role !== 'CLIENT') {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Client Portal</h1>
        <div>
          <span className="text-gray-600 mr-4">
            Welcome, {user.fname} {user.lname}!
          </span>
        </div>
      </header>
      <main className="flex-1 p-6">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}
