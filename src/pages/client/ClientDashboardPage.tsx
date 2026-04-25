import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ServiceRequirementsModal } from '@/components/client/ServiceRequirementsModal';
import { AllocationResourcesModal } from '@/components/client/AllocationResourcesModal';
import { ChecklistMeetingModal } from '@/components/client/ChecklistMeetingModal';
import { ProgramFlowModal } from '@/components/client/ProgramFlowModal';
import { GuestListModal } from '@/components/client/GuestListModal';

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
  const navigate = useNavigate();
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
          <h1 className="text-2xl font-black tracking-tight text-[#2d2834] sm:text-3xl md:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-xs font-medium text-[#696373] sm:text-sm">
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
                <div className="flex flex-col">
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <User className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                      <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                        {EVENT.organizer}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-[#696373] sm:text-xs">
                      (Assigned Organizer)
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 shrink-0" style={{ color: '#700F81' }} />
                      <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                        {EVENT.eventDate}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-[#696373] sm:text-xs">
                      (Event Date)
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                      <span className="truncate font-medium text-[#df2b80] text-sm sm:text-base">
                        {EVENT.venue}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-[#696373] sm:text-xs">
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-shrink-0">
                  <h2
                    className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight"
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
                <div className="flex flex-col gap-1 sm:flex-1">
                  <div className="group/bar flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#2d2834] shrink-0">
                      {EVENT.completion}% complete
                    </span>
                    <div className="relative flex-1">
                      <div className="h-6 overflow-hidden rounded-full bg-gray-200 cursor-pointer">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${EVENT.completion}%`,
                            backgroundImage: 'linear-gradient(to right, #FF0066 0%, #700F81 100%)',
                          }}
                        />
                      </div>
                      {/* Hover tooltip — Contract Signing */}
                      <div
                        className="pointer-events-none absolute -bottom-7 -translate-x-1/2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] text-gray-400 shadow-sm opacity-0 scale-90 transition-all duration-200 group-hover/bar:opacity-100 group-hover/bar:scale-100"
                        style={{ left: `${EVENT.completion}%` }}
                      >
                        {EVENT.eventStatus}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => navigate('/client/event-plan')}
                      className="bg-pink-400 text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-sm hover:bg-pink-500 transition-colors"
                    >
                      View Event Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* 2 × 2 inner grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {/* Service Requirements */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Service Requirements
                    </span>
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
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4 mb-8">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Allocation Resources
                    </span>
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
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-[#2d2834]">
                      Checklist & Meeting
                    </span>
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
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-5">
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-[#2d2834]">Program Flow</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Header: DATE AND TIME */}
                    <p className="text-lg font-bold text-[#2d2834] leading-tight">DATE AND TIME</p>
                    {/* Row: Time | Divider | Description */}
                    <div className="flex gap-4 items-start">
                      <p className="text-xs text-[#8a8697] shrink-0">00:00</p>
                      <div className="w-px bg-gray-200 self-stretch"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#2d2834] text-sm">Description Here</p>
                        <p className="line-clamp-3 text-[11px] text-[#8a8697] mt-1 leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, in tincidunt
                          justo quis...
                        </p>
                      </div>
                    </div>
                  </div>
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
              className="rounded-xl bg-white p-6 shadow-md flex flex-col min-h-[320px] lg:flex-1 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
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
              <div className="relative" style={{ minHeight: '200px', flex: 1 }}>
                <ul className="absolute inset-0 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
      {showGuestListModal && <GuestListModal onClose={() => setShowGuestListModal(false)} />}

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
