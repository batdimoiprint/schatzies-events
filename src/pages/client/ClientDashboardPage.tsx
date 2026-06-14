import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  ServiceRequirementsModal,
  type ServiceAllocation,
} from '@/components/client/ServiceRequirementsModal';
import {
  AllocationResourcesModal,
  type ResourceAllocation,
} from '@/components/client/AllocationResourcesModal';
import {
  ChecklistMeetingModal,
  type MeetingItem,
  type ChecklistItem,
} from '@/components/client/ChecklistMeetingModal';
import { ProgramFlowModal } from '@/components/client/ProgramFlowModal';
import { GuestListModal } from '@/components/client/GuestListModal';
import { getRSVPList } from '@/api/rsvp';
import {
  getEventManagerEvents,
  getEventById,
  getEventUser,
  getEventAllocation,
  getEventFlow,
  getEventChecklist,
} from '@/api/events';
import { getCalendarEntries } from '@/api/calendar';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// ── Local shapes for loosely-typed backend payloads ────────────────────────────
interface FullEventLike {
  endDate?: string;
  dateEnd?: string;
  eventDate?: string;
  eventPackageKey?: string;
  eventPackage?: string;
  package?: { name?: string; pax?: number };
  eventType?: string;
  eventPax?: number | null;
  cost?: string;
  packageInitialAmount?: number | null;
  venue?: string;
  eventLocation?: string;
  title?: string;
  status?: string;
  organizer_id?: string;
  organizerId?: string;
}

interface BaseEventLike {
  id: string;
  organizerId?: string;
  organizer_id?: string;
  organizerName?: string;
  package?: string;
  type?: string;
  pax?: number;
  venue?: string;
  title?: string;
}

interface RsvpLike {
  isVerified?: boolean | string | { BOOL: boolean };
  status?: string;
  guestfirstName?: string;
  firstName?: string;
  guestlastName?: string;
  lastName?: string;
}

interface CalItemLike {
  eventId?: string;
  label?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
}

interface FlowSourceLike {
  id?: string;
  title?: string;
  activity?: string;
  startTime?: string;
  start?: string;
  endTime?: string;
  end?: string;
  description?: string;
  startHour?: number | string;
}

interface FlowBlock {
  id: string;
  title: string;
  from: string;
  to: string;
  description: string;
  startHour: number;
}

interface DashboardEventData {
  daysToGo: number;
  organizer: string;
  eventDate: string;
  venue: string;
  packageName: string;
  eventType: string;
  pax: number;
  cost: string;
  eventTitle: string;
  completion: number;
  eventStatus: string;
}

