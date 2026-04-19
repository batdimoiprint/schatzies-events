'use client';

import LoadingScreen from '@/components/ui/LoadingScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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
  const names = selectedEvent.title.split('&');
  const name1 = names[0]?.trim() || selectedEvent.couple?.name1 || 'Partner';
  const name2 = names[1]?.trim() || selectedEvent.couple?.name2 || 'Partner';
  const parsedDate = new Date(selectedEvent.date);
  const isValidDate = !isNaN(parsedDate.getTime());
  const dayOfWeek = isValidDate ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const monthName = isValidDate
    ? parsedDate.toLocaleDateString('en-US', { month: 'long' })
    : selectedEvent.date;
  const dayNum = isValidDate ? parsedDate.getDate() : '';
  const yearNum = isValidDate ? parsedDate.getFullYear() : '';
  const atTime = `at ${selectedEvent.time.replace(/:00(?=\s|$)/, '').trim()}`;

  return (
    <>
      <LoadingScreen isLoading={transitioning} />
      <div className="min-h-screen w-full flex flex-col items-center text-center bg-gradient-to-b from-pink-100 via-white to-pink-300 px-6 pt-8 pb-12">
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
        <p className="mb-2 text-sm tracking-wide text-gray-500">The wedding of</p>
        <h2 className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl">
          {name1}
        </h2>
        <p className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl">
          &
        </p>
        <p className="font-serif text-6xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-700 drop-shadow-2xl mb-4">
          {name2}
        </p>
        <p className="mb-6 text-sm leading-relaxed text-gray-600 max-w-xs">
          Together with their family and friends invites you to their wedding ceremony!
        </p>
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
        <p className="mb-8 font-semibold text-gray-800">{selectedEvent.location}</p>
        <button
          onClick={onProceed}
          className="bg-pink-200 text-pink-600 border border-pink-500 rounded-full px-10 py-3 font-semibold shadow-lg hover:bg-pink-300 transition active:scale-95 flex items-center gap-2"
        >
          {transitioning ? <LoadingSpinner size="sm" color="text-pink-600" /> : null}
          Proceed
        </button>
      </div>
    </>
  );
}
