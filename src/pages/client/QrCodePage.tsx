import { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle,
  ChartBar,
  Download,
  Link as LinkIcon,
} from '@phosphor-icons/react';
import { generateRSVPQRCode, downloadQRCode } from '@/lib/qrCodeGenerator';
import { getAllEvents } from '@/lib/rsvpStorage';
import LoadingScreen from '@/components/ui/LoadingScreen';

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
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadedEvents = getAllEvents();
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

  const handleDone = () => {
    setIsDoneLoading(true);
    setTimeout(() => {
      setIsDoneLoading(false);
      setState('active');
    }, 1500);
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
      <LoadingScreen isLoading={isLoading || isDoneLoading} />

      {/* ── Header row: title + icons ── */}
      <div className="flex min-h-[6rem] items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2834]">RSVP Management</h1>
          <p className="mt-1 text-sm text-[#696373]">
            Oversee your invitations and monitor attendance in real-time.
          </p>
        </div>
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
              onClick={handleDone}
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr]">
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
        <div className="animate-[fadeIn_0.3s_ease-out] rounded-xl bg-white shadow-md">
          {/* Container header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-[#2d2834]">Guest List Responses</h3>
              <p className="mt-0.5 text-xs text-[#696373]">Track who's coming to your event</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {guestList.filter((g) => g.status === 'Confirmed').length} Confirmed
              </span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                {guestList.filter((g) => g.status === 'Declined').length} Declined
              </span>
              <span className="text-sm font-bold text-[#696373]">60/150</span>
            </div>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto px-2 pb-2 sm:px-4 sm:pb-4">
            <table className="mt-2 w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-[#696373]">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Guest Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Date Responded</th>
                  <th className="px-4 py-3 text-center font-semibold">Response</th>
                </tr>
              </thead>
              <tbody>
                {guestList.map((guest, i) => (
                  <tr
                    key={guest.code}
                    className="border-b border-gray-50 bg-white transition-all duration-200 hover:bg-pink-50/50"
                    style={{ animation: `slideUp 0.35s ease-out ${i * 0.04}s both` }}
                  >
                    <td className="px-4 py-3.5 text-xs font-medium text-[#696373]">{guest.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold text-white">
                          {guest.name.charAt(0)}
                        </div>
                        <span className="font-medium text-[#2d2834]">{guest.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#696373]">{guest.contact}</td>
                    <td className="px-4 py-3.5 text-[#696373]">{guest.date}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                          guest.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <span
                          className={`inline-block size-1.5 rounded-full ${guest.status === 'Confirmed' ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        {guest.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 sm:px-6">
            <p className="text-xs text-[#696373]">
              Showing <span className="font-semibold">{guestList.length}</span> of{' '}
              <span className="font-semibold">150</span> guests
            </p>
            <p className="text-xs italic text-[#696373]">Last updated: 2 mins ago</p>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
