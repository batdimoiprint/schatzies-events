import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, Check, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenCookiePolicy?: () => void;
}

export function CookieConsentBanner({ onOpenCookiePolicy }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(() => {
    // Initialize state based on localStorage on first render
    const cookieConsent = localStorage.getItem('schatzies-cookie-consent');
    return !cookieConsent;
  });

  const handleAccept = () => {
    localStorage.setItem('schatzies-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('schatzies-cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#c2649b]/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ease-out">
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-4 lg:px-12 lg:py-5">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex gap-2 sm:gap-3 items-start">
            <div className="mt-0.5 flex-shrink-0">
              <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF0066]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#3d2052] mb-1">
                We Use Cookies
              </p>
              <p className="text-[0.75rem] sm:text-xs md:text-sm leading-relaxed text-[#3d2052]">
                We use cookies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. By clicking "Accept", you agree to our use of cookies.
              </p>
              <button
                onClick={onOpenCookiePolicy}
                className="mt-1 sm:mt-2 text-[0.75rem] sm:text-xs md:text-sm font-semibold text-[#FF0066] hover:text-[#e61f83] transition-colors underline"
              >
                Learn about our Cookie Policy
              </button>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 sm:flex-none h-9 sm:h-10 px-2 sm:px-4 md:px-6 text-[0.7rem] sm:text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 border-gray-300"
            >
              <X className="h-4 w-4" />
              <span>Reject</span>
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 sm:flex-none h-9 sm:h-10 px-2 sm:px-4 md:px-6 text-[0.7rem] sm:text-xs md:text-sm font-semibold bg-gradient-to-r from-[#FF0066] to-[#4A1053] hover:shadow-lg transition-shadow text-white flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Accept</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
