import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyRSVP } from '@/api/rsvp';
import { RSVPSuccessPage } from '../client/RSVPSuccessPage';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { AlertCircle } from 'lucide-react';

export function RSVPVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<any>(null);
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
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(
          err.response?.data?.message ||
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleVisitHome}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition active:scale-95"
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
