import { useState, useEffect } from 'react';
import {
  PlusCircle,
  ChartBar,
  Download,
  Link as LinkIcon,
  MagnifyingGlass,
  Funnel,
} from '@phosphor-icons/react';
import { downloadQRCode } from '@/lib/qrCodeGenerator';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getRSVPList, scanGuest, generateEventRsvpQr } from '@/api/rsvp';
import { getEventManagerEvents } from '@/api/events';
import type { RSVPResponse } from '@/types/rsvp';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '@/hooks/useAuth';

type State = 'idle' | 'generated' | 'active';

export function RSVPPage() {
  const [state, setState] = useState<State>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'guest-list' | 'scanner'>('overview');
  const [qrCode, setQrCode] = useState<string>('');
  const [currentQRId, setCurrentQRId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // RSVP Data state
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
    guest?: { firstName: string; lastName: string; isScanned: boolean };
  } | null>(null);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  // Event List state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsSearchQuery, setEventsSearchQuery] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsEventsLoading(true);
      try {
        const data = await getEventManagerEvents();

        // Filter events: Clients only see their own, Admins/Organizers see everything
        const userEvents =
          user?.role === 'CLIENT' ? data.filter((e: any) => e.clientId === user.user_id) : data;

        setEvents(userEvents);

        if (userEvents.length > 0) {
          // Only set the initial event if one isn't already selected
          const initialEvent = userEvents[0];
          setSelectedEventId((prev) => prev || initialEvent.id);
          setSelectedEvent((prev: any) => prev || initialEvent);
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
  }, [user?.user_id]); // Only re-run if the logged-in user changes

  useEffect(() => {
    // Fetch event's RSVP QR code from backend and load guests
    if (selectedEventId) {
      fetchRSVPs(selectedEventId);

      // Check if backend already has a QR code for this event
      const loadQr = async () => {
        try {
          const data = await generateEventRsvpQr(selectedEventId);
          if (data.qrCode) {
            setQrCode(data.qrCode);
            setCurrentQRId(data.s3Key || selectedEventId);
            setState('active');
          } else {
            // Also check localStorage as fallback
            const savedQR = localStorage.getItem(`qr_code_${selectedEventId}`);
            const savedQRId = localStorage.getItem(`qr_id_${selectedEventId}`);
            if (savedQR && savedQRId) {
              setQrCode(savedQR);
              setCurrentQRId(savedQRId);
              setState('active');
            } else {
              setQrCode('');
              setCurrentQRId('');
              setState('idle');
            }
          }
        } catch {
          // No QR yet — show idle state
          setQrCode('');
          setCurrentQRId('');
          setState('idle');
        }
      };
      
      getEventManagerEvents().then(data => {
        const ev = data.find(e => e.id === selectedEventId);
        if (ev) setSelectedEvent(ev);
      });

      loadQr();
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
        } catch (e) {
          /* ignore fallback error */
        }
      }

      // Map database fields to the format the UI expects
      const mappedData = (Array.isArray(data) ? data : []).map((item: any) => {
        const rawStatus = (item.status || '').toString().toUpperCase();
        const isAttending =
          rawStatus === 'ATTENDING' || rawStatus === 'CONFIRMED' || rawStatus === 'TRUE';

        // Handle DynamoDB BOOL format or standard boolean
        const scanned =
          item.isScanned === true ||
          (item.isScanned && typeof item.isScanned === 'object' && item.isScanned.BOOL === true) ||
          item.isScanned === 'true';

        return {
          id: item.guestId || item.SK?.split('#')[1] || item.id,
          guestId: item.guestId || item.SK?.split('#')[1] || item.id,
          firstName: item.guestfirstName || item.firstName || item.first_name || 'Guest',
          lastName: item.guestlastName || item.lastName || item.last_name || '',
          middleName: item.guestmiddleName || item.middleName || item.middle_name || '',
          contactNumber: item.contactNumber || item.contact_number || '',
          status: isAttending ? 'Attending' : 'Not Attending',
          isScanned: scanned,
          isVerified:
            item.isVerified === true ||
            (item.isVerified &&
              typeof item.isVerified === 'object' &&
              item.isVerified.BOOL === true) ||
            item.isVerified === 'true',
          qrCode: item.qrCode?.S || item.qrCode || '', // CRITICAL: Include the Base64 data!
          message: item.message || '',
        };
      });

      setRsvps(mappedData);
    } catch (err: any) {
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

  useEffect(() => {
    if (activeTab === 'scanner' && selectedEventId) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 20,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        /* verbose= */ false
      );

      const onScanSuccess = async (decodedText: string) => {
        let eventId = '';
        let guestId = '';

        if (decodedText.startsWith('{')) {
          const data = JSON.parse(decodedText);
          eventId = data.event_id || data.eventId;
          guestId = data.guest_id || data.guestId || data.rsvpId;
        } else if (decodedText.includes('/invitation/')) {
          // Handle new format: /invitation/eventId/guestId
          const parts = decodedText.split('/invitation/')[1].split('/');
          eventId = parts[0];
          guestId = parts[1];
        } else {
          // Handle query param format: ?eventId=...&rsvpId=...
          const params = new URLSearchParams(decodedText.split('?')[1] || decodedText);
          eventId = params.get('event_id') || params.get('eventId') || '';
          guestId = params.get('guest_id') || params.get('guestId') || params.get('rsvpId') || '';

          // If guestId is a full URL (legacy format), extract only the ID from the path
          if (guestId.includes('/invitation/')) {
            guestId = guestId.split('/').filter(Boolean).pop() || guestId;
          }
        }

        if (!eventId || !guestId || eventId !== selectedEventId) {
          setScanResult({ success: false, message: 'Invalid or incorrect QR Code', type: 'error' });
          return;
        }

        // Only try to pause if the scanner is actually in a scanning state (camera)
        try {
          if (scanner.getState() === 1) scanner.pause(true);
        } catch (e) {
          /* ignore pause error */
        }

        // NEW: Search the local RSVP list to find the REAL backend ID for this guest
        console.log('DEBUG - SCANNED ID FROM QR:', guestId);
        const matchedGuest = rsvps.find((g) => {
          const cleanGuestId = guestId.replace('RSVP#', '').replace('guest-', '');
          const isMatch =
            g.id === cleanGuestId ||
            g.guestId === cleanGuestId ||
            g.SK?.includes(cleanGuestId) ||
            guestId.includes(g.id || '');
          if (isMatch) console.log('DEBUG - MATCHED GUEST IN LIST:', g.firstName, g.lastName);
          return isMatch;
        });

        if (!matchedGuest) {
          console.warn('DEBUG - NO MATCH FOUND IN GUEST LIST FOR ID:', guestId);
          console.log(
            'DEBUG - CURRENT GUEST LIST IDS:',
            rsvps.map((g) => g.id)
          );
        }

        // Send the scan to the backend
        try {
          // Now that the backend stores the URL, we can just send the decodedText
          const result = await scanGuest(selectedEventId, decodedText);
          
          const isResultSuccess =
            result.success ||
            result.id ||
            result.guest ||
            result.SK ||
            result.guestName ||
            (result.message || '').toLowerCase().includes('checked in') ||
            (result.message || '').toLowerCase().includes('already');

          if (isResultSuccess) {
            const guest = result.guest || result;
            const firstName =
              guest.guestName ||
              guest.guestfirstName ||
              guest.firstName ||
              guest.first_name ||
              'Guest';
            const lastName = guest.guestlastName || guest.lastName || guest.last_name || '';

            setScanResult({
              success: true,
              message: result.message || 'Guest checked in successfully',
              type: (result.message || '').toLowerCase().includes('already')
                ? 'warning'
                : 'success',
              guest: { firstName, lastName, isScanned: true },
            });
            fetchRSVPs(selectedEventId);
          } else {
            setScanResult({
              success: false,
              message: result.message || result.error || 'Scan failed (Invalid QR)',
              type: 'error',
            });
          }
        } catch (err: any) {
          console.error('Scan error:', err);
          const serverMessage =
            err?.response?.data?.message || err?.response?.data?.error || err.message;
          setScanResult({ success: false, message: `Scan Error: ${serverMessage}`, type: 'error' });
        } finally {
          // Re-enable scanner after a delay
          setTimeout(() => {
            if (scanner.getState() === 2) scanner.resume();
          }, 4000);
        }
      };

      scanner.render(onScanSuccess, (_err) => {});
      return () => {
        scanner.clear().catch((error) => console.error('Failed to clear scanner', error));
      };
    }
  }, [activeTab, selectedEventId, rsvps]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (scanResult) {
      timeout = setTimeout(() => setScanResult(null), 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [scanResult]);

  const generateQRCode = async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    try {
      const data = await generateEventRsvpQr(selectedEventId);
      setQrCode(data.qrCode);
      setCurrentQRId(data.s3Key || selectedEventId);
      setState('active');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCode) return;
    try {
      // Fetch the S3 presigned URL as a blob for proper download
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      downloadQRCode(blobUrl, 'rsvp-invitation-qr.png');
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: direct link download
      downloadQRCode(qrCode, 'rsvp-invitation-qr.png');
    }
  };
  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const invitationLink = `${baseUrl}/rsvp?eventId=${selectedEventId}`;
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
    return matchesSearch && matchesStatus && rsvp.isVerified;
  });

  const verifiedRsvps = rsvps.filter((r) => r.isVerified);
  const totalRSVPs = verifiedRsvps.length;
  const attendingCount = verifiedRsvps.filter((r) => r.status === 'Attending').length;
  const notAttendingCount = verifiedRsvps.filter((r) => r.status === 'Not Attending').length;
  const arrivedCount = verifiedRsvps.filter((r) => r.isScanned).length;
  const pendingVerificationCount = rsvps.length - verifiedRsvps.length;

  const stats = [
    {
      label: 'Confirmed',
      count: attendingCount,
      pct: totalRSVPs > 0 ? `${(attendingCount / totalRSVPs) * 100}%` : '0%',
      bar: 'bg-green-400',
      text: 'text-green-600',
    },
    {
      label: 'Declined',
      count: notAttendingCount,
      pct: totalRSVPs > 0 ? `${(notAttendingCount / totalRSVPs) * 100}%` : '0%',
      bar: 'bg-red-500',
      text: 'text-red-500',
    },
    {
      label: 'Unverified',
      count: pendingVerificationCount,
      pct: rsvps.length > 0 ? `${(pendingVerificationCount / rsvps.length) * 100}%` : '0%',
      bar: 'bg-orange-300',
      text: 'text-orange-600',
    },
  ];

  const activeEventsList = events.filter((e) => {
    if (!eventsSearchQuery.trim()) return true;
    const q = eventsSearchQuery.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.client?.toLowerCase().includes(q);
  });

  return (
    <div className="relative flex h-[calc(100vh-150px)] w-full gap-4 lg:gap-6 bg-transparent pb-4 overflow-hidden">
      <LoadingScreen isLoading={isLoading} />

      {/* ─────────── LEFT SIDEBAR (EVENT LIST) ─────────── */}
      <div className="w-full lg:w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm hidden lg:flex">
        <div className="border-b border-[#f0edf4] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2d2834]">Select Event</h2>
          </div>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
            <input
              type="text"
              placeholder="Search events..."
              value={eventsSearchQuery}
              onChange={(e) => setEventsSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#ddd8e8] bg-[#f6f5f8] py-2.5 pl-10 pr-4 text-sm text-[#4f4a56] outline-none focus:border-[#df2b80]"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          {isEventsLoading ? (
            <div className="flex items-center justify-center gap-2 p-8">
              <div className="size-5 animate-spin rounded-full border-2 border-[#df2b80] border-t-transparent" />
              <span className="text-sm text-[#a49cb3]">Loading events...</span>
            </div>
          ) : activeEventsList.length > 0 ? (
            activeEventsList.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`flex cursor-pointer items-center gap-3 border-b border-[#f0edf4] p-4 transition-colors ${
                  selectedEventId === evt.id
                    ? 'border-l-4 border-l-[#df2b80] bg-[#fafafa]'
                    : 'border-l-4 border-l-transparent hover:bg-[#fafafa]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-[#2d2834]">
                    {evt.title || 'Untitled Event'}
                  </h4>
                  <p className="truncate text-xs font-medium text-[#696373]">
                    {evt.client || 'Unknown Client'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm font-medium text-[#a49cb3]">
              No events found.
            </div>
          )}
        </div>
      </div>

      {/* ─────────── RIGHT SIDE (MAIN AREA) ─────────── */}
      <div className="flex-1 flex-col overflow-hidden rounded-2xl border border-[#e2deea] bg-white shadow-sm flex relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fbf8fd]">
          {state === 'active' && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex gap-4 sm:gap-6">
                {['overview', 'guest-list', 'scanner'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'border-b-2 border-[#df2b80] text-[#df2b80]' : 'text-[#696373] hover:text-[#2d2834]'}`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>
              {!qrCode && (
                <button
                  onClick={() => setState('idle')}
                  className="mb-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-300 transition active:scale-95"
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
                  <p className="mt-4 text-sm font-semibold text-[#696373]">
                    Checking for events...
                  </p>
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
            <div className="rounded-xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[auto_1fr]">
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
                    QR CODE ID:{' '}
                    <span className="font-semibold">{currentQRId.substring(3, 13)}</span>
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800">
                    Active Invitation Link
                  </span>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={handleDownloadQR}
                      className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-[#df2b80] shadow-sm hover:bg-gray-50"
                    >
                      <Download weight="bold" size={14} /> Download QR
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-[#df2b80] shadow-sm hover:bg-gray-50"
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
                      <span>
                        Capacity: <strong>150</strong>
                      </span>
                      <span>
                        Arrived: <strong className="text-blue-600">{arrivedCount}</strong>
                      </span>
                    </div>
                    <span>
                      Total Responses: <strong>{totalRSVPs}/150</strong>
                    </span>
                  </div>
                </div>
              </div>
                  <div className="mt-6 flex justify-between items-center text-xs text-[#696373]">
                    <div className="flex gap-4">
                      <span>
                        Capacity: <strong>{selectedEvent?.pax || 'TBA'}</strong>
                      </span>
                      <span>
                        Arrived: <strong className="text-blue-600">{arrivedCount}</strong>
                      </span>
                    </div>
                    <span>
                      Total Responses: <strong>{totalRSVPs}/{selectedEvent?.pax || 'TBA'}</strong>
                    </span>
                  </div>
            </div>
          )}

          {state === 'active' && activeTab === 'guest-list' && (
            <div className="animate-[fadeIn_0.3s_ease-out] rounded-xl bg-white shadow-md border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6 gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#2d2834]">Guest List Responses</h3>
                  <p className="mt-0.5 text-xs text-[#696373]">Track who's coming to your event</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-[250px]">
                    <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
                    <input
                      type="text"
                      placeholder="Search name or contact..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-xs text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white"
                    />
                  </div>
                  <div className="relative w-full md:w-auto">
                    <Funnel className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b2acbf]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-9 pr-8 text-xs font-medium text-[#4f4a56] outline-none focus:border-[#df2b80] focus:bg-white"
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
                          <td className="px-4 py-3.5 text-xs font-medium text-[#696373]">
                            {i + 1}
                          </td>
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

          {state === 'active' && activeTab === 'scanner' && (
            <div className="animate-[fadeIn_0.3s_ease-out] rounded-xl bg-white p-8 shadow-md border border-gray-100">
              <div className="mx-auto max-w-md">
                <h3 className="mb-4 text-center text-lg font-bold text-[#2d2834]">
                  Scan Guest QR Code
                </h3>
                <div
                  id="reader"
                  className="overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 shadow-inner"
                ></div>
                {scanResult && (
                  <div
                    className={`mt-6 rounded-lg p-4 text-center animate-in fade-in zoom-in duration-300 border ${scanResult.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : scanResult.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'}`}
                  >
                    <p className="text-sm font-bold">{scanResult.message}</p>
                    {scanResult.guest && (
                      <p className="mt-1 text-xs font-medium text-gray-700">
                        Guest: {scanResult.guest.firstName} {scanResult.guest.lastName}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] opacity-60">Resetting in 3 seconds...</p>
                  </div>
                )}
                {!scanResult && (
                  <p className="mt-6 text-center text-xs text-[#696373]">
                    Position the QR code within the frame to scan.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}
