import { useState } from 'react';
import { User, Calendar, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ServiceRequirementsModal } from '@/components/client/ServiceRequirementsModal';
import { AllocationResourcesModal } from '@/components/client/AllocationResourcesModal';
import { ChecklistMeetingModal } from '@/components/client/ChecklistMeetingModal';
import { ProgramFlowModal } from '@/components/client/ProgramFlowModal';

// ── Static mock data ──────────────────────────────────────────────────────────
const EVENT = {
  daysToGo: 10,
  organizer: 'John Errol Sebial',
  eventDate: 'August 22, 2026 (Friday)',
  venue: 'Manila Marriott Hotel',
  packageName: 'De Luxe Package',
  eventType: 'Wedding',
  pax: 150,
  cost: 'Php 585,000',
  eventTitle: 'Kring and Dave Wedding',
  completion: 70,
  eventStatus: 'Contract Signing',
};

const GUESTS = [
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Juliana Rox Laurencio', status: 'Confirmed' },
  { name: 'Sofia B. Villanueva', status: 'Confirmed' },
  { name: 'Mateo Sebastian', status: 'Confirmed' },
  { name: 'Beatriz "Bea" Lopez', status: 'Declined' },
  { name: 'Dr. Ricardo Gomez', status: 'Confirmed' },
  { name: 'Elena De Guzman', status: 'Confirmed' },
  { name: 'Javier San Pedro', status: 'Declined' },
  { name: 'Clara Isabel Torres', status: 'Confirmed' },
  { name: 'Marcus Aurelio Tan', status: 'Confirmed' },
];