export function ClientDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('clientWelcomeSeen');
    return !hasSeenWelcome; // Show welcome if not seen before
  });
  const [showServiceReq, setShowServiceReq] = useState(false);
  const [showAllocationRes, setShowAllocationRes] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showProgramFlow, setShowProgramFlow] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const [guests, setGuests] = useState<Array<{ name: string; status: string }>>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [eventData, setEventData] = useState<DashboardEventData | null>(null);
  const [allocation, setAllocation] = useState<(ResourceAllocation & ServiceAllocation) | null>(
    null
  );
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [flow, setFlow] = useState<FlowBlock[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('clientWelcomeSeen', 'true');
  };

  // Fetch event and guest data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoadingEvent(true);
      setIsLoadingGuests(true);

      try {
        const events = await getEventManagerEvents();

        // Filter events: Clients only see their own
        const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
        const userEvents =
          user.role === 'CLIENT'
            ? events.filter(
                (e) =>
                  e.clientId === user.user_id ||
                  e.clientId === user.client_id ||
                  (e.client && e.client.toLowerCase().includes(userFullName))
              )
            : events;

        // Sort events: Newest first, and prioritize events that aren't "Meetings"
        const sortedEvents = userEvents.sort((a, b) => {
          const aIsMeeting = a.title.toLowerCase().includes('meeting');
          const bIsMeeting = b.title.toLowerCase().includes('meeting');
          if (aIsMeeting && !bIsMeeting) return 1;
          if (!aIsMeeting && bIsMeeting) return -1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        const userEventBase = sortedEvents.length > 0 ? sortedEvents[0] : null;

        if (userEventBase) {
          // Fetch full event details to get specific fields
          const fullEvent = await getEventById(userEventBase.id);
          console.log('Full event details:', fullEvent);

          // Fetch Organizer if available (check all possible ID fields)
          const fe = fullEvent as FullEventLike;
          const base = userEventBase as BaseEventLike;
          const orgId =
            fe.organizer_id || fe.organizerId || base.organizerId || base.organizer_id;
          let organizerName = userEventBase.organizerName || 'Assigned Organizer';
          if (orgId) {
            try {
              const org = await getEventUser(orgId);
              organizerName =
                `${org.firstName || org.user?.firstName || ''} ${org.lastName || org.user?.lastName || ''}`.trim() ||
                organizerName;
              console.log('Organizer found:', organizerName);
            } catch (e) {
              console.error('Error fetching organizer:', e);
              organizerName = 'Assigned Organizer';
            }
          }

          // Dates logic
          const endDateStr = fullEvent.endDate || fullEvent.dateEnd || fullEvent.eventDate || '';
          let daysToGo = 0;
          if (endDateStr) {
            const end = new Date(endDateStr);
            const now = new Date();
            const diff = end.getTime() - now.getTime();
            daysToGo = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
          }

          const formattedDate = endDateStr
            ? new Date(endDateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                weekday: 'long',
              })
            : 'TBD';

          // Extract package and pax info correctly (check both base and full details)
          const rawPkgName =
            fullEvent.eventPackageKey ||
            userEventBase.package ||
            fullEvent.package?.name ||
            fullEvent.eventPackage ||
            'Custom Package';

          const currentEventType = fullEvent.eventType || userEventBase.type || 'Event';

          // If package is "Others", use eventType as the display name
          const displayPkgName = rawPkgName === 'Others' ? currentEventType : rawPkgName;

          const paxCount = fe.eventPax || base.pax || fe.package?.pax || 0;

          // Cost logic: Use packageInitialAmount if available
          let costValue = fe.cost || 'TBD';
          if (fe.packageInitialAmount) {
            costValue = `₱${Number(fe.packageInitialAmount).toLocaleString()}`;
          }

          const venueValue = fe.venue || fe.eventLocation || base.venue || 'Araneta';

          setEventData({
            daysToGo,
            organizer: organizerName,
            eventDate: formattedDate,
            venue: venueValue,
            packageName: displayPkgName,
            eventType: currentEventType,
            pax: paxCount,
            cost: costValue,
            eventTitle: fullEvent.title || userEventBase.title || 'Your Event',
            completion: fullEvent.status === 'Completed' ? 100 : 89,
            eventStatus: fullEvent.status || 'Planning',
          });

          // Fetch RSVP list
          let rsvpList = await getRSVPList(userEventBase.id);
          if ((!rsvpList || rsvpList.length === 0) && !userEventBase.id.startsWith('EVENT#')) {
            try {
              const alt = await getRSVPList(`EVENT#${userEventBase.id}`);
              if (alt && alt.length > 0) rsvpList = alt;
            } catch {
              /* ignore */
            }
          }

          // Map and Filter Guests (Show verified or Not Attending)
          const mappedGuests = (Array.isArray(rsvpList) ? rsvpList : [])
            .filter((rsvp: RsvpLike) => {
              const isVerified =
                rsvp.isVerified === true ||
                (rsvp.isVerified &&
                  typeof rsvp.isVerified === 'object' &&
                  'BOOL' in rsvp.isVerified &&
                  (rsvp.isVerified as { BOOL: boolean }).BOOL === true) ||
                rsvp.isVerified === 'true';
              const rawStatus = (rsvp.status || '').toString().toUpperCase();
              // Show if verified OR if they are Not Attending (even if unverified)
              return isVerified || rawStatus === 'NOT_ATTENDING' || rawStatus === 'NOT ATTENDING';
            })
            .map((rsvp: RsvpLike) => {
              const rawStatus = (rsvp.status || '').toString().toUpperCase();
              const isAttending =
                rawStatus === 'ATTENDING' || rawStatus === 'CONFIRMED' || rawStatus === 'TRUE';
              const isDeclined =
                rawStatus === 'NOT_ATTENDING' ||
                rawStatus === 'NOT ATTENDING' ||
                rawStatus === 'FALSE';

              return {
                name:
                  `${rsvp.guestfirstName || rsvp.firstName || ''} ${rsvp.guestlastName || rsvp.lastName || ''}`.trim() ||
                  'Guest',
                status: isAttending ? 'Confirmed' : isDeclined ? 'Declined' : 'Pending',
              };
            });

          setGuests(mappedGuests);

          // Fetch additional data for modals
          try {
            const [allocRes, flowRes, calRes, checklistRes] = await Promise.all([
              getEventAllocation(userEventBase.id).catch(() => null),
              getEventFlow(userEventBase.id).catch(() => []),
              getCalendarEntries().catch(() => []),
              getEventChecklist(userEventBase.id).catch(() => []),
            ]);

            setAllocation(allocRes);

            const formatDisplayTime = (val?: string) => {
              if (!val) return '00:00';
              if (typeof val === 'string' && val.includes(':')) {
                const [h, m] = val.split(':');
                let hours = parseInt(h, 10);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                return `${hours}:${m} ${ampm}`;
              }
              return val;
            };

            const mappedFlows = Array.isArray(flowRes)
              ? flowRes
                  .map((item: FlowSourceLike) => ({
                    id: item.id || Math.random().toString(),
                    title: item.title || item.activity || 'Activity',
                    from: formatDisplayTime(item.startTime || item.start),
                    to: formatDisplayTime(item.endTime || item.end),
                    description: item.description || '',
                    startHour: parseFloat(String(item.startHour ?? '')) || 0,
                  }))
                  .sort((a: FlowBlock, b: FlowBlock) => a.startHour - b.startHour)
              : [];
            setFlow(mappedFlows);

            const eventMeetings = ((calRes as CalItemLike[]) || []).filter(
              (item: CalItemLike) =>
                item.eventId === userEventBase.id && item.label?.toUpperCase() === 'MEETING'
            );
            setMeetings(eventMeetings);
            setChecklist((checklistRes as ChecklistItem[]) || []);
          } catch (e) {
            console.error('Error fetching dashboard extra details:', e);
          }
        }
      } catch (error) {
        console.error('Overview Data Error:', error);
      } finally {
        setIsLoadingEvent(false);
        setIsLoadingGuests(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoadingEvent) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" color="text-brand" />
          <p className="text-sm font-medium text-muted-foreground">Fetching your event details...</p>
        </div>
      </div>
    );
  }

  const displayEvent = eventData;

  if (!displayEvent) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
        <Calendar className="mb-4 size-12 text-gray-300" />
        <h3 className="text-lg font-bold text-gray-900">No active event found</h3>
        <p className="mt-1 text-sm text-gray-500">
          We couldn't find any upcoming events for your account. Please contact your organizer.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
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
                    {displayEvent.daysToGo}
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
                    <p className="text-xs text-brand-deep">
                      Your dream event is being crafted with precision and care.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <User className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                      <span className="truncate font-medium text-brand text-sm sm:text-base">
                        {displayEvent.organizer}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                      (Assigned Organizer)
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 shrink-0" style={{ color: '#700F81' }} />
                      <span className="truncate font-medium text-brand text-sm sm:text-base">
                        {displayEvent.eventDate}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                      (Event Date)
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2 mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-5 shrink-0" style={{ color: '#FF0066' }} />
                      <span className="truncate font-medium text-brand text-sm sm:text-base">
                        {displayEvent.venue}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
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
                    {displayEvent.eventTitle}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">Event Title</p>
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => navigate('/client/event-plan')}
                    className="bg-pink-400 text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-sm hover:bg-pink-500 transition-colors"
                  >
                    View Event Plan
                  </button>
                </div>
              </div>

              {/* 2 × 2 inner grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mt-4">
                {/* Service Requirements */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      Service Requirements
                    </span>
                  </div>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    <li className="text-gray-400 italic">No service requirements specified yet.</li>
                  </ul>
                </div>

                {/* Allocation Resources */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4 mb-8">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      Allocation Resources
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-gray-400 italic">No allocated resources currently.</li>
                  </ul>
                </div>

                {/* Checklist & Meeting */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-4">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      Checklist & Meeting
                    </span>
                  </div>
                  <ul className="space-y-0.5 text-xs">
                    <li className="text-gray-400 italic">No scheduled meetings yet.</li>
                  </ul>
                </div>

                {/* Program Flow */}
                <div className="rounded-lg border border-[#e8e4ee] bg-white p-5">
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-foreground">Program Flow</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-gray-400 italic">
                      Program flow is currently being finalized.
                    </p>
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
                {displayEvent.packageName}
              </h2>
              <div className="mt-4 space-y-1 text-sm text-white">
                <p>
                  <span className="font-semibold">Event Type:</span> {displayEvent.eventType}
                </p>
                <p>
                  <span className="font-semibold">Pax:</span> {displayEvent.pax}
                </p>
                <p>
                  <span className="font-semibold">Cost:</span> {displayEvent.cost}
                </p>
              </div>
            </div>

            {/* Guest List card */}
            <div
              className="rounded-xl bg-white p-6 shadow-md flex flex-col min-h-[320px] lg:flex-1 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <div className="mb-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-foreground">Guest List</h2>
                <button
                  onClick={() => setShowGuestListModal(true)}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 transition"
                >
                  View List
                </button>
              </div>
              {/* Column headers */}
              <div className="mb-3 flex items-center justify-between border-b border-[#e8e4ee] pb-2 text-sm font-semibold text-muted-foreground shrink-0">
                <span>Guest Name</span>
                <span>Status</span>
              </div>
              {/* Guest rows - scrollable with fade effect */}
              <div className="relative" style={{ minHeight: '200px', flex: 1 }}>
                <ul className="absolute inset-0 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {isLoadingGuests ? (
                    <li className="flex items-center justify-center text-sm text-muted-foreground">
                      Loading guests...
                    </li>
                  ) : guests.length === 0 ? (
                    <li className="flex items-center justify-center text-sm text-muted-foreground">
                      No guests found
                    </li>
                  ) : (
                    guests.map((guest, index) => (
                      <li
                        key={`${guest.name}-${index}`}
                        className="flex items-center justify-between gap-2 text-base"
                      >
                        <span className="min-w-0 truncate text-foreground">{guest.name}</span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                            guest.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : guest.status === 'Declined'
                                ? 'bg-red-200 text-red-700'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {guest.status}
                        </span>
                      </li>
                    ))
                  )}
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

      {showServiceReq && (
        <ServiceRequirementsModal
          allocation={allocation}
          onClose={() => setShowServiceReq(false)}
        />
      )}
      {showAllocationRes && (
        <AllocationResourcesModal
          allocation={allocation}
          onClose={() => setShowAllocationRes(false)}
        />
      )}
      {showChecklist && (
        <ChecklistMeetingModal
          meetings={meetings}
          checklist={checklist}
          onClose={() => setShowChecklist(false)}
        />
      )}
      {showProgramFlow && (
        <ProgramFlowModal flow={flow} onClose={() => setShowProgramFlow(false)} />
      )}
      {showGuestListModal && (
        <GuestListModal
          guests={guests}
          isLoading={isLoadingGuests}
          onClose={() => setShowGuestListModal(false)}
        />
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
