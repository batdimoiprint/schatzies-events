import { useNavigate, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

export function PublicLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f4f7] text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ChatWidget />
      <CookieConsentBanner onOpenCookiePolicy={() => navigate('/cookie-policy')} />
    </div>
  );
}
