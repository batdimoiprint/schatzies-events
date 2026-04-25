import { useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EnvelopeAnimation } from '@/components/ui/EnvelopeAnimation';
import type { EventData } from '@/types/rsvp';

interface RSVPInvitationPageProps {
  selectedEvent: EventData;
  transitioning: boolean;
  onProceed: () => void;
}

export function RSVPInvitationPage({
  selectedEvent,
  transitioning,
  onProceed,
}: RSVPInvitationPageProps) {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showInvitation, setShowInvitation] = useState(false);

  const handleEnvelopeComplete = () => {
    setShowEnvelope(false);
    setTimeout(() => {
      setShowInvitation(true);
    }, 100);
  };

  const name1 = selectedEvent.couple?.name1 || 'Partner';
  const name2 = selectedEvent.couple?.name2 || 'Partner';
  const parsedDate = new Date(selectedEvent.date);
  const isValidDate = !isNaN(parsedDate.getTime());
  const dayOfWeek = isValidDate ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const monthName = isValidDate
    ? parsedDate.toLocaleDateString('en-US', { month: 'long' })
    : selectedEvent.date;
  const dayNum = isValidDate ? parsedDate.getDate() : '';
  const yearNum = isValidDate ? parsedDate.getFullYear() : '';
  const atTime = `at ${(selectedEvent.time || 'TBA').replace(/:00(?=\s|$)/, '').trim()}`;

  return (
    <>
      {showEnvelope && <EnvelopeAnimation onComplete={handleEnvelopeComplete} />}

      <LoadingScreen isLoading={transitioning} />
      <div
        className={`min-h-screen w-full flex flex-col items-center text-center bg-gradient-to-b from-pink-100 via-white to-pink-300 px-6 pt-8 pb-12 transition-all duration-700 ${
          showInvitation ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="mb-2">
          <img
            src="/Pictures/business-logo.png"
            alt="Schatzies Events"
            className="h-14 w-auto mx-auto"
          />
        </div>
        <p className="mb-4 text-sm font-medium text-gray-600">
          Your <span className="font-bold text-[#df2b80]">MOST TRUSTED</span> team!
        </p>
        <div className="mb-5 w-3/4 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
        <p className="mb-3 text-xs sm:text-sm tracking-wide text-gray-600">The wedding of</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-pink-600 mb-1">
          {name1}
        </h2>
        <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-pink-600 mb-1">
          &
        </p>
        <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-pink-600 mb-6">
          {name2}
        </p>
        <p className="mb-6 text-xs sm:text-sm leading-relaxed text-gray-600 max-w-xs px-4">
          Together with their family and friends invites you to their wedding ceremony!
        </p>
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 mb-2 px-4">
          <div className="border-y border-pink-400 px-2 sm:px-3 py-1">
            <p className="text-xs sm:text-sm font-medium text-gray-700">{dayOfWeek}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500">{monthName}</p>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-none text-gray-800">
              {dayNum}
            </p>
            <p className="text-xs text-gray-500">{yearNum}</p>
          </div>
          <div className="border-y border-pink-400 px-2 sm:px-3 py-1">
            <p className="text-xs sm:text-sm font-medium text-gray-700">{atTime}</p>
          </div>
        </div>
        <p className="mb-8 font-semibold text-sm sm:text-base text-gray-800 px-4">
          {selectedEvent.location}
        </p>
        <button
          onClick={onProceed}
          className="bg-pink-200 text-pink-600 border border-pink-500 rounded-full px-6 sm:px-10 py-2 sm:py-3 font-semibold shadow-lg hover:bg-pink-300 transition active:scale-95 flex items-center gap-2 text-sm sm:text-base mx-4"
        >
          {transitioning ? <LoadingSpinner size="sm" color="text-pink-600" /> : null}
          Proceed
        </button>
      </div>
    </>
  );
}
