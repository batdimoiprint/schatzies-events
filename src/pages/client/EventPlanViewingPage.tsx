import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ServiceRequirementsModal } from '@/components/client/ServiceRequirementsModal';
import { AllocationResourcesModal } from '@/components/client/AllocationResourcesModal';
import { ChecklistMeetingModal } from '@/components/client/ChecklistMeetingModal';
import { ProgramFlowModal } from '@/components/client/ProgramFlowModal';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const EVENT = {
  title: 'Kring and Dave Wedding',
  date: 'January 3, 2026',
  completion: 89,
  organizer: 'John Errol Sebial',
  email: 'john.sebial@schatzies.com',
  contact: '+63 912 345 6789',
  packageName: 'Blooms Package',
  pax: 150,
  eventType: 'Debut Event Type',
  cost: '50,000',
};

// ── Illustration placeholders (img tags) ─────────────────────────────────────
function PackageIllustration() {
  return (
    <img
      src="/Pictures/event-package-icon.png"
      className="w-16 h-auto object-contain"
      alt="Event Package"
    />
  );
}
function PaxIllustration() {
  return (
    <img
      src="/Pictures/event-pax-icon.png"
      className="w-16 h-auto object-contain"
      alt="Event Pax"
    />
  );
}
function TypeIllustration() {
  return (
    <img
      src="/Pictures/event-type-icon.png"
      className="w-16 h-auto object-contain"
      alt="Event Type"
    />
  );
}
function CostIllustration() {
  return (
    <img
      src="/Pictures/event-cost-icon.png"
      className="w-16 h-auto object-contain"
      alt="Event Cost"
    />
  );
}

