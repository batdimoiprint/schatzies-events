import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrganizerLayoutOutletContext } from '@/components/layouts/OrganizerLayout';
import { getEventManagerEvents, updateEvent, deleteEvent, type EventManagerEvent } from '@/api/events';
import { getRSVPList } from '@/api/rsvp';
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { EventDetailsModal, type EventFormData } from '@/components/organizer/EventDetailsModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

type SortDirection = 'asc' | 'desc' | null;
type EventSortKey = 'title' | 'date' | 'client' | 'type' | 'package' | 'venue' | 'rsvp' | 'status';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Planning', dot: 'bg-[#e2b020]', bg: 'bg-[#fff5d3]', text: 'text-[#b68c17]' },
  { value: 'Execution', label: 'Execution', dot: 'bg-[#df1b8b]', bg: 'bg-[#ffe6f1]', text: 'text-[#df1b8b]' },
  { value: 'Completed', label: 'Completed', dot: 'bg-[#8637c3]', bg: 'bg-[#f4e6fc]', text: 'text-[#8637c3]' },
];

function getStatusOption(status: string) {
  const normalized = String(status || '').trim().toLowerCase();
  if (normalized === 'completed' || normalized === 'confirmed') return STATUS_OPTIONS[2];
  if (normalized === 'execution') return STATUS_OPTIONS[1];
  return STATUS_OPTIONS[0];
}

