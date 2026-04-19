import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, User, Calendar, MapPin, Bell, Settings } from 'lucide-react';

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
  completion: 89,
  eventStatus: 'Contract Signing',
};

const GUESTS = [
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
  const [showWelcome, setShowWelcome] = useState(true);

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
        <div className="flex items-center gap-3 pt-1">
          <button
            aria-label="Notifications"
            className="text-[#696373] transition hover:text-[#2d2834]"
          >
            <Bell className="size-5" />
          </button>
          <img
            src="/Pictures/organizerpics/Profile Picture.png"
            alt="User avatar"
            className="size-8 rounded-full object-cover"
          />
          <button aria-label="Settings" className="text-[#696373] transition hover:text-[#2d2834]">
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* ── Asymmetric dashboard grid ─────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── LEFT COLUMN (2 / 3) ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Days To Go card */}
          <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-md">
            {/* Left: countdown + event details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-black leading-none text-pink-500">
                  {EVENT.daysToGo}
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-[#2d2834]">Days To Go!</p>
                  <p className="text-xs text-[#696373]">
                    Your dream event is being crafted with precision and care.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-4 py-2">
                  <User className="size-4 shrink-0 text-pink-500" />
                  <span className="font-medium text-[#df2b80]">{EVENT.organizer}</span>
                  <span className="ml-auto text-xs text-[#696373]">(Assigned Organizer)</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-4 py-2">
                  <Calendar className="size-4 shrink-0 text-pink-500" />
                  <span className="font-medium text-[#df2b80]">{EVENT.eventDate}</span>
                  <span className="ml-auto text-xs text-[#696373]">(Event Date)</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-[#e8e4ee] px-4 py-2">
                  <MapPin className="size-4 shrink-0 text-pink-500" />
                  <span className="font-medium text-[#df2b80]">{EVENT.venue}</span>
                  <span className="ml-auto text-xs text-[#696373]">(Event Venue)</span>
                </div>
              </div>
            </div>
            {/* Right: 3D folder illustration */}
            <div className="hidden shrink-0 pl-4 sm:block">
              <img
                src="/Pictures/folder-3d.png"
                alt="Event folder"
                className="w-44 drop-shadow-xl"
              />
            </div>
          </div>

          {/* Event Plan Status card */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-pink-500">{EVENT.eventTitle}</h2>
                <p className="text-xs text-[#696373]">Event Title</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#2d2834]">
                  {EVENT.completion}% complete
                </span>
                <div className="h-3 w-36 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-pink-500 transition-all"
                    style={{ width: `${EVENT.completion}%` }}
                  />
                </div>
                <span className="rounded border border-[#e8e4ee] px-2 py-0.5 text-xs text-[#696373]">
                  {EVENT.eventStatus}
                </span>
              </div>
            </div>

            <h3 className="mb-4 mt-4 text-sm font-semibold text-[#2d2834]">Event Plan Status</h3>

            {/* 2 × 2 inner grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Service Requirements */}
              <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2d2834]">Service Requirements</span>
                  <button className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-600">
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
                  <span className="text-xs font-semibold text-[#2d2834]">Allocation Resources</span>
                  <button className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-600">
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
                  <span className="text-xs font-semibold text-[#2d2834]">Checklist & Meeting</span>
                  <button className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-600">
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
                  <span className="text-xs font-semibold text-[#2d2834]">Program Flow</span>
                  <button className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-600">
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
          <div className="rounded-xl bg-gradient-to-r from-pink-400 to-purple-600 p-6 shadow-md">
            <h2 className="text-2xl font-extrabold text-white">{EVENT.packageName}</h2>
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
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#2d2834]">Guest List</h2>
              <button className="rounded-lg bg-pink-500 px-3 py-1 text-xs font-bold text-white hover:bg-pink-600">
                View List
              </button>
            </div>
            {/* Column headers */}
            <div className="mb-3 flex items-center justify-between border-b border-[#e8e4ee] pb-2 text-xs font-semibold text-[#696373]">
              <span>Guest Name</span>
              <span>Status</span>
            </div>
            {/* Guest rows */}
            <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              {GUESTS.map((guest) => (
                <li key={guest.name} className="flex items-center justify-between text-sm">
                  <span className="text-[#2d2834]">{guest.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
        </div>
      </div>

      {/* ── Welcome modal overlay ─────────────────────────────────────────── */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          {/* No white card — content floats directly on the blurred overlay */}
          <div className="relative flex flex-col items-center text-center">
            {/* Close button — white, large, absolute top-right */}
            <button
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome"
              className="absolute -top-2 -right-8 text-white transition hover:opacity-70"
            >
              <X className="size-8" />
            </button>

            {/* 3D Character Illustration */}
            <img
              src="/Pictures/welcome-character.png"
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
            <Link
              to="/client"
              onClick={() => setShowWelcome(false)}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-bold text-pink-600 shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition hover:bg-gray-50"
            >
              Go to Overview
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
