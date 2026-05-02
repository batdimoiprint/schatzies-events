import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function InvitationPage() {
  const { eventId } = useParams<{ eventId: string; qrId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!eventId) {
      navigate('/', { replace: true });
      return;
    }

    // Redirect to the RSVP page with the eventId
    setTimeout(() => {
      navigate(`/rsvp?eventId=${eventId}`, { replace: true });
    }, 300);
  }, [eventId, navigate]);

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
