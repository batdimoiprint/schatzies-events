import { useNavigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

export function PublicLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollRestoration />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CookieConsentBanner onOpenCookiePolicy={() => navigate('/cookie-policy')} />
    </div>
  );
}
