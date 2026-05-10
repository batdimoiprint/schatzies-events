import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ServiceRequirementsModal } from '@/components/client/ServiceRequirementsModal';
import { AllocationResourcesModal } from '@/components/client/AllocationResourcesModal';
import { ChecklistMeetingModal } from '@/components/client/ChecklistMeetingModal';
import { ProgramFlowModal } from '@/components/client/ProgramFlowModal';

import {
  getEventManagerEvents,
  getEventById,
  getEventUser,
  getEventAllocation,
  getEventFlow,
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

export function EventPlanViewingPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = useState<any>(null);
  const [allocation, setAllocation] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [flow, setFlow] = useState<any[]>([]);
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

          const orgId =
            (fullEvent as any).organizer_id ||
            (fullEvent as any).organizerId ||
            userEventBase.organizerId ||
            (userEventBase as any).organizer_id;

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

          const paxCount =
            fullEvent.eventPax ||
            (userEventBase as any).pax ||
            (fullEvent as any).package?.pax ||
            0;

          // Cost logic: Use packageInitialAmount for custom events ("Others")
          let costValue = (fullEvent as any).cost || 'TBD';
          if (rawPkgName === 'Others' && (fullEvent as any).packageInitialAmount) {
            costValue = `₱${Number((fullEvent as any).packageInitialAmount).toLocaleString()}`;
          }

          // Fetch additional data modules
          try {
            const [allocRes, flowRes, calRes] = await Promise.all([
              getEventAllocation(userEventBase.id).catch(() => null),
              getEventFlow(userEventBase.id).catch(() => []),
              getCalendarEntries().catch(() => []),
            ]);

            if (isMounted) {
              setAllocation(allocRes);

              const formatDisplayTime = (val: any) => {
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
                    .map((item: any) => ({
                      id: item.id || Math.random().toString(),
                      title: item.title || item.activity || 'Activity',
                      from: formatDisplayTime(item.startTime || item.start),
                      to: formatDisplayTime(item.endTime || item.end),
                      description: item.description || '',
                      startHour: parseFloat(item.startHour) || 0,
                    }))
                    .sort((a: any, b: any) => a.startHour - b.startHour)
                : [];
              setFlow(mappedFlows);

              const eventMeetings = (calRes || []).filter(
                (item: any) =>
                  item.eventId === userEventBase.id && item.label?.toUpperCase() === 'MEETING'
              );
              setMeetings(eventMeetings);
            }
          } catch (e) {
            console.error('Error fetching event extra details:', e);
          }

          if (isMounted) {
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-[#8a8697]">
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
            <div className="space-y-1 text-xs text-[#696373]">
              {allocation?.food_package || allocation?.flow_type ? (
                <>
                  {allocation?.food_package && (
                    <p className="font-medium text-[#2d2834]">
                      Food Package: {allocation.food_package}
                    </p>
                  )}
                  {allocation?.flow_type && (
                    <p className="font-medium text-[#2d2834]">Flow Type: {allocation.flow_type}</p>
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
                  allocation.vendors.map((v: any, i: number) => (
                    <p key={i} className="pl-3 text-[#2d2834]">
                      {v.name}
                    </p>
                  ))
                ) : (
                  <p className="pl-3 italic text-[#8a8697]">None assigned</p>
                )}
              </div>
              <div>
                <span className="font-medium text-orange-400">• Manpower</span>
                {allocation?.manpower && allocation.manpower.length > 0 ? (
                  allocation.manpower.map((m: any, i: number) => (
                    <p key={i} className="pl-3 text-[#2d2834]">
                      {m.role}
                    </p>
                  ))
                ) : (
                  <p className="pl-3 italic text-[#8a8697]">None assigned</p>
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
                  meetings.map((meeting: any, index: number) => (
                    <div key={index} className="pl-3 mb-1">
                      <p className="text-[#2d2834] font-medium">{meeting.title}</p>
                      <p className="text-[#8a8697]">
                        {meeting.startTime || meeting.time || ''}{' '}
                        {meeting.endTime ? `- ${meeting.endTime}` : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="pl-3 italic text-[#8a8697]">No scheduled meetings yet.</p>
                )}
              </div>
            </div>
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
            <div className="mt-2 space-y-4">
              {flow.length > 0 ? (
                flow.map((f: any) => (
                  <div key={f.id} className="flex gap-4 items-start">
                    <div className="text-xs text-[#8a8697] shrink-0 w-16">
                      <p>{f.from}</p>
                      <p>{f.to}</p>
                    </div>
                    <div className="w-px bg-pink-200 self-stretch"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2d2834] text-sm truncate">{f.title}</p>
                      <p className="line-clamp-3 text-[11px] text-[#8a8697] mt-1 leading-relaxed break-words whitespace-pre-wrap">
                        {f.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-[#8a8697]">No program flow scheduled yet.</p>
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
      {showServiceReq && <ServiceRequirementsModal onClose={() => setShowServiceReq(false)} />}
      {showAllocationRes && (
        <AllocationResourcesModal onClose={() => setShowAllocationRes(false)} />
      )}
      {showChecklist && <ChecklistMeetingModal onClose={() => setShowChecklist(false)} />}
      {showProgramFlow && <ProgramFlowModal onClose={() => setShowProgramFlow(false)} />}
    </div>
  );
}
