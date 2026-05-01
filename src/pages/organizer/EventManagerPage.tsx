import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { EventDetailsModal, type EventFormData } from '@/components/organizer/EventDetailsModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

type SortDirection = 'asc' | 'desc' | null;
type EventSortKey = 'title' | 'date' | 'client' | 'type' | 'package' | 'venue' | 'status' | 'createdAt';

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
  const [sortKey, setSortKey] = useState<EventSortKey | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventManagerEvent | null>(null);
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
    const combinedSearchTerm = (localSearchTerm || searchTerm).trim().toLowerCase();

    let data = events.filter((event) => {
      if (!combinedSearchTerm) return true;
      const searchableFields = [
        event.title,
        event.date,
        event.client,
        event.type,
        event.package,
        (event.venue && !["", "-", "–", "—", "n/a", "tba"].includes(event.venue.trim().toLowerCase())) ? event.venue : "Venue Required",
        event.status,
      ];
      return searchableFields.some((field) => field && field.toLowerCase().includes(combinedSearchTerm));
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
          case 'status':
            aVal = a.status.toLowerCase();
            bVal = b.status.toLowerCase();
            break;
          case 'createdAt':
            aVal = a.createdAt || '';
            bVal = b.createdAt || '';
            break;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [events, searchTerm, localSearchTerm, sortKey, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, localSearchTerm, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / rowsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEvents.slice(start, start + rowsPerPage);
  }, [filteredEvents, currentPage, rowsPerPage]);



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
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f1eef5] pb-3 gap-3">
          <div className="flex items-center gap-3">
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#a49db4]" />
            <Input
              placeholder="Search events..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="border border-[#eef0f4] bg-white pl-8 shadow-sm h-9 text-xs sm:text-sm font-semibold text-[#302a3a] outline-none focus:border-[#df1b8b]"
            />
          </div>
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
                  { key: 'status', label: 'Status', alwaysVisible: false },
                  { key: 'createdAt', label: 'Approved Date', alwaysVisible: false },
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
              {paginatedEvents.map((event) => (
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
                    {event.venue && !["", "-", "–", "—", "n/a", "tba"].includes(event.venue.trim().toLowerCase()) ? (
                      event.venue
                    ) : (
                      <span className="font-extrabold text-red-600 uppercase tracking-tight">
                        Venue Required
                      </span>
                    )}
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
                  <TableCell className="py-4 font-semibold text-[#8f879f] hidden md:table-cell">
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedEvents.length === 0 && (
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

        {/* Pagination Bar */}
        <div className="mt-4 flex flex-col gap-3 border-t border-[#f1eef5] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7c7390]">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-[#e5ddee] bg-white px-2 py-1 text-xs font-bold text-[#2e2837] outline-none focus:border-[#df1b8b]"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ml-2 text-[#a49db4]">
              {paginatedEvents.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}–
              {Math.min(currentPage * rowsPerPage, filteredEvents.length)} of{' '}
              {filteredEvents.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#e5ddee] disabled:opacity-40"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#e5ddee] disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="mx-2 text-[11px] font-black text-[#2e2837]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#e5ddee] disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#e5ddee] disabled:opacity-40"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>



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
