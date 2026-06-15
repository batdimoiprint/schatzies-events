import LoadingScreen from '@/components/ui/LoadingScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Check, Download, Home } from 'lucide-react';

interface RSVPSuccessPageProps {
  loading: boolean;
  qrCodeGenerating?: boolean;
  navigating: boolean;
  qrCode: string;
  isAttending?: boolean;
  isVerified?: boolean;
  onDownloadQR: () => void;
  onVisitHome: () => void;
}

export function RSVPSuccessPage({
  loading,
  qrCodeGenerating,
  navigating,
  qrCode,
  isAttending = true,
  isVerified = false,
  onDownloadQR,
  onVisitHome,
}: RSVPSuccessPageProps) {
  return (
    <>
      <LoadingScreen isLoading={loading || !!qrCodeGenerating || navigating} />
      <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-pink-100 via-white to-pink-300 px-6 pt-8 pb-12">
        {/* Logo */}
        <div className="mb-2">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events"
            className="h-14 w-auto mx-auto"
          />
        </div>
        {/* Tagline */}
        <p className="mb-6 text-sm font-medium text-gray-600 text-center">
          Your <span className="font-bold text-brand">MOST TRUSTED</span> team!
        </p>
        {/* Spacer */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
          {/* Checkmark circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-pink-400 to-pink-700 flex items-center justify-center shadow-2xl mb-6">
            <Check className="w-12 h-12 text-white stroke-[3]" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-700 drop-shadow mb-3">
            Response Received!
          </h2>

          {/* Subtitle - Dynamic based on attendance and verification status */}
          {!isVerified ? (
            <>
              <p className="text-sm text-gray-600 text-center max-w-xs leading-relaxed mb-3">
                Thank you for submitting your response!
              </p>
              <p className="text-sm text-gray-600 text-center max-w-xs leading-relaxed mb-16">
                A verification email has been sent to your inbox. Please click the link to confirm
                your RSVP. You'll then appear on our guest list.
              </p>
              <button
                onClick={onVisitHome}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 px-8 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 active:scale-95 transition"
              >
                {navigating ? (
                  <LoadingSpinner size="sm" color="text-pink-500" />
                ) : (
                  <Home className="w-4 h-4" />
                )}
                Return to Home
              </button>
            </>
          ) : isAttending ? (
            <>
              <p className="text-sm text-gray-600 text-center max-w-xs leading-relaxed mb-16">
                We've successfully updated your attendance status. Thank you for celebrating with
                us!
              </p>

              {/* QR Code Preview */}
              {qrCode && (
                <div className="mb-6 rounded-2xl bg-white p-4 shadow-xl border border-pink-100 flex flex-col items-center animate-in zoom-in duration-500">
                  <img
                    src={qrCode}
                    alt="Guest QR Code"
                    className="w-40 h-40 sm:w-48 sm:h-48 mb-2"
                  />
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Your Digital Pass
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 w-full mb-4">
                <button
                  onClick={onVisitHome}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 active:scale-95 transition"
                >
                  {navigating ? (
                    <LoadingSpinner size="sm" color="text-pink-500" />
                  ) : (
                    <Home className="w-4 h-4" />
                  )}
                  Visit Schatzies
                </button>
                <button
                  onClick={onDownloadQR}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
              </div>

              {/* Important notice */}
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-brand">Important Notice!</span> Please download
                your digital invite QR code below. Having this ready on your phone will help us
                verify your seat and welcome you quickly upon arrival.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center max-w-xs leading-relaxed mb-16">
                We’ve noted that you won’t be attending. Thank you for letting us know! Your
                response has been recorded and you'll now appear in our records.
              </p>

              <button
                onClick={onVisitHome}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 px-8 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 active:scale-95 transition"
              >
                {navigating ? (
                  <LoadingSpinner size="sm" color="text-pink-500" />
                ) : (
                  <Home className="w-4 h-4" />
                )}
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
