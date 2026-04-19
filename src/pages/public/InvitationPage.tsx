import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllEvents, getEventById } from '@/lib/rsvpStorage';
import type { EventData } from '@/types/rsvp';

interface QRCodeData {
  id: string;
  scans?: number;
}

export function InvitationPage() {
  const { eventId, qrId } = useParams<{ eventId: string; qrId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const loadEvent = () => {
      if (!eventId) {
        setDebugInfo('No eventId provided in URL');
        setLoading(false);
        return;
      }

      // Try to get event by ID first, then fallback to getAllEvents
      let found = getEventById(eventId);

      if (!found) {
        // If not found, try again with all events
        const allEvents = getAllEvents();
        found = allEvents.find((e) => e.id === eventId);
        setDebugInfo(`Searched ${allEvents.length} events. Event found: ${found ? 'yes' : 'no'}`);
      }

      setEvent(found || null);

      // Track QR scan
      if (qrId && found) {
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

      setLoading(false);
    };

    loadEvent();
  }, [eventId, qrId]);

  const handleProceed = () => {
    navigate(`/rsvp?eventId=${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-pink-50">
        <div className="text-center">
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    const allEvents = getAllEvents();
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-pink-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Event not found</p>
          <p className="text-gray-600 text-sm mb-4">EventID: {eventId}</p>
          <p className="text-gray-600 text-sm mb-4">{debugInfo}</p>
          <details className="text-left text-xs text-gray-500 mb-4">
            <summary className="cursor-pointer">Available Events ({allEvents.length})</summary>
            {allEvents.map((e) => (
              <div key={e.id} className="mt-2 p-2 bg-gray-100 rounded">
                <p>
                  <strong>{e.id}</strong>: {e.title}
                </p>
              </div>
            ))}
          </details>
          <button onClick={() => navigate('/')} className="text-[#df2b80] hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Parse event title to separate names
  const names = event.title.split('&');
  const name1 = names[0]?.trim() || event.couple?.name1 || 'Partner';
  const name2 = names[1]?.trim() || event.couple?.name2 || 'Partner';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-100 to-pink-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Schatzies Events Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#df2b80]">SE</h1>
          <p className="text-xs font-semibold text-gray-600 tracking-wide">Schatzies Events</p>
        </div>

        {/* Tagline */}
        <p className="mb-6 text-center text-sm font-semibold text-[#696373]">
          Your MOST TRUSTED team!
        </p>

        {/* Divider */}
        <div className="mb-6 h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        {/* Main Content */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm text-gray-600">The wedding of</p>
          <h2 className="mb-1 text-4xl font-extrabold text-[#df2b80]">{name1}</h2>
          <p className="mb-4 text-4xl font-extrabold text-[#df2b80]">& {name2}</p>
          <p className="text-sm leading-relaxed text-gray-700">
            Together with their family and friends
            <br />
            invites you to their wedding ceremony!
          </p>
        </div>

        {/* Event Details Cards */}
        <div className="mb-8 space-y-3">
          <div className="rounded-xl bg-pink-50 p-4 text-center border border-pink-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Date & Time
            </p>
            <p className="mt-1 font-semibold text-[#2d2834]">{event.date}</p>
            <p className="text-xs text-gray-600">{event.time}</p>
          </div>

          <div className="rounded-xl bg-pink-50 p-4 text-center border border-pink-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Venue</p>
            <p className="mt-1 font-semibold text-[#2d2834]">{event.location}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        {/* CTA Button */}
        <button
          onClick={handleProceed}
          className="w-full rounded-full bg-[#df2b80] py-3 px-6 font-semibold text-white transition hover:bg-[#c91f6a] active:scale-95 shadow-lg"
        >
          Proceed to RSVP
        </button>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Please complete your RSVP to confirm your attendance.
        </p>
      </div>
    </div>
  );
}
