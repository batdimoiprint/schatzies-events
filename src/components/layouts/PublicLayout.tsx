import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f5f4f7] text-foreground">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
