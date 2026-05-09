import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

export function PublicLayout() {
  const [cookiePolicyOpen, setCookiePolicyOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f4f7] text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer
        onCookiePolicyOpen={() => setCookiePolicyOpen(true)}
        cookiePolicyOpen={cookiePolicyOpen}
        onCookiePolicyClose={() => setCookiePolicyOpen(false)}
      />
      <ChatWidget />
      <CookieConsentBanner onOpenCookiePolicy={() => setCookiePolicyOpen(true)} />
    </div>
  );
}
