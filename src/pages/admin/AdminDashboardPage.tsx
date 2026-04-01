import { Button } from '@/components/ui/button';
import { logout } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD:src/pages/dashboard/DashboardPage.tsx
export default function DashboardPage() {
=======
export function AdminDashboardPage() {
>>>>>>> a92f0c2b2ed96cf84f14ea801ec6d7d1b7c438ef:src/pages/admin/AdminDashboardPage.tsx
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
<<<<<<< HEAD:src/pages/dashboard/DashboardPage.tsx
      DashboardPage
=======
      Admin Dashboard
>>>>>>> a92f0c2b2ed96cf84f14ea801ec6d7d1b7c438ef:src/pages/admin/AdminDashboardPage.tsx
      <Button onClick={handleLogout} className="ml-4">
        Logout
      </Button>
    </div>
  );
}
