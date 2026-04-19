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

  // Parse date string e.g. "February 25, 2024"
  const parsedDate = new Date(event.date);
  const isValidDate = !isNaN(parsedDate.getTime());
  const dayOfWeek = isValidDate ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const monthName = isValidDate
    ? parsedDate.toLocaleDateString('en-US', { month: 'long' })
    : event.date;
  const dayNum = isValidDate ? parsedDate.getDate() : '';
  const yearNum = isValidDate ? parsedDate.getFullYear() : '';

  // Format time: "6:00 PM" → "at 6 PM"
  const atTime = `at ${event.time.replace(/:00(?=\s|$)/, '').trim()}`;

  return (
    <div className="min-h-screen w-full flex flex-col items-center text-center bg-gradient-to-b from-pink-100 via-white to-pink-300 px-6 pt-8 pb-12">
      {/* Logo */}
      <div className="mb-2">
        <img
          src="/Pictures/business-logo.png"
          alt="Schatzies Events"
          className="h-14 w-auto mx-auto"
        />
      </div>

      {/* Tagline */}
      <p className="mb-4 text-sm font-medium text-gray-600">
        Your <span className="font-bold text-[#df2b80]">MOST TRUSTED</span> team!
      </p>

      {/* Divider */}
      <div className="mb-5 w-3/4 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />

      {/* "The wedding of" */}
      <p className="mb-2 text-sm tracking-wide text-gray-500">The wedding of</p>

      {/* Names with pink-to-purple gradient */}
      <h2 className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl">
        {name1}
      </h2>
      <p className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl">
        &
      </p>
      <p className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl mb-4">
        {name2}
      </p>

      {/* Subtitle */}
      <p className="mb-6 text-sm leading-relaxed text-gray-600 max-w-xs">
        Together with their family and friends invites you to their wedding ceremony!
      </p>

      {/* Date Row */}
      <div className="flex flex-row items-center justify-center gap-4 mb-2">
        <div className="border-y border-pink-400 px-3 py-1">
          <p className="text-sm font-medium text-gray-700">{dayOfWeek}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500">{monthName}</p>
          <p className="font-serif text-4xl font-bold leading-none text-gray-800">{dayNum}</p>
          <p className="text-xs text-gray-500">{yearNum}</p>
        </div>
        <div className="border-y border-pink-400 px-3 py-1">
          <p className="text-sm font-medium text-gray-700">{atTime}</p>
        </div>
      </div>

      {/* Venue */}
      <p className="mb-8 font-semibold text-gray-800">{event.location}</p>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className="bg-pink-200 text-pink-600 border border-pink-500 rounded-full px-10 py-3 font-semibold shadow-lg hover:bg-pink-300 transition active:scale-95"
      >
        Proceed
      </button>
    </div>
  );
}