export function EventManagerPage() {
  const outletContext = useOutletContext<OrganizerLayoutOutletContext | undefined>();
  const searchTerm = outletContext?.searchTerm ?? '';
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [sortKey, setSortKey] = useState<EventSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventManagerEvent | null>(null);
  const [rsvpModalEvent, setRsvpModalEvent] = useState<EventManagerEvent | null>(null);
  const [modalRsvps, setModalRsvps] = useState<any[]>([]);
  const [isLoadingModalRsvps, setIsLoadingModalRsvps] = useState(false);
  const [statusDropdownEventId, setStatusDropdownEventId] = useState<string>('');

  // TanStack Query with 10s polling
  const {
    data: events = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['eventManagerEvents'],
    queryFn: getEventManagerEvents,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  // Mutation for updating events
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Record<string, unknown> }) =>
      updateEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventManagerEvents'] });
    },
  });

  // Mutation for deleting events (admin only)
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventManagerEvents'] });
      setIsEventDetailsModalOpen(false);
      setSelectedEventForDetails(null);
    },
  });

  const handleUpdateEventFromModal = async (eventId: string, data: EventFormData) => {
    await updateEventMutation.mutateAsync({
      eventId,
      data: {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        eventType: data.eventType,
        eventPackage: data.eventPackage,
        eventPax: data.eventPax,
        venue: data.venue,
        status: data.status,
        notes: data.notes || undefined,
      },
    });
    setIsEventDetailsModalOpen(false);
    setSelectedEventForDetails(null);
  };

  const handleInlineStatusChange = async (eventId: string, newStatus: string) => {
    setStatusDropdownEventId('');
    await updateEventMutation.mutateAsync({
      eventId,
      data: { status: newStatus },
    });
  };

  const handleSortToggle = (key: EventSortKey) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredEvents = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    let data = events.filter((event) => {
      if (!normalizedSearchTerm) return true;
      const searchableFields = [
        event.title,
        event.date,
        event.client,
        event.type,
        event.package,
        event.venue,
        event.status,
        String(event.rsvp),
      ];
      return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm));
    });

    if (sortKey && sortDirection) {
      data = [...data].sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';

        switch (sortKey) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'date':
            aVal = a.startDate || '';
            bVal = b.startDate || '';
            break;
          case 'client':
            aVal = a.client.toLowerCase();
            bVal = b.client.toLowerCase();
            break;
          case 'type':
            aVal = a.type.toLowerCase();
            bVal = b.type.toLowerCase();
            break;
          case 'package':
            aVal = a.package.toLowerCase();
            bVal = b.package.toLowerCase();
            break;
          case 'venue':
            aVal = a.venue.toLowerCase();
            bVal = b.venue.toLowerCase();
            break;
          case 'rsvp':
            aVal = a.rsvp;
            bVal = b.rsvp;
            break;
          case 'status':
            aVal = a.status.toLowerCase();
            bVal = b.status.toLowerCase();
            break;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [events, searchTerm, sortKey, sortDirection]);

  // Fetch RSVPs when modal opens
  const handleOpenRsvpModal = async (event: EventManagerEvent) => {
    setRsvpModalEvent(event);
    setIsLoadingModalRsvps(true);
    setModalRsvps([]);

    try {
      let rawData = await getRSVPList(event.id);

      if ((!rawData || rawData.length === 0) && !event.id.startsWith('EVENT#')) {
        try {
          const altData = await getRSVPList(`EVENT#${event.id}`);
          if (altData && altData.length > 0) rawData = altData;
        } catch {}
      }

      const flatArray: any[] = [];
      const processData = (item: any) => {
        if (Array.isArray(item)) item.forEach(processData);
        else if (item && typeof item === 'object') flatArray.push(item);
      };
      processData(rawData);

      const mappedData = flatArray.map((item: any) => {
        const fName = String(item.firstName || item.first_name || item.guestfirstName || '')
          .replace(/undefined/gi, '')
          .trim();
        const lName = String(item.lastName || item.last_name || item.guestlastName || '')
          .replace(/undefined/gi, '')
          .trim();

        const statusStr = String(item.status || '').trim().toUpperCase();
        const isAttending =
          item.isScanned === true ||
          item.isScanned === 'true' ||
          statusStr === 'ATTENDING' ||
          statusStr === 'CONFIRMED';

        const time = item.updatedAt || item.scannedAt || item.createdAt || new Date().toISOString();

        return {
          id: item.id || item.guestId || item.SK || Math.random().toString(),
          firstName: fName || 'Guest',
          lastName: lName,
          isScanned: isAttending,
          scannedAt: time,
        };
      });

      setModalRsvps(mappedData);
    } catch (error) {
      console.error('Failed to fetch RSVPs for modal', error);
    } finally {
      setIsLoadingModalRsvps(false);
    }
  };

  const errorMessage = queryError instanceof Error ? queryError.message : queryError ? 'Unable to load events right now.' : '';

  return (
    <div className="relative w-full max-w-full min-h-screen flex flex-col gap-4 overflow-x-hidden bg-[#fbf8fd] font-sans p-2 sm:p-4 lg:p-6 pb-10">
      {errorMessage ? (
        <Card className="border-0 bg-[#fff1f2] py-3 ring-1 ring-[#fecdd3]">
          <CardContent>
            <p className="text-sm font-medium text-[#b42318]">{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {updateEventMutation.isError && (
        <Card className="border-0 bg-[#fff1f2] py-3 ring-1 ring-[#fecdd3]">
          <CardContent>
            <p className="text-sm font-medium text-[#b42318]">Unable to update event. Please try again.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 flex flex-col rounded-xl border border-[#eef0f4] bg-white p-3 sm:p-6 shadow-sm overflow-hidden min-h-[calc(100vh-150px)]">
        <div className="mb-4 flex items-center justify-between border-b border-[#f1eef5] pb-3">
          <h2 className="text-lg sm:text-xl font-black text-[#302a3a]">Events</h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a49db4]">
              <svg
                className="animate-spin h-3 w-3 text-[#df1b8b]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          )}
        </div>

        <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-lg">
          <Table className="w-full text-[11px] sm:text-xs relative">
            <TableHeader>
              <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                {([
                  { key: 'title', label: 'Title', alwaysVisible: true },
                  { key: 'date', label: 'Date', alwaysVisible: true },
                  { key: 'client', label: 'Client', alwaysVisible: false },
                  { key: 'type', label: 'Type', alwaysVisible: false },
                  { key: 'package', label: 'Package', alwaysVisible: false },
                  { key: 'venue', label: 'Venue', alwaysVisible: false },
                  { key: 'rsvp', label: 'RSVP', alwaysVisible: false },
                  { key: 'status', label: 'Status', alwaysVisible: false },
                ] as { key: EventSortKey; label: string; alwaysVisible: boolean }[]).map(
                  (col) => (
                    <TableHead
                      key={col.key}
                      className={`h-10 font-black text-[#211a2f] cursor-pointer select-none transition-colors hover:text-[#df1b8b] ${
                        !col.alwaysVisible ? 'hidden md:table-cell' : ''
                      }`}
                      onClick={() => handleSortToggle(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3 w-3 text-[#df1b8b]" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-[#df1b8b]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-[#c4bdd0]" />
                        )}
                      </div>
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setSelectedEventForDetails(event);
                    setIsEventDetailsModalOpen(true);
                  }}
                  className={`group transition-all cursor-pointer border-b border-[#f6f4f9] ${
                    selectedEventId === event.id
                      ? 'bg-[#fdf2f8] border-l-4 border-l-[#df1b8b] shadow-sm'
                      : 'hover:bg-[#faf9fc] border-l-4 border-l-transparent'
                  }`}
                >
                  <TableCell className="py-4 font-bold text-[#5c546a]">{event.title}</TableCell>
                  <TableCell className="py-4 font-semibold text-[#5c546a]">
                    {event.date}
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">
                    {event.client}
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">
                    {event.type}
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">
                    {event.package}
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">
                    {event.venue}
                  </TableCell>
                  <TableCell className="py-4 font-bold text-[#5c546a] hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      {event.rsvp}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRsvpModal(event);
                        }}
                        className="text-[9px] font-bold uppercase tracking-wider text-[#760CB4] hover:brightness-125 hover:underline"
                      >
                        View RSVP
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 hidden md:table-cell">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusDropdownEventId(
                            statusDropdownEventId === event.id ? '' : event.id
                          );
                        }}
                        disabled={updateEventMutation.isPending}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-black tracking-wide transition-all hover:ring-2 hover:ring-[#df1b8b]/20 disabled:opacity-50 ${getStatusOption(event.status).bg} ${getStatusOption(event.status).text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusOption(event.status).dot}`}></span>
                        {getStatusOption(event.status).label.toUpperCase()}
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {statusDropdownEventId === event.id && (
                        <div
                          className="absolute right-0 z-50 mt-1 w-40 origin-top-right overflow-hidden rounded-xl border border-[#f1eef5] bg-white py-1 shadow-xl animate-in fade-in zoom-in-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleInlineStatusChange(event.id, opt.value)}
                              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b] ${
                                getStatusOption(event.status).value === opt.value
                                  ? 'text-[#df1b8b] bg-[#fdf2f8]'
                                  : 'text-[#5c546a]'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`}></span>
                              {opt.label}
                              {getStatusOption(event.status).value === opt.value && (
                                <svg className="ml-auto h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-[#8f879f]"
                  >
                    {isLoading ? 'Loading events...' : 'No events found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* RSVP Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-1000 flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
          <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 shadow-2xl duration-200">
            <button
              type="button"
              onClick={() => setRsvpModalEvent(null)}
              className="absolute right-4 top-4 text-[#a69eb5] hover:text-[#2d2834]"
            >
              <X className="size-5" />
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-[#2e2837]">RSVP</h2>
              <p className="text-xs font-semibold text-[#7c758d]">Live counts of attendees</p>
            </div>

            <div className="mb-6 flex gap-4">
              <div className="flex-1 rounded-xl border border-[#e1d5eb] bg-[#F6E7FF] p-4 text-center">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#2e2837]">
                  Live Headcount
                </p>
                <div className="mb-3 flex justify-center gap-1.5">
                  {String(rsvpModalEvent.rsvp)
                    .padStart(3, '0')
                    .split('')
                    .map((digit, i) => (
                      <div
                        key={i}
                        className="flex h-14 w-10 items-center justify-center rounded border border-[#d4c5e3] bg-white text-4xl font-black text-[#1a1423] shadow-sm"
                      >
                        {digit}
                      </div>
                    ))}
                </div>
                <p className="text-[11px] font-bold text-[#625974]">
                  Expected Attendees: <span className="font-semibold text-[#8b839c]">80 pax</span>
                </p>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 text-[11px] font-bold text-[#352f44]">
                <p>DETAILS:</p>
                <p className="font-semibold text-[#716885]">
                  FINAL HEADCOUNT:{' '}
                  {isLoadingModalRsvps ? '...' : modalRsvps.filter((r) => r.isScanned).length}
                </p>
                <p className="font-semibold text-[#716885]">
                  ABSENTEES:{' '}
                  {isLoadingModalRsvps ? '...' : modalRsvps.filter((r) => !r.isScanned).length}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#eae4f1]">
              <h3 className="border-b border-[#eae4f1] bg-white py-2 text-center text-[10px] font-black uppercase tracking-widest text-[#2e2837]">
                Names of Present Attendees
              </h3>
              <div className="max-h-48 overflow-y-auto bg-white p-4">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-[#f3eff7] text-left font-semibold text-[#8e879c]">
                      <th className="pb-2 font-semibold">Name</th>
                      <th className="pb-2 text-right font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingModalRsvps ? (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-xs text-[#8e879c]">
                          Loading guests...
                        </td>
                      </tr>
                    ) : modalRsvps.filter((r) => r.isScanned).length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-xs text-[#8e879c]">
                          No attendees arrived yet.
                        </td>
                      </tr>
                    ) : (
                      modalRsvps
                        .filter((r) => r.isScanned)
                        .map((guest, i) => {
                          const scanTime = new Date(guest.scannedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          return (
                            <tr
                              key={guest.id || i}
                              className="border-b border-[#f9f7fb] last:border-0"
                            >
                              <td className="py-2.5 font-bold text-[#453e54]">
                                {i + 1}. {guest.firstName} {guest.lastName}
                              </td>
                              <td className="py-2.5 text-right font-semibold text-[#8e879c]">
                                {scanTime}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEventForDetails && (
        <EventDetailsModal
          event={selectedEventForDetails}
          isOpen={isEventDetailsModalOpen}
          onClose={() => {
            setIsEventDetailsModalOpen(false);
            setSelectedEventForDetails(null);
          }}
          onUpdate={handleUpdateEventFromModal}
          isUpdating={updateEventMutation.isPending}
          isAdmin={isAdmin}
          onDelete={(eventId) => deleteEventMutation.mutateAsync(eventId)}
          isDeleting={deleteEventMutation.isPending}
        />
      )}
    </div>
  );
}