export function ClientDashboardPage() {
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('clientWelcomeSeen');
    return !hasSeenWelcome; // Show welcome if not seen before
  });
  const [showServiceReq, setShowServiceReq] = useState(false);
  const [showAllocationRes, setShowAllocationRes] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showProgramFlow, setShowProgramFlow] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('clientWelcomeSeen', 'true');
  };

  return (
    <div className="relative">
      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-sm font-medium text-[#696373]">
            Here's a summary of the upcoming event you're planning.
          </p>
        </div>
      </div>

      {/* ── Asymmetric dashboard grid ─────────────────────────────────────── */}
      <ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── LEFT COLUMN (2 / 3) ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Days To Go card */}
            <div className="relative flex flex-col items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
              {/* Left: countdown + event details */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="font-black leading-none sm:text-8xl lg:text-9xl text-[clamp(3rem,8vw,10rem)]"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #700F81 0%, #FF0066 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {EVENT.daysToGo}
                  </span>
                  <div>
                    <p
                      className="font-black text-2xl sm:text-3xl lg:text-4xl leading-tight"
                      style={{
                        fontFamily: 'Libre Baskerville, serif',
                        backgroundImage: 'linear-gradient(to right, #700F81 0%, #FF0066 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Days To Go!
                    </p>
                    <p className="text-xs text-[#4A1053]">
                      Your dream event is being crafted with precision and care.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-3 py-2 sm:px-4 shadow-md bg-white">
                    <User className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                    <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                      {EVENT.organizer}
                    </span>
                    <span className="ml-auto hidden text-xs text-[#696373] sm:inline">
                      (Assigned Organizer)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-3 py-2 sm:px-4 shadow-md bg-white">
                    <Calendar className="size-5 shrink-0" style={{ color: '#700F81' }} />
                    <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                      {EVENT.eventDate}
                    </span>
                    <span className="ml-auto hidden text-xs text-[#696373] sm:inline">
                      (Event Date)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-3 py-2 sm:px-4 shadow-md bg-white">
                    <MapPin className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                    <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                      {EVENT.venue}
                    </span>
                    <span className="ml-auto hidden text-xs text-[#696373] sm:inline">
                      (Event Venue)
                    </span>
                  </div>
                </div>
              </div>
              {/* Right: 3D folder illustration - overlapping from top */}
              <div className="absolute -right-16 -top-32 hidden shrink-0 sm:block">
                <img
                  src="/Pictures/event-folder.png"
                  alt="Event folder"
                  className="w-[400px] drop-shadow-2xl lg:w-[475px]"
                />
              </div>
            </div>

            {/* Event Plan Status card */}
            <div className="rounded-xl bg-white p-6 shadow-md">
              {/* Header row */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex-shrink-0">
                  <h2
                    className="text-2xl sm:text-3xl font-bold leading-tight"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #FF0066 0%, #700F81 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {EVENT.eventTitle}
                  </h2>
                  <p className="text-xs text-[#696373] mt-1">Event Title</p>
                </div>
                <div className="group flex items-center gap-3 flex-1 min-w-[300px]">
                  <span className="text-sm font-semibold text-[#2d2834] shrink-0">
                    {EVENT.completion}% complete
                  </span>
                  {/* Progress bar — overflow visible so the tooltip isn't clipped */}
                  <div className="relative flex-1" style={{ paddingBottom: '1.5rem' }}>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 cursor-pointer">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${EVENT.completion}%`,
                          backgroundImage: 'linear-gradient(to right, #FF0066 0%, #700F81 100%)',
                        }}
                      />
                    </div>
                    {/* Tooltip anchored at the end of the fill */}
                    <div
                      className="pointer-events-none absolute top-5 -translate-x-1/2 whitespace-nowrap rounded border border-[#e8e4ee] bg-white px-3 py-1 text-xs font-medium text-[#696373] shadow-md opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
                      style={{ left: `${EVENT.completion}%` }}
                    >
                      {EVENT.eventStatus}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#e8e4ee]" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mb-4 mt-2 text-base sm:text-lg font-semibold text-[#2d2834]">
                Event Plan Status
              </h3>

              {/* 2 × 2 inner grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Service Requirements */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Service Requirements
                    </span>
                    <button
                      onClick={() => setShowServiceReq(true)}
                      className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                    >
                      View
                    </button>
                  </div>
                  <ul className="space-y-0.5 text-xs text-[#696373]">
                    <li className="font-medium text-[#2d2834]">• Food</li>
                    <li className="pl-3">Classic Buffet</li>
                    <li className="pl-3 font-medium text-[#2d2834]">1. Appetizer</li>
                    <li className="pl-4 text-[11px] text-[#8a8697]">
                      Slight bite size, finger foods, salsa or a fresh salad.
                    </li>
                    <li className="pl-3 font-medium text-[#2d2834]">2. Main Course</li>
                  </ul>
                </div>

                {/* Allocation Resources */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Allocation Resources
                    </span>
                    <button
                      onClick={() => setShowAllocationRes(true)}
                      className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                    >
                      View
                    </button>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <span className="font-medium text-pink-500">• Event Coordinator</span>
                      <p className="pl-3 text-[#2d2834]">Ken Chan</p>
                      <p className="pl-3 text-[#8a8697]">00:00 – 00:00</p>
                    </li>
                    <li>
                      <span className="font-medium text-pink-500">• Host</span>
                      <p className="pl-3 text-[#2d2834]">Angel U. Nicorn</p>
                      <p className="pl-3 text-[#8a8697]">00:00 – 00:00</p>
                    </li>
                  </ul>
                </div>

                {/* Checklist & Meeting */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Checklist & Meeting
                    </span>
                    <button
                      onClick={() => setShowChecklist(true)}
                      className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                    >
                      View
                    </button>
                  </div>
                  <ul className="space-y-0.5 text-xs">
                    <li className="font-medium text-pink-500">• Meetings</li>
                    <li className="pl-3 text-[#2d2834]">Meeting 1 | Zus Coffee</li>
                    <li className="pl-3 text-[#8a8697]">00:00 – 00:00</li>
                    <li className="pl-3 text-[#2d2834]">Meeting 2 | Zus Coffee</li>
                    <li className="pl-3 text-[#8a8697]">00:00 – 00:00</li>
                  </ul>
                </div>

                {/* Program Flow */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#2d2834]">Program Flow</span>
                    <button
                      onClick={() => setShowProgramFlow(true)}
                      className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                    >
                      View
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li>
                      <p className="font-medium text-[#2d2834]">DATE AND TIME</p>
                      <p className="text-[#8a8697]">00:00 – 00:00</p>
                    </li>
                    <li>
                      <p className="font-medium text-[#2d2834]">Description Here</p>
                      <p className="line-clamp-3 text-[11px] text-[#8a8697]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, in constituent pads
                        quis...
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (1 / 3) ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* De Luxe Package card — gradient, no white */}
            <div
              className="rounded-xl p-6 shadow-md"
              style={{ backgroundImage: 'linear-gradient(to right, #700F81 0%, #FF589C 100%)' }}
            >
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'Libre Baskerville, serif' }}
              >
                {EVENT.packageName}
              </h2>
              <div className="mt-4 space-y-1 text-sm text-white">
                <p>
                  <span className="font-semibold">Event Type:</span> {EVENT.eventType}
                </p>
                <p>
                  <span className="font-semibold">Pax:</span> {EVENT.pax}
                </p>
                <p>
                  <span className="font-semibold">Cost:</span> {EVENT.cost}
                </p>
              </div>
            </div>

            {/* Guest List card */}
            <div
              className="rounded-xl bg-white p-6 shadow-md flex flex-col flex-1 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <div className="mb-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-[#2d2834]">Guest List</h2>
                <button
                  onClick={() => setShowGuestListModal(true)}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                >
                  View List
                </button>
              </div>
              {/* Column headers */}
              <div className="mb-3 flex items-center justify-between border-b border-[#e8e4ee] pb-2 text-sm font-semibold text-[#696373] shrink-0">
                <span>Guest Name</span>
                <span>Status</span>
              </div>
              {/* Guest rows - scrollable with fade effect */}
              <div className="flex-1 relative">
                <ul className="absolute inset-0 space-y-3 overflow-y-auto pr-2">
                  {GUESTS.map((guest) => (
                    <li
                      key={guest.name}
                      className="flex items-center justify-between gap-2 text-base"
                    >
                      <span className="min-w-0 truncate text-[#2d2834]">{guest.name}</span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                          guest.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-200 text-red-700'
                        }`}
                      >
                        {guest.status}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Fade-out overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, transparent, white)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {showServiceReq && <ServiceRequirementsModal onClose={() => setShowServiceReq(false)} />}
      {showAllocationRes && (
        <AllocationResourcesModal onClose={() => setShowAllocationRes(false)} />
      )}
      {showChecklist && <ChecklistMeetingModal onClose={() => setShowChecklist(false)} />}
      {showProgramFlow && <ProgramFlowModal onClose={() => setShowProgramFlow(false)} />}

      {/* ── Guest List Modal ─────────────────────────────────────────────── */}
      {showGuestListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
            style={{ maxHeight: '85vh', fontFamily: 'Source Sans Pro, sans-serif' }}
          >
            {/* Header */}
            <div className="flex items-center border-b border-gray-200 px-6 py-4 shrink-0">
              <h3 className="text-3xl font-bold text-[#1a1225]">Guest List</h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Column headers */}
              <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 text-base font-semibold text-[#696373]">
                <span>Guest Name</span>
                <span>Status</span>
              </div>
              {/* Guest rows */}
              <ul className="space-y-3">
                {GUESTS.map((guest) => (
                  <li key={guest.name} className="flex items-center justify-between gap-2">
                    <span className="text-lg text-[#2d2834]">{guest.name}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-base font-semibold ${
                        guest.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-200 text-red-700'
                      }`}
                    >
                      {guest.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 shrink-0">
              <button
                onClick={() => setShowGuestListModal(false)}
                className="w-full h-10 rounded-full bg-gradient-to-r from-[#FF0066] to-[#700F81] text-white font-bold transition hover:brightness-110"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Welcome modal overlay ─────────────────────────────────────────── */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          {/* No white card — content floats directly on the blurred overlay */}
          <div className="relative flex flex-col items-center text-center">
            {/* 3D Character Illustration */}
            <img
              src="/Pictures/overview.png"
              alt="Welcome illustration"
              className="w-72 drop-shadow-xl mb-2"
            />

            {/* Heading */}
            <h2 className="text-4xl font-bold drop-shadow-lg">
              <span className="text-white">Welcome to </span>
              <span className="text-pink-500">Schatzies</span>
              <span className="text-white">!</span>
            </h2>

            {/* Subtext */}
            <p className="mt-2 text-white text-lg drop-shadow-md">Ready to view your event plan?</p>

            {/* Solid white button */}
            <button
              onClick={handleCloseWelcome}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-bold text-pink-600 shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition hover:bg-gray-50"
            >
              Go to Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