export function EventPlanViewingPage() {
  const [showServiceReq, setShowServiceReq] = useState(false);
  const [showAllocationRes, setShowAllocationRes] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showProgramFlow, setShowProgramFlow] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2d2834] md:text-4xl">
            Event Plan Viewing
          </h1>
          <p className="mt-1 text-sm font-medium text-[#696373]">
            Review your event plan details prepared by your organizer.
          </p>
        </div>
      </div>

      {/* ── 2. Gradient Event Banner ───────────────────────────────────────── */}
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* Left: title + meta */}
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-2xl font-bold">{EVENT.title}</h2>
            <div className="flex flex-col gap-1 mt-2 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {EVENT.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Start Date – End Date
              </span>
            </div>
          </div>

          {/* Right: progress + organizer */}
          <div className="flex flex-col items-start gap-2 w-full sm:w-[60%]">
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm font-semibold whitespace-nowrap">
                {EVENT.completion}% complete
              </span>
              <div className="h-6 flex-1 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${EVENT.completion}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-white/80 leading-relaxed self-end text-right">
              <p>Organizer Name: {EVENT.organizer}</p>
              <p>Email | Contact Number</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Mini-Cards + 2×2 Grid (always visible, no tabs) ────────────── */}
      <div className="flex flex-col gap-6 mt-4">
        {/* Top Row: 4 Mini-Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Event Package */}
          <div className="flex justify-between items-center rounded-md bg-white border border-gray-200 p-4 shadow-sm">
            <div>
              <p className="text-lg font-bold text-gray-700">Event Package</p>
              <p className="text-lg font-light text-gray-500">{EVENT.packageName}</p>
            </div>
            <PackageIllustration />
          </div>

          {/* Event Pax */}
          <div className="flex justify-between items-center rounded-md bg-white border border-gray-200 p-4 shadow-sm">
            <div>
              <p className="text-lg font-bold text-gray-700">Event Pax</p>
              <p className="text-lg font-light text-gray-500">{EVENT.pax}</p>
            </div>
            <PaxIllustration />
          </div>

          {/* Event Type */}
          <div className="flex justify-between items-center rounded-md bg-white border border-gray-200 p-4 shadow-sm">
            <div>
              <p className="text-lg font-bold text-gray-700">Event Type</p>
              <p className="text-lg font-light text-gray-500">{EVENT.eventType}</p>
            </div>
            <TypeIllustration />
          </div>

          {/* Event Cost */}
          <div className="flex justify-between items-center rounded-md bg-white border border-gray-200 p-4 shadow-sm">
            <div>
              <p className="text-lg font-bold text-gray-700">Event Cost</p>
              <p className="text-lg font-light text-gray-500">{EVENT.cost}</p>
            </div>
            <CostIllustration />
          </div>
        </div>

        {/* ── 6. Bottom 2×2 Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1 — Service Requirements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-pink-500 font-semibold text-sm min-w-0">
                Service Requirements
              </span>
              <button
                onClick={() => setShowServiceReq(true)}
                className="bg-pink-400 text-white rounded-full px-4 py-1 text-[10px] font-bold shadow-sm hover:bg-pink-500 transition-colors"
              >
                View
              </button>
            </div>
            <ul className="space-y-0.5 text-xs text-[#696373]">
              <li className="font-medium text-[#2d2834]">• Food</li>
              <li className="pl-3">Classic Buffet</li>
              <li className="pl-3 font-medium text-[#2d2834]">1. Appetizer</li>
              <li className="pl-4 text-[11px] text-[#8a8697]">
                1 light bite (e.g., finger foods, soup, or a fresh salad)
              </li>
              <li className="pl-3 font-medium text-[#2d2834]">2. Main Course</li>
              <li className="pl-4 text-[11px] text-[#8a8697]">
                1 chicken dish (e.g., Cordon Bleu, Baked Chicken, or Garlic Parmesan Chicken)
              </li>
              <li className="pl-3 font-medium text-[#2d2834]">3. Dessert</li>
              <li className="pl-4 text-[11px] text-[#8a8697]">
                1 to 2 sweet treats (e.g., Mango Bravo style cakes, panna cotta, or a chocolate
                fountain)
              </li>
            </ul>
          </div>

          {/* Card 2 — Allocation Resources */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-pink-500 font-semibold text-sm min-w-0">
                Allocation Resources
              </span>
              <button
                onClick={() => setShowAllocationRes(true)}
                className="bg-pink-400 text-white rounded-full px-4 py-1 text-[10px] font-bold shadow-sm hover:bg-pink-500 transition-colors"
              >
                View
              </button>
            </div>
            <ul className="space-y-3 text-xs">
              <li>
                <span className="font-medium text-pink-500">• Event Coordinator</span>
                <p className="pl-3 text-[#2d2834]">Ken Chan</p>
                <p className="pl-3 text-[#8a8697]">00:00 – 00:00</p>
              </li>
              <li>
                <span className="font-medium text-orange-400">• Host</span>
                <p className="pl-3 text-[#2d2834]">Angel U. Nicorn</p>
                <p className="pl-3 text-[#8a8697]">00:00 – 00:00</p>
              </li>
            </ul>
          </div>

          {/* Card 3 — Checklist & Meeting */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-pink-500 font-semibold text-sm min-w-0">
                Checklist &amp; Meeting
              </span>
              <button
                onClick={() => setShowChecklist(true)}
                className="bg-pink-400 text-white rounded-full px-4 py-1 text-[10px] font-bold shadow-sm hover:bg-pink-500 transition-colors"
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

          {/* Card 4 — Program Flow */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-pink-500 font-semibold text-sm min-w-0">Program Flow</span>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1 border border-gray-200 text-gray-500 rounded-full px-3 py-1 text-[10px] font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => setShowProgramFlow(true)}
                  className="bg-pink-400 text-white rounded-full px-4 py-1 text-[10px] font-bold shadow-sm hover:bg-pink-500 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
            <div>
              <p className="font-bold text-lg text-[#2d2834] mb-3">DATE AND TIME</p>
              <div className="flex gap-4 items-start">
                <p className="text-xs text-[#8a8697] shrink-0">00:00</p>
                <div className="w-px bg-gray-200 self-stretch"></div>
                <div className="flex-1">
                  <p className="font-medium text-[#2d2834] text-sm">Description Here</p>
                  <p className="line-clamp-3 text-[11px] text-[#8a8697] mt-1 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt justo quis
                    viverra bibendum. Curabitur ipsum mi, bibendum ut dictum non, commodo a purus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-blue-400">View-only access:</span>
        <span className="text-gray-500">
          You can monitor the event preparation progress, but changes are managed by the organizer.
        </span>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {showServiceReq && <ServiceRequirementsModal onClose={() => setShowServiceReq(false)} />}
      {showAllocationRes && (
        <AllocationResourcesModal onClose={() => setShowAllocationRes(false)} />
      )}
      {showChecklist && <ChecklistMeetingModal onClose={() => setShowChecklist(false)} />}
      {showProgramFlow && <ProgramFlowModal onClose={() => setShowProgramFlow(false)} />}
    </div>
  );
}
