import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';

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

const SERVICE_REQUIREMENTS = [
  {
    color: 'bg-blue-500',
    title: 'Food',
    subtitle: 'Classic Buffet',
    items: [
      {
        label: '1. Appetizer',
        detail: '1 light bite (e.g., finger foods, soup, or a fresh salad)',
      },
      {
        label: '2. Main Course',
        detail: '1 chicken dish (e.g., Cordon Bleu, Baked Chicken, or Creamy Parmesan Chicken)',
      },
      {
        label: '3. Dessert',
        detail:
          '1 to 3 sweet treats (e.g., Mango Breal, style cakes, panna cotta, or Chocolate fountain)',
      },
    ],
    manpower:
      'At head of facilitating\n1 stand-by server of the dishes\n1 to provers for the customers',
    resources: 'McUsine for Main Course\nKnifeBlades for Dessert\nFlameOfAppetizer for Appetizer',
  },
  {
    color: 'bg-orange-400',
    title: 'Decorations',
    subtitle: 'Theme: Enchanted Forest',
    items: [
      {
        label:
          'Heavy greenery, hanging vines, fairy lights, wood accents, and white or pastel flowers',
      },
    ],
    materials:
      'Peacock chair, vintage couch, or rattan throne\nDelights and curtain lights\nFoliage wall panels and large hanging vines\nGlass cylinder vases',
  },
];

const ALLOCATION_RESOURCES = [
  {
    color: 'bg-pink-500',
    role: 'Event Coordinator',
    name: 'Ken Chan',
    time: '00:00 – 00:00',
  },
  {
    color: 'bg-orange-400',
    role: 'Host',
    name: 'Angel U. Nicorn',
    time: '00:00 – 00:00',
  },
  {
    color: 'bg-red-500',
    role: 'Technicals',
    items: [
      { label: '1. Audio Cue', detail: 'Add manpower & specific things\nhahaha' },
      { label: '2. Lighting Cue', detail: 'Add manpower & specific things\nhahaha' },
      { label: '3. Visual/Screen Cue', detail: 'Add manpower & specific things\nhahaha' },
      { label: '4. System Tech/Troubleshooter', detail: 'Add manpower & specific things\nhahaha' },
      { label: '5. Dry-run date', detail: 'Add manpower & specific things\nhahaha' },
    ],
  },
];

const CHECKLIST_MEETINGS = [
  {
    title: 'Meetings',
    color: 'text-pink-500',
    items: [
      { label: 'Meeting 1 | Zus Coffee', time: '00:00 – 00:00' },
      { label: 'Meeting 2 | Zus Coffee', time: '00:00 – 00:00' },
    ],
  },
  {
    title: 'Checked',
    color: 'text-pink-500',
    checkItems: [
      { label: 'Technicals Manpower', checked: true },
      { label: 'DJ lighting', checked: true },
      { label: 'Fresh Flowers Delivery', checked: false },
      { label: 'Dry-run (DAY)', checked: false },
      { label: 'Dry-run (DAY2)', checked: false },
    ],
  },
];

const PROGRAM_FLOW = [
  {
    time: '00:00 – 00:00',
    description:
      'Description Here\nLorem ipsum dolor sit amet, consectetur adipiscing elit, in sed do...',
  },
  { time: '00:00 – 00:00', description: 'Description Here\nLorem ipsum dolor sit amet...' },
  { time: '00:00 – 00:00', description: 'Description Here\nLorem ipsum...' },
  { time: '00:00 – 00:00', description: 'Description Here\nLorem ipsum dolor...' },
];

const TABS = ['Overview', 'Task', 'Notes', 'Flow', 'Checklist'];

// ── Illustration placeholders (SVG icons) ──────────────────────────────────────
function PackageIllustration() {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <rect x="6" y="14" width="36" height="28" rx="3" fill="#c084fc" />
        <rect x="14" y="6" width="20" height="12" rx="2" fill="#a855f7" />
        <rect x="20" y="18" width="8" height="6" rx="1" fill="white" />
      </svg>
    </div>
  );
}
function PaxIllustration() {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <circle cx="16" cy="16" r="8" fill="#60a5fa" />
        <circle cx="32" cy="16" r="8" fill="#93c5fd" />
        <ellipse cx="16" cy="36" rx="12" ry="8" fill="#3b82f6" />
        <ellipse cx="32" cy="36" rx="12" ry="8" fill="#60a5fa" />
      </svg>
    </div>
  );
}
function TypeIllustration() {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <rect x="6" y="8" width="36" height="32" rx="4" fill="#fdba74" />
        <rect x="12" y="16" width="24" height="3" rx="1.5" fill="white" />
        <rect x="12" y="23" width="16" height="3" rx="1.5" fill="white" />
        <rect x="12" y="30" width="20" height="3" rx="1.5" fill="white" />
      </svg>
    </div>
  );
}
function CostIllustration() {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <circle cx="24" cy="24" r="18" fill="#86efac" />
        <text x="24" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">
          ₱
        </text>
      </svg>
    </div>
  );
}

