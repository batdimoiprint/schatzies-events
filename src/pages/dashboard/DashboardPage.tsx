import { Button } from '@/components/ui/button';
import { logout } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      DashboardPage
      <Button onClick={handleLogout} className="ml-4">
        Logout
      </Button>
    </div>
  );
}
