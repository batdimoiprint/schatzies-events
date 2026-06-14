import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
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
  title?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  eventTime?: string;
  eventTimeEnd?: string;
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
  title?: string;
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

interface CalItemLike {
  eventId?: string;
  label?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
}

interface FlowBlock {
  id: string;
  title: string;
  from: string;
  to: string;
  description: string;
  startHour: number;
}

interface EventViewData {
  title: string;
  date: string;
  completion: number;
  organizer: string;
  email: string;
  contact: string;
  packageName: string;
  pax: number;
  eventType: string;
  cost: string;
  startTime: string;
  endTime: string;
}

export function EventPlanViewingPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = useState<EventViewData | null>(null);
  const [allocation, setAllocation] = useState<(ResourceAllocation & ServiceAllocation) | null>(
    null
  );
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [flow, setFlow] = useState<FlowBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showServiceReq, setShowServiceReq] = useState(false);
  const [showAllocationRes, setShowAllocationRes] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showProgramFlow, setShowProgramFlow] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvent() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const events = await getEventManagerEvents();

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
          const fullEvent = await getEventById(userEventBase.id);

          const fe = fullEvent as FullEventLike;
          const base = userEventBase as BaseEventLike;
          const orgId =
            fe.organizer_id || fe.organizerId || base.organizerId || base.organizer_id;

          let organizerName = userEventBase.organizerName || 'Assigned Organizer';
          let organizerEmail = 'contact@schatzies.com';
          let organizerContact = '-';

          if (orgId) {
            try {
              const org = await getEventUser(orgId);
              organizerName =
                `${org.firstName || org.user?.firstName || ''} ${org.lastName || org.user?.lastName || ''}`.trim() ||
                organizerName;
              organizerEmail = org.email || org.user?.email || 'contact@schatzies.com';
              organizerContact =
                org.contact_number ||
                org.user?.contact_number ||
                org.contactPhone ||
                org.contactNumber ||
                '-';
            } catch (e) {
              console.error('Error fetching organizer:', e);
            }
          }

          const endDateStr = fullEvent.endDate || fullEvent.dateEnd || fullEvent.eventDate || '';

          const formattedDate = endDateStr
            ? new Date(endDateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'TBD';

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

          // Fetch additional data modules
          try {
            const [allocRes, flowRes, calRes, checklistRes] = await Promise.all([
              getEventAllocation(userEventBase.id).catch(() => null),
              getEventFlow(userEventBase.id).catch(() => []),
              getCalendarEntries().catch(() => []),
              getEventChecklist(userEventBase.id).catch(() => []),
            ]);

            if (isMounted) {
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
            }
          } catch (e) {
            console.error('Error fetching event extra details:', e);
          }

          if (isMounted) {
            const formatTime12Hour = (val?: string) => {
              if (!val) return '';
              if (typeof val === 'string' && val.includes(':')) {
                const [h, m] = val.split(':');
                let hours = parseInt(h, 10);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                return `${hours}:${m} ${ampm}`;
              }
              return val;
            };

            setEventData({
              title: fullEvent.title || userEventBase.title || 'Your Event',
              date: formattedDate,
              completion: fullEvent.status === 'Completed' ? 100 : 89,
              organizer: organizerName,
              email: organizerEmail,
              contact: organizerContact,
              packageName: displayPkgName,
              pax: paxCount,
              eventType: currentEventType,
              cost: costValue,
              startTime: formatTime12Hour(fe.startTime || fe.eventTime || ''),
              endTime: formatTime12Hour(fe.endTime || fe.eventTimeEnd || ''),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching client event:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchEvent();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleExportFlow = () => {
    if (!flow || flow.length === 0) return;

    // Build CSV headers and rows
    const headers = ['Time From', 'Time To', 'Activity', 'Description'];
    const rows = flow.map((item) => [item.from, item.to, item.title, item.description || '']);

    // Format as CSV string
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventData?.title || 'Event'}_Program_Flow.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Calendar className="h-12 w-12 opacity-20" />
        <p className="text-sm font-medium">No event plan assigned to your account yet.</p>
      </div>
    );
  }

  const EVENT = eventData;

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Event Plan Viewing
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
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
              {(EVENT.startTime || EVENT.endTime) && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {EVENT.startTime}
                  {EVENT.startTime && EVENT.endTime && ' – '}
                  {EVENT.endTime}
                </span>
              )}
            </div>
          </div>

          {/* Right: progress + organizer */}
          <div className="flex flex-col items-end gap-2 w-full sm:w-[60%]">
            <div className="text-xs text-white/80 leading-relaxed self-end text-right">
              <p>Organizer Name: {EVENT.organizer}</p>
              <p>
                {EVENT.email} | {EVENT.contact}
              </p>
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
            <div className="space-y-1 text-xs text-muted-foreground">
              {allocation?.food_package || allocation?.flow_type ? (
                <>
                  {allocation?.food_package && (
                    <p className="font-medium text-foreground">
                      Food Package: {allocation.food_package}
                    </p>
                  )}
                  {allocation?.flow_type && (
                    <p className="font-medium text-foreground">Flow Type: {allocation.flow_type}</p>
                  )}
                </>
              ) : (
                <p className="italic">No service requirements specified.</p>
              )}
            </div>
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
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-medium text-pink-500">• Vendors</span>
                {allocation?.vendors && allocation.vendors.length > 0 ? (
                  allocation.vendors.map((v, i) => (
                    <p key={i} className="pl-3 text-foreground">
                      {v.name}
                    </p>
                  ))
                ) : (
                  <p className="pl-3 italic text-muted-foreground">None assigned</p>
                )}
              </div>
              <div>
                <span className="font-medium text-orange-400">• Manpower</span>
                {allocation?.manpower && allocation.manpower.length > 0 ? (
                  allocation.manpower.map((m, i) => (
                    <p key={i} className="pl-3 text-foreground">
                      {m.role}
                    </p>
                  ))
                ) : (
                  <p className="pl-3 italic text-muted-foreground">None assigned</p>
                )}
              </div>
            </div>
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
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-medium text-pink-500">• Meetings</span>
                {meetings.length > 0 ? (
                  meetings.map((meeting, index) => (
                    <div key={index} className="pl-3 mb-1">
                      <p className="text-foreground font-medium">{meeting.title}</p>
                      <p className="text-muted-foreground">
                        {meeting.startTime || meeting.time || ''}{' '}
                        {meeting.endTime ? `- ${meeting.endTime}` : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="pl-3 italic text-muted-foreground">No scheduled meetings yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 4 — Program Flow */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-pink-500 font-semibold text-sm min-w-0">Program Flow</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportFlow}
                  className="flex items-center gap-1 border border-gray-200 text-gray-500 rounded-full px-3 py-1 text-[10px] font-bold shadow-sm hover:bg-gray-50 transition-colors"
                >
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
            <div className="mt-2 space-y-4">
              {flow.length > 0 ? (
                flow.map((f) => (
                  <div key={f.id} className="flex gap-4 items-start">
                    <div className="text-xs text-muted-foreground shrink-0 w-16">
                      <p>{f.from}</p>
                      <p>{f.to}</p>
                    </div>
                    <div className="w-px bg-pink-200 self-stretch"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{f.title}</p>
                      <p className="line-clamp-3 text-[11px] text-muted-foreground mt-1 leading-relaxed break-words whitespace-pre-wrap">
                        {f.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-muted-foreground">No program flow scheduled yet.</p>
              )}
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
    </div>
  );
}
