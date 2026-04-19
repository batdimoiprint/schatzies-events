import { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle,
  ChartBar,
  Download,
  Link as LinkIcon,
  Bell,
  Gear,
  ChatCircle,
} from '@phosphor-icons/react';
import { generateRSVPQRCode, downloadQRCode } from '@/lib/qrCodeGenerator';
import { getAllEvents } from '@/lib/rsvpStorage';
import LoadingScreen from '@/components/ui/LoadingScreen';
import type { EventData } from '@/types/rsvp';

const guestList = [
  {
    code: '001',
    name: 'Juliana Rox Laurencio',
    contact: '09876352675',
    date: 'March 29, 2026 | 11:45 AM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
  {
    code: '002',
    name: 'Sofia B. Villanueva',
    contact: '09876352675',
    date: 'March 29, 2026 | 01:20 PM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
  {
    code: '003',
    name: 'Mateo Sebastian',
    contact: '09876352675',
    date: 'March 29, 2026 | 01:50 PM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
  {
    code: '004',
    name: 'Beatriz "Bea" Lopez',
    contact: '09876352675',
    date: 'March 29, 2026 | 03:30 PM',
    status: 'Declined',
    note: false,
    highlighted: true,
  },
  {
    code: '005',
    name: 'Dr. Ricardo Gomez',
    contact: '09876352675',
    date: 'March 29, 2026 | 06:20 PM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
  {
    code: '006',
    name: 'Elena De Guzman',
    contact: '09876352675',
    date: 'March 29, 2026 | 11:45 PM',
    status: 'Confirmed',
    note: true,
    highlighted: false,
  },
  {
    code: '007',
    name: 'Javier San Pedro',
    contact: '09876352675',
    date: 'March 30, 2026 | 08:40 AM',
    status: 'Declined',
    note: false,
    highlighted: false,
  },
  {
    code: '008',
    name: 'Clara Isabel Torres',
    contact: '09876352675',
    date: 'March 30, 2026 | 11:45 AM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
  {
    code: '009',
    name: 'Marcus Aurelio Tan',
    contact: '09876352675',
    date: 'March 30, 2026 | 05:25 PM',
    status: 'Confirmed',
    note: false,
    highlighted: false,
  },
];

type State = 'idle' | 'generated' | 'active';

export function QrCodePage() {
  const [state, setState] = useState<State>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'guest-list'>('overview');
  const [qrCode, setQrCode] = useState<string>('');
  const [currentQRId, setCurrentQRId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); // Changed from 'loading' to 'isLoading' to match the pattern
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadedEvents = getAllEvents();
    setEvents(loadedEvents);
    if (loadedEvents.length > 0) {
      setSelectedEventId(loadedEvents[0].id);
    }
  }, []);

  const generateQRCode = async () => {
    if (!selectedEventId) return;
    setIsLoading(true);

    try {
      const qrId = `qr-${Date.now()}`;
      const invitationUrl = `${window.location.origin}/invitation/${selectedEventId}/${qrId}`;
      const qrDataUrl = await generateRSVPQRCode(invitationUrl, selectedEventId);
      setQrCode(qrDataUrl);
      setCurrentQRId(qrId);
      setState('generated');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      downloadQRCode(qrCode, 'wedding-invitation.png');
    }
  };

  const handleCopyLink = () => {
    const invitationLink = `${window.location.origin}/invitation/${selectedEventId}/${currentQRId}`;
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Reusable Loading Screen - same as InquiryForm */}
      <LoadingScreen isLoading={isLoading} />

      {/* ── Header row: title + icons ── */}
      <div className="flex min-h-[6rem] items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2834]">RSVP Management</h1>
          <p className="mt-1 text-sm text-[#696373]">
            Oversee your invitations and monitor attendance in real-time.
          </p>
        </div>

        {state === 'active' && (
          <div className="flex items-center gap-4 text-gray-600">
            <Bell size={22} />
            <img
              src="/Pictures/organizerpics/Profile Picture.png"
              alt="User avatar"
              className="size-8 rounded-full object-cover"
            />
            <Gear size={22} />
          </div>
        )}
      </div>

      {/* Event Selector - Always visible to select which event to generate QR for */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-semibold text-[#2d2834]">Select Event to Generate QR:</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[#2d2834]"
          disabled={isLoading}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {/* ── Tabs (aligned with sidebar tagline) ── */}
      {state === 'active' && (
        <div className="mb-6 flex items-end justify-between border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-semibold transition ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#df2b80] text-[#df2b80]'
                  : 'text-[#696373] hover:text-[#2d2834]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('guest-list')}
              className={`pb-2 text-sm font-semibold transition ${
                activeTab === 'guest-list'
                  ? 'border-b-2 border-[#df2b80] text-[#df2b80]'
                  : 'text-[#696373] hover:text-[#2d2834]'
              }`}
            >
              Guest List
            </button>
          </div>
          <button
            onClick={() => setState('idle')}
            className="mb-2 flex items-center gap-2 rounded-md bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-300 active:scale-95"
            disabled={isLoading}
          >
            <PlusCircle weight="bold" size={18} />
            Create QR Code
          </button>
        </div>
      )}

      {/* ── STATE: Idle ── */}
      {state === 'idle' && (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-[#E6E6E6] shadow-inner">
          <button
            onClick={generateQRCode}
            disabled={isLoading || !selectedEventId}
            className="flex items-center gap-2.5 rounded-md bg-white px-6 py-3 text-lg font-semibold text-pink-600 shadow-lg transition hover:shadow-xl active:scale-95 disabled:opacity-50"
          >
            <PlusCircle weight="bold" size={22} />
            Create QR Code
          </button>
        </div>
      )}

      {/* ── STATE: Generated modal ── */}
      {state === 'generated' && (
        <div className="relative mt-6 flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-[#E6E6E6] shadow-inner">
          <div className="absolute inset-0 rounded-lg bg-black/20" />
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-10 py-10 text-center shadow-2xl">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500 shadow-md">
              <CheckCircle weight="fill" size={40} color="white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#2d2834]">QR Generated!</h2>
            <p className="text-sm leading-relaxed text-[#696373]">
              QR Code Secured. Share this link to begin receiving guest responses.
            </p>
            <button
              onClick={() => setState('active')}
              className="mt-2 w-full rounded-full bg-green-500 py-3 text-base font-bold text-white shadow-md transition hover:bg-green-600 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── STATE: Active — Overview ── */}
      {state === 'active' && activeTab === 'overview' && (
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr]">
            {/* ── QR Code column ── */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg">
              <p className="text-base font-bold text-[#df2b80]">Schatzies Events</p>

              {qrCode && (
                <div className="mt-4 rounded-lg bg-white p-4">
                  <img src={qrCode} alt="Generated QR Code" className="w-48 h-48" />
                </div>
              )}

              <p className="mt-5 text-sm font-extrabold uppercase tracking-wide text-[#2d2834]">
                Share QR to Invite Guest!
              </p>
              <p className="mt-1 text-xs text-[#696373]">
                QR CODE ID: <span className="font-semibold">{currentQRId.substring(3, 13)}</span>
              </p>

              <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800">
                Active Invitation Link
              </span>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-md transition hover:bg-gray-50"
                >
                  <Download weight="bold" size={14} />
                  Download QR
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-md transition hover:bg-gray-50"
                >
                  <LinkIcon weight="bold" size={14} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* ── Attendance Breakdown column ── */}
            <div className="flex flex-col">
              <h3 className="pb-2 text-lg font-extrabold text-[#2d2834] border-b border-black">
                Attendance Breakdown
              </h3>

              <div className="mt-5 rounded-xl border border-gray-100 bg-white p-5 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#2d2834]">Live Response Analytics</p>
                    <p className="text-[11px] text-[#696373]">
                      A visual representation of your current guest status.
                    </p>
                  </div>
                  <ChartBar weight="fill" size={18} className="text-[#696373]" />
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {[
                    {
                      label: 'Confirmed',
                      pct: '55%',
                      count: 50,
                      bar: 'bg-green-400',
                      text: 'text-green-600',
                    },
                    {
                      label: 'Declined',
                      pct: '12%',
                      count: 10,
                      bar: 'bg-red-500',
                      text: 'text-red-500',
                    },
                    {
                      label: 'Pending',
                      pct: '90%',
                      count: 90,
                      bar: 'bg-yellow-400',
                      text: 'text-yellow-600',
                    },
                  ].map(({ label, pct, count, bar, text }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs font-semibold text-[#696373]">
                        {label}
                      </span>
                      <div className="flex-1 h-6 rounded bg-gray-100">
                        <div className={`h-full rounded ${bar}`} style={{ width: pct }} />
                      </div>
                      <span className={`w-6 shrink-0 text-right text-xs font-bold ${text}`}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-right text-xs text-[#696373]">
                Current Capacity: <span className="font-semibold">150 Pax</span> | Responses:{' '}
                <span className="font-semibold">60/150</span> | Last updated:{' '}
                <span className="italic">2 mins ago</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── STATE: Active – Guest List ── */}
      {state === 'active' && activeTab === 'guest-list' && (
        <div className="rounded-xl bg-white shadow-md p-6">
          {/* Container header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2d2834]">Guest List Responses</h3>
            <span className="text-sm font-bold text-gray-400">60/150</span>
          </div>

          {/* Column headers */}
          <div className="mb-1 grid grid-cols-[80px_1fr_160px_230px_170px] gap-4 border-b border-gray-100 px-4 pb-3 text-xs font-semibold text-gray-500">
            <span>Guest Code</span>
            <span>Guest Name</span>
            <span>Contact Number</span>
            <span>Date Responded</span>
            <span>Response</span>
          </div>

          {/* Rows */}
          {guestList.map((guest, i) => (
            <div
              key={guest.code}
              className={[
                'grid grid-cols-[80px_1fr_160px_230px_170px] gap-4 px-4 py-3 items-center text-sm',
                guest.highlighted
                  ? 'relative z-10 rounded-md bg-white shadow-lg'
                  : i % 2 === 0
                    ? 'bg-white'
                    : 'bg-[#FFF5F8]',
              ].join(' ')}
            >
              <span className="text-gray-500">{guest.code}</span>
              <span className="font-medium text-[#2d2834]">{guest.name}</span>
              <span className="text-gray-600">{guest.contact}</span>
              <span className="text-gray-600">{guest.date}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-4 py-1 text-xs font-semibold ${
                    guest.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-200 text-red-700'
                  }`}
                >
                  {guest.status}
                </span>
                {guest.note && <ChatCircle size={16} className="text-gray-400" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
