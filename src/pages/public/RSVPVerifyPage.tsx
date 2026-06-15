import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyRSVP } from '@/api/rsvp';
import { RSVPSuccessPage } from '../client/RSVPSuccessPage';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { AlertCircle } from 'lucide-react';

interface VerifiedGuest {
  guestfirstName?: string;
  status?: string;
}

interface VerifyError {
  response?: { data?: { message?: string } };
}

export function RSVPVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<VerifiedGuest | null>(null);
  const [qrCode, setQrCode] = useState<string>('');

  const eventId = searchParams.get('eventId');
  const guestId = searchParams.get('guestId');
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!eventId || !guestId || !token) {
        setError('Invalid verification link. Missing required information.');
        setLoading(false);
        return;
      }

      try {
        const data = await verifyRSVP(eventId, guestId, token);
        setGuestData(data.guest);
        setQrCode(data.qrCode || '');
      } catch (err) {
        console.error('Verification error:', err);
        setError(
          (err as VerifyError)?.response?.data?.message ||
            'Failed to verify RSVP. The link may be expired or invalid.'
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [eventId, guestId, token]);

  const handleDownloadQR = async () => {
    if (!qrCode) return;
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `RSVP_QR_${guestData?.guestfirstName || 'Guest'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: direct link download
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `RSVP_QR_${guestData?.guestfirstName || 'Guest'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleVisitHome = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error) {
    return (
      <div className="bg-gradient-brand-soft flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Verification Failed</h2>
          <p className="mb-6 font-montserrat text-muted-foreground">{error}</p>
          <button
            onClick={handleVisitHome}
            className="bg-gradient-brand w-full rounded-xl py-3 font-montserrat font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <RSVPSuccessPage
      loading={false}
      navigating={false}
      qrCode={qrCode}
      isAttending={guestData?.status === 'ATTENDING'}
      isVerified={true}
      onDownloadQR={handleDownloadQR}
      onVisitHome={handleVisitHome}
    />
  );
}
