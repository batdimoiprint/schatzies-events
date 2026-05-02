import { useState, useEffect } from 'react';
import {
  PlusCircle,
  ChartBar,
  Download,
  Link as LinkIcon,
  MagnifyingGlass,
  Funnel,
} from '@phosphor-icons/react';
import { generateRSVPQRCode, downloadQRCode } from '@/lib/qrCodeGenerator';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getRSVPList } from '@/api/rsvp';
import { getEventManagerEvents, getEventById } from '@/api/events';
import type { RSVPResponse } from '@/types/rsvp';
import { useAuth } from '@/hooks/useAuth';

type State = 'idle' | 'generated' | 'active';

// Backend response item that can have various formats
interface BackendRSVPItem {
  status?: string;
  isScanned?: boolean | string | { BOOL: boolean };
  guestId?: string;
  SK?: string;
  id?: string;
  guestfirstName?: string;
  firstName?: string;
  first_name?: string;
  guestlastName?: string;
  lastName?: string;
  last_name?: string;
  guestmiddleName?: string;
  middleName?: string;
  middle_name?: string;
  contactNumber?: string;
  contact_number?: string;
  message?: string;
  qrCode?: string | { S: string };
  [key: string]: unknown;
}

export function QrCodePage() {
  const [state, setState] = useState<State>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'guest-list'>('overview');
  const [qrCode, setQrCode] = useState<string>('');
  const [currentQRId, setCurrentQRId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // RSVP Data state
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  const { user } = useAuth();

  const [eventPax, setEventPax] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsEventsLoading(true);
      try {
        const data = await getEventManagerEvents();

        // Filter events: Clients only see their own, Admins/Organizers see everything
        const userEvents =
          user?.role === 'CLIENT' ? data.filter((e) => e.clientId === user.user_id) : data;

        if (userEvents.length > 0) {
          const firstEvent = userEvents[0];
          setSelectedEventId((prev) => prev || firstEvent.id);

          if ((firstEvent as any).pax) setEventPax(Number((firstEvent as any).pax));

          // Fetch full details to get the most accurate capacity (eventPax)
          try {
            const fullDetails = await getEventById(firstEvent.id);
            const pax =
              fullDetails.eventPax ||
              (fullDetails as any).event_pax ||
              (fullDetails.package as any)?.pax ||
              (firstEvent as any).pax ||
              200;
            if (pax > 0) setEventPax(Number(pax));
          } catch (e) {
            console.error('Error fetching event capacity:', e);
            // Fallback to 200 if we couldn't fetch details but know it's a client event
            if (!(firstEvent as any).pax) setEventPax(200);
          }
        }
      } catch (error) {
        console.error('Error fetching events for QR Management:', error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]); // Re-run if user changes

  useEffect(() => {
    // Load persisted QR code and fetch guests for the specific selected event
    if (selectedEventId) {
      fetchRSVPs(selectedEventId);

      const savedQR = localStorage.getItem(`qr_code_${selectedEventId}`);
      const savedQRId = localStorage.getItem(`qr_id_${selectedEventId}`);
      if (savedQR && savedQRId) {
        setQrCode(savedQR);
        setCurrentQRId(savedQRId);
        setState('active');
      } else {
        // Reset state if no QR found for this specific event
        setCurrentQRId('');
        setState('idle');
      }
    }
  }, [selectedEventId]);

  const fetchRSVPs = async (eventId: string) => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      // Try fetching with the raw ID
      let data = await getRSVPList(eventId);

      // If no data, try with the EVENT# prefix just in case the backend requires it
      if ((!data || data.length === 0) && !eventId.startsWith('EVENT#')) {
        try {
          const altData = await getRSVPList(`EVENT#${eventId}`);
          if (altData && altData.length > 0) data = altData;
        } catch {
          /* ignore fallback error */
        }
      }

      // Map database fields to the format the UI expects
      const mappedData: RSVPResponse[] = (Array.isArray(data) ? data : []).map(
        (item: BackendRSVPItem) => {
          const rawStatus = (item.status || '').toString().toUpperCase();
          const isAttending =
            rawStatus === 'ATTENDING' || rawStatus === 'CONFIRMED' || rawStatus === 'TRUE';

          const scanned =
            item.isScanned === true ||
            (item.isScanned &&
              typeof item.isScanned === 'object' &&
              'BOOL' in item.isScanned &&
              (item.isScanned as { BOOL: boolean }).BOOL === true) ||
            item.isScanned === 'true';

          return {
            id: String(item.guestId || item.SK?.split('#')[1] || item.id || ''),
            guestId: String(item.guestId || item.SK?.split('#')[1] || item.id || ''),
            firstName: String(item.guestfirstName || item.firstName || item.first_name || 'Guest'),
            lastName: String(item.guestlastName || item.lastName || item.last_name || ''),
            middleName: String(item.guestmiddleName || item.middleName || item.middle_name || ''),
            contactNumber: String(item.contactNumber || item.contact_number || ''),
            status: (isAttending ? 'Attending' : 'Not Attending') as 'Attending' | 'Not Attending',
            isScanned: scanned,
            isVerified: Boolean(
              item.isVerified === true ||
              (item.isVerified &&
                typeof item.isVerified === 'object' &&
                'BOOL' in (item.isVerified as any) &&
                (item.isVerified as any).BOOL === true) ||
              item.isVerified === 'true'
            ),
            qrCode: String(
              typeof item.qrCode === 'object' && item.qrCode && 'S' in (item.qrCode as any)
                ? (item.qrCode as any).S
                : item.qrCode || ''
            ),
            message: String(item.message || ''),
          } as RSVPResponse;
        }
      );

      setRsvps(mappedData);
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
      // Fallback or local notification could go here if needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId && (activeTab === 'guest-list' || activeTab === 'overview')) {
      fetchRSVPs(selectedEventId);
    }
  }, [selectedEventId, activeTab]);

  const generateQRCode = async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    try {
      const qrId = `qr-${Date.now()}`;
      const invitationUrl = `${window.location.origin}/invitation/${selectedEventId}/${qrId}`;
      const qrDataUrl = await generateRSVPQRCode(invitationUrl, selectedEventId);
      setQrCode(qrDataUrl);
      setCurrentQRId(qrId);
      localStorage.setItem(`qr_code_${selectedEventId}`, qrDataUrl);
      localStorage.setItem(`qr_id_${selectedEventId}`, qrId);
      setState('active');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) downloadQRCode(qrCode, 'wedding-invitation.png');
  };
  const handleCopyLink = () => {
    const invitationLink = `${window.location.origin}/invitation/${selectedEventId}/${currentQRId}`;
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const filteredRsvps = rsvps.filter((rsvp) => {
    const fullName =
      `${rsvp.firstName} ${rsvp.middleName ? rsvp.middleName + ' ' : ''}${rsvp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) || rsvp.contactNumber.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Attending' && rsvp.status === 'Attending') ||
      (statusFilter === 'Not Attending' && rsvp.status === 'Not Attending') ||
      (statusFilter === 'Arrived' && rsvp.isScanned);
    return matchesSearch && matchesStatus && (rsvp.isVerified || rsvp.status === 'Not Attending');
  });

  const displayRsvps = rsvps.filter((r) => r.isVerified || r.status === 'Not Attending');
  const verifiedRsvps = rsvps.filter((r) => r.isVerified);
  const totalRSVPs = displayRsvps.length;
  const attendingCount = displayRsvps.filter(
    (r) => r.status === 'Attending' && r.isVerified
  ).length;
  const notAttendingCount = displayRsvps.filter((r) => r.status === 'Not Attending').length;
  const arrivedCount = verifiedRsvps.filter((r) => r.isScanned).length;
  const pendingCount = Math.max(0, eventPax - attendingCount - notAttendingCount);

  const stats = [
    {
      label: 'Confirmed',
      count: attendingCount,
      pct: eventPax > 0 ? `${(attendingCount / eventPax) * 100}%` : '0%',
      bar: 'bg-green-400',
      text: 'text-green-600',
    },
    {
      label: 'Declined',
      count: notAttendingCount,
      pct: eventPax > 0 ? `${(notAttendingCount / eventPax) * 100}%` : '0%',
      bar: 'bg-red-500',
      text: 'text-red-500',
    },
    {
      label: 'Pending',
      count: pendingCount,
      pct: eventPax > 0 ? `${(pendingCount / eventPax) * 100}%` : '0%',
      bar: 'bg-orange-300',
      text: 'text-orange-600',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <LoadingScreen isLoading={isLoading} />

      <div className="flex min-h-[6rem] items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2834]">RSVP Management</h1>
          <p className="mt-1 text-sm text-[#696373]">
            Oversee your invitations and monitor attendance in real-time.
          </p>
        </div>
      </div>

      {state === 'active' && (
        <div className="mb-6 flex items-end justify-between border-b border-gray-200">
          <div className="flex gap-6">
            {['overview', 'guest-list'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'overview' | 'guest-list')}
                className={`pb-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'border-b-2 border-[#df2b80] text-[#df2b80]' : 'text-[#696373] hover:text-[#2d2834]'}`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
          {!qrCode && (
            <button
              onClick={() => setState('idle')}
              className="mb-2 flex items-center gap-2 rounded-md bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-300 transition active:scale-95"
              disabled={isLoading}
            >
              <PlusCircle weight="bold" size={18} /> Create QR Code
            </button>
          )}
        </div>
      )}

      {state === 'idle' && (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#f8f5fe] shadow-inner p-10 text-center">
          {isEventsLoading ? (
            <div className="flex flex-col items-center">
              <div className="size-10 animate-spin rounded-full border-4 border-[#df2b80] border-t-transparent" />
              <p className="mt-4 text-sm font-semibold text-[#696373]">Checking for events...</p>
            </div>
          ) : !selectedEventId ? (
            <div className="flex flex-col items-center max-w-sm">
              <div className="mb-4 rounded-full bg-pink-50 p-4 text-[#df2b80]">
                <PlusCircle weight="bold" size={48} />
              </div>
              <h3 className="text-xl font-bold text-[#2d2834]">No Events Found</h3>
              <p className="mt-2 text-sm text-[#696373]">
                You need to have an active event to generate an RSVP QR code. Please create or
                select an event first!
              </p>
            </div>
          ) : (
            <button
              onClick={generateQRCode}
              disabled={isLoading}
              className="flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#df2b80] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all duration-300"
            >
              <PlusCircle weight="bold" size={24} /> Create QR Code
            </button>
          )}
        </div>
      )}

      {state === 'active' && activeTab === 'overview' && (
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <p className="text-base font-bold text-[#df2b80]">Schatzies Events</p>
              {qrCode && (
                <div className="mt-4 rounded-lg bg-white p-4 shadow-inner border border-gray-50">
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
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-sm hover:bg-gray-50"
                >
                  <Download weight="bold" size={14} /> Download QR
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#df2b80] shadow-sm hover:bg-gray-50"
                >
                  <LinkIcon weight="bold" size={14} /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

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
                  {stats.map(({ label, pct, count, bar, text }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs font-semibold text-[#696373]">
                        {label}
                      </span>
                      <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded transition-all duration-1000 ${bar}`}
                          style={{ width: pct }}
                        />
                      </div>
                      <span className={`w-10 shrink-0 text-right text-xs font-bold ${text}`}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center text-xs text-[#696373]">
                <div className="flex gap-4">
                  Capacity: <strong>{eventPax}</strong>
                  <span>
                    Arrived: <strong className="text-blue-600">{arrivedCount}</strong>
                  </span>
                </div>
                <span>
                  Total Responses:{' '}
                  <strong>
                    {totalRSVPs}/{eventPax}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === 'active' && activeTab === 'guest-list' && (
        <div className="animate-[fadeIn_0.3s_ease-out] rounded-xl bg-white shadow-md border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-bold text-[#2d2834]">Guest List Responses</h3>
              <p className="mt-0.5 text-xs text-[#696373]">Track who's coming to your event</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
                <input
                  type="text"
                  placeholder="Search name or contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white"
                />
              </div>
              <div className="relative">
                <Funnel className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-xs font-medium text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Attending">Attending</option>
                  <option value="Not Attending">Not Attending</option>
                  <option value="Arrived">Arrived</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="mt-2 w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-[#696373]">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Guest Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Arrival Status</th>
                  <th className="px-4 py-3 text-center font-semibold">RSVP Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#696373] italic">
                      No guests found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp, i) => (
                    <tr
                      key={rsvp.id}
                      className="border-b border-gray-50 bg-white transition-all duration-200 hover:bg-pink-50/50"
                      style={{ animation: `slideUp 0.35s ease-out ${i * 0.04}s both` }}
                    >
                      <td className="px-4 py-3.5 text-xs font-medium text-[#696373]">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold text-white">
                            {rsvp.firstName.charAt(0)}
                          </div>
                          <span className="font-medium text-[#2d2834]">{`${rsvp.firstName} ${rsvp.middleName ? rsvp.middleName + ' ' : ''}${rsvp.lastName}`}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#696373]">{rsvp.contactNumber}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-bold ${rsvp.isScanned ? 'bg-blue-100 text-blue-700' : rsvp.status === 'Not Attending' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                          {rsvp.isScanned
                            ? 'Arrived'
                            : rsvp.status === 'Not Attending'
                              ? 'Absent'
                              : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${rsvp.status === 'Attending' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                        >
                          <span
                            className={`inline-block size-1.5 rounded-full ${rsvp.status === 'Attending' ? 'bg-green-500' : 'bg-red-500'}`}
                          />{' '}
                          {rsvp.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
