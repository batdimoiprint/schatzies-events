import { Button } from '@/components/ui/button';
import { logout } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      Admin Dashboard
      <Button onClick={handleLogout} className="ml-4">
        Logout
      </Button>
    </div>
  );
}
