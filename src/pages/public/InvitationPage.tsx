import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '@/lib/rsvpStorage';

interface QRCodeData {
  id: string;
  scans?: number;
}

export function InvitationPage() {
  const { eventId, qrId } = useParams<{ eventId: string; qrId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = () => {
      if (!eventId) {
        navigate('/', { replace: true });
        return;
      }

      // Track QR scan if qrId is provided
      if (qrId) {
        const event = getEventById(eventId);
        if (event) {
          const storedQRs = localStorage.getItem(`qr-codes-${eventId}`);
          if (storedQRs) {
            try {
              const qrCodes = JSON.parse(storedQRs);
              const updatedQRs = qrCodes.map((qr: QRCodeData) =>
                qr.id === qrId ? { ...qr, scans: (qr.scans || 0) + 1 } : qr
              );
              localStorage.setItem(`qr-codes-${eventId}`, JSON.stringify(updatedQRs));
            } catch (error) {
              console.error('Error tracking QR scan:', error);
            }
          }
        }
      }

      // Redirect to the new RSVP route
      setTimeout(() => {
        navigate(`/rsvp?eventId=${eventId}`, { replace: true });
      }, 300);
    };

    handleRedirect();
  }, [eventId, qrId, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-pink-50">
      <div className="text-center">
        <div className="mb-4">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events"
            className="h-12 w-auto mx-auto"
          />
        </div>
        <p className="text-gray-600">Opening your invitation...</p>
      </div>
    </div>
  );
}