export function EventPlanViewingPage() {
  const [activeTab, setActiveTab] = useState('Overview');

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
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* Left: title + meta */}
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-2xl font-bold">{EVENT.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {EVENT.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                Start Date – End Date
              </span>
            </div>
          </div>

          {/* Right: progress + organizer */}
          <div className="flex flex-col items-start gap-2 sm:shrink-0 sm:items-end sm:text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold whitespace-nowrap">
                {EVENT.completion}% complete
              </span>
              <div className="h-2.5 w-32 shrink-0 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${EVENT.completion}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-white/80 leading-relaxed">
              <p>Organizer Name: {EVENT.organizer}</p>
              <p>Email | Contact Number</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Tabs Navigation ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Tab Content ────────────────────────────────────────────────── */}
      {activeTab === 'Task' ? (
        /* ── Kanban Board ──────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {/* Column: To do */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="font-bold text-gray-800">To do (3)</span>
            </div>
            <div className="flex h-[calc(100vh-350px)] min-h-[480px] flex-col gap-4 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
            </div>
          </div>

          {/* Column: In Progress */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="font-bold text-gray-800">In Progress (3)</span>
            </div>
            <div className="flex h-[calc(100vh-350px)] min-h-[480px] flex-col gap-4 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
            </div>
          </div>

          {/* Column: Completed */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="font-bold text-gray-800">Completed (3)</span>
            </div>
            <div className="flex h-[calc(100vh-350px)] min-h-[480px] flex-col gap-4 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-40 w-full rounded-lg border border-gray-200 bg-gray-50" />
            </div>
          </div>
        </div>
      ) : activeTab === 'Overview' ? (
        /* ── Master White Canvas (Overview) ───────────────────────────────── */
        <div className="flex flex-col gap-8 rounded-xl border border-gray-200 bg-white p-4 shadow-md sm:p-6">
          {/* ── 5. Top Row: 4 Mini-Cards ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Event Package */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Event Package</p>
                <p className="mt-1 text-base font-bold text-[#2d2834]">{EVENT.packageName}</p>
              </div>
              <PackageIllustration />
            </div>

            {/* Event Pax */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Event Pax</p>
                <p className="mt-1 text-3xl font-black text-[#2d2834]">{EVENT.pax}</p>
              </div>
              <PaxIllustration />
            </div>

            {/* Event Type */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Event Type</p>
                <p className="mt-1 text-base font-bold text-[#2d2834]">{EVENT.eventType}</p>
              </div>
              <TypeIllustration />
            </div>

            {/* Event Cost */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Event Cost</p>
                <p className="mt-1 text-2xl font-black text-[#2d2834]">{EVENT.cost}</p>
              </div>
              <CostIllustration />
            </div>
          </div>

          {/* ── 6. Bottom 4-Column Section ────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1 — Service Requirements */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-700">Service Requirements</h3>
              <div className="flex flex-col gap-4">
                {SERVICE_REQUIREMENTS.map((section, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${section.color}`} />
                      <span className="text-sm font-semibold text-[#2d2834]">{section.title}</span>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">{section.subtitle}</p>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {section.items?.map((item, j) => (
                        <li key={j}>
                          <p className="font-medium text-[#2d2834]">{item.label}</p>
                          {'detail' in item && item.detail && (
                            <p className="mt-0.5 pl-2 text-gray-400">{item.detail}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                    {section.manpower && (
                      <div className="mt-3 border-t border-gray-100 pt-2 text-xs">
                        <p className="font-semibold text-[#2d2834]">Manpower</p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-500">
                          {section.manpower}
                        </p>
                      </div>
                    )}
                    {section.resources && (
                      <div className="mt-2 text-xs">
                        <p className="font-semibold text-[#2d2834]">Resources</p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-500">
                          {section.resources}
                        </p>
                      </div>
                    )}
                    {section.materials && (
                      <div className="mt-2 text-xs">
                        <p className="font-semibold text-[#2d2834]">Materials</p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-500">
                          {section.materials}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2 — Allocation Resources */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-700">Allocation Resources</h3>
              <div className="flex flex-col gap-4">
                {ALLOCATION_RESOURCES.map((resource, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${resource.color}`} />
                      <span className="text-sm font-semibold text-[#2d2834]">{resource.role}</span>
                    </div>
                    {resource.name && (
                      <div className="text-xs text-gray-600">
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-gray-400">{resource.time}</p>
                      </div>
                    )}
                    {resource.items && (
                      <ul className="space-y-2 text-xs text-gray-600">
                        {resource.items.map((item, j) => (
                          <li key={j}>
                            <p className="font-medium text-[#2d2834]">{item.label}</p>
                            <p className="mt-0.5 whitespace-pre-line pl-2 text-gray-400">
                              {item.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3 — Checklist & Meeting */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-700">Checklist &amp; Meeting</h3>
              <div className="flex flex-col gap-4">
                {CHECKLIST_MEETINGS.map((section, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className={`mb-3 text-sm font-semibold ${section.color}`}>{section.title}</p>
                    {section.items && (
                      <ul className="space-y-2 text-xs text-gray-600">
                        {section.items.map((item, j) => (
                          <li key={j}>
                            <p className="font-medium text-[#2d2834]">{item.label}</p>
                            <p className="text-gray-400">{item.time}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.checkItems && (
                      <ul className="space-y-1.5 text-xs">
                        {section.checkItems.map((item, j) => (
                          <li key={j} className="flex items-center gap-2">
                            {item.checked ? (
                              <CheckCircle2 className="size-3.5 shrink-0 text-pink-500" />
                            ) : (
                              <Circle className="size-3.5 shrink-0 text-gray-300" />
                            )}
                            <span className={item.checked ? 'text-[#2d2834]' : 'text-gray-400'}>
                              {item.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 4 — Program Flow */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-700">Program Flow</h3>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4">
                  {PROGRAM_FLOW.map((item, i) => (
                    <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-[#2d2834]">DATE AND TIME</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                      <p className="mt-1 whitespace-pre-line text-xs text-gray-500 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'Flow' ? (
        /* ── Flow: Timeline Calendar ───────────────────────────────────────── */
        <div>
          {/* Controls row */}
          <div className="mb-4 flex items-center justify-between gap-2">
            {/* Export Button */}
            <button
              onClick={() => {
                // Simple JSON export of calendar events
                const events = [
                  { title: 'Example', time: '7AM-9AM', color: 'gray', description: 'Description' },
                  { title: 'Example', time: '8AM-9AM', color: 'green', description: 'Description' },
                  {
                    title: 'Example',
                    time: '10AM-11AM',
                    color: 'purple',
                    description: 'Description',
                  },
                ];

                const dataStr = JSON.stringify(events, null, 2);
                const dataUri =
                  'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                const link = document.createElement('a');
                link.setAttribute('href', dataUri);
                link.setAttribute('download', 'calendar-schedule.json');
                link.click();
              }}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
              Hide empty time slots
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-pink-500" />
            </label>
          </div>

          {/* Calendar container */}
          <div className="relative h-[500px] overflow-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Time grid */}
            <div className="relative min-w-[600px]">
              {/* Hour rows */}
              {['5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM'].map((hour) => (
                <div key={hour} className="flex items-start" style={{ height: '80px' }}>
                  <span className="w-12 shrink-0 pt-0 text-[10px] font-medium text-gray-400">
                    {hour}
                  </span>
                  <div className="flex-1 border-b border-gray-100" />
                </div>
              ))}

              {/* ── Event blocks (absolute positioned over the grid) ── */}
              {/* Block 1: 7AM–9AM, gray */}
              <div
                className="absolute border-l-4 border-gray-400 bg-gray-200/50 p-2"
                style={{ top: '160px', left: '56px', width: '220px', height: '160px' }}
              >
                <p className="text-[11px] font-bold text-gray-500">Example</p>
                <p className="mt-1 text-[10px] text-gray-700">Description</p>
              </div>

              {/* Block 2: 8AM–9AM, green */}
              <div
                className="absolute border-l-4 border-green-500 bg-green-200/50 p-2"
                style={{ top: '240px', left: '290px', width: '220px', height: '80px' }}
              >
                <p className="text-[11px] font-bold text-green-600">Example</p>
                <p className="mt-1 text-[10px] text-gray-700">Description</p>
              </div>

              {/* Block 3: 10AM–11AM, purple */}
              <div
                className="absolute border-l-4 border-purple-500 bg-purple-200/50 p-2"
                style={{ top: '400px', left: '56px', width: '220px', height: '80px' }}
              >
                <p className="text-[11px] font-bold text-purple-600">Example</p>
                <p className="mt-1 text-[10px] text-gray-700">Description</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Placeholder for Notes / Checklist ────────────────────────────── */
        <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
          <p className="text-sm text-gray-400">{activeTab} content coming soon.</p>
        </div>
      )}

      {/* ── 7. Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-blue-400">View-only access:</span>
        <span className="text-gray-500">
          You can monitor the event preparation progress, but changes are managed by the organizer.
        </span>
      </div>
    </div>
  );
}
