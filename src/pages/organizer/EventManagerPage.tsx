import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  getEventManagerEvents,
  updateEvent,
  deleteEvent,
  type EventManagerEvent,
} from '@/api/events';
import {
  assignVendorToEvent,
  getVendors,
  type EventManagerVendor,
  unassignVendorFromEvent,
  getVendorAssignedEvents,
} from '@/api/vendors';
import {
  assignWorkerToEvent,
  getWorkers,
  type EventWorker,
  unassignWorkerFromEvent,
  getWorkerAssignedEvents,
} from '@/api/workers';
import { getRSVPList } from '@/api/rsvp';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from 'lucide-react';
import { EventDetailsModal, type EventFormData } from '@/components/organizer/EventDetailsModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

type VendorStatus = EventManagerVendor['status'];
type EventManagerTab = 'Events' | 'Vendor' | 'Workers';
type SortDirection = 'asc' | 'desc' | null;
type EventSortKey =
  | 'title'
  | 'date'
  | 'client'
  | 'type'
  | 'package'
  | 'venue'
  | 'rsvp'
  | 'status'
  | 'createdAt';

const EVENT_MANAGER_TABS: EventManagerTab[] = ['Events', 'Vendor', 'Workers'];

const EVENT_MANAGER_TABS: EventManagerTab[] = ['Events', 'Vendor', 'Workers'];

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

function getVendorStatusBadgeClasses(status: VendorStatus) {
  if (status === 'Active') return 'bg-[#e6f4ea] text-[#1e7e34]';
  return 'bg-[#fce8e6] text-[#c5221f]';
}

export function EventManagerPage() {
  const location = useLocation();
  const outletContext = useOutletContext<OrganizerLayoutOutletContext | undefined>();
  const searchTerm = outletContext?.searchTerm ?? '';
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const [activeTab, setActiveTab] = useState<EventManagerTab>(
    location.state?.activeTab || 'Events'
  );
  const [vendors, setVendors] = useState<EventManagerVendor[]>([]);
  const [workers, setWorkers] = useState<EventWorker[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [isMutating, setIsMutating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sortKey, setSortKey] = useState<EventSortKey | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventManagerEvent | null>(null);
  const [rsvpModalEvent, setRsvpModalEvent] = useState<EventManagerEvent | null>(null);
  const [modalRsvps, setModalRsvps] = useState<any[]>([]);
  const [isLoadingModalRsvps, setIsLoadingModalRsvps] = useState(false);
  const [statusDropdownEventId, setStatusDropdownEventId] = useState<string>('');

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
  const [isUnassignVendorModalOpen, setIsUnassignVendorModalOpen] = useState(false);
  const [assignToEventId, setAssignToEventId] = useState('');
  const [isAssignWorkerModalOpen, setIsAssignWorkerModalOpen] = useState(false);
  const [isUnassignWorkerModalOpen, setIsUnassignWorkerModalOpen] = useState(false);
  const [assignWorkerToEventId, setAssignWorkerToEventId] = useState('');

  const [isAssignedEventsModalOpen, setIsAssignedEventsModalOpen] = useState(false);
  const [assignedEventsList, setAssignedEventsList] = useState<any[]>([]);
  const [isLoadingAssignedEvents, setIsLoadingAssignedEvents] = useState(false);
  const [assignedEventsTargetName, setAssignedEventsTargetName] = useState('');

  // ─── TanStack Query for events (with 10s polling) ───────────────────────────
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

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Record<string, unknown> }) =>
      updateEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventManagerEvents'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventManagerEvents'] });
      setIsEventDetailsModalOpen(false);
      setSelectedEventForDetails(null);
    },
  });

  // ─── Vendor / Worker fetchers (kept as manual since they're tab-driven) ──────
  const fetchVendors = useCallback(async () => {
    setIsMutating(true);
    try {
      const vendorRows = await getVendors();
      const mapped = vendorRows.map((v) => ({
        id: v.id,
        eventId: v.eventId || '',
        name: v.vendorName || v.name || 'Unnamed vendor',
        contactPerson: v.contactPerson || '-',
        email: v.contactEmail || '-',
        phone: v.contactPhone || '-',
        service: v.serviceType || '-',
        status:
          v.status === 'Active' || String(v.availabilityStatus).toLowerCase() === 'active'
            ? 'Active'
            : ('Inactive' as VendorStatus),
      }));
      setVendors(mapped);
    } catch {
      setVendors([]);
    } finally {
      setIsMutating(false);
    }
  }, []);

  const fetchWorkers = useCallback(async () => {
    try {
      const workerRows = await getWorkers();
      setWorkers(workerRows);
    } catch {
      setWorkers([]);
    }
  }, []);

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['eventManagerEvents'] }),
        fetchVendors(),
        fetchWorkers(),
      ]);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setIsActionsOpen(false);
      }, 500);
    }
  }, [queryClient, fetchVendors, fetchWorkers]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
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

  const handleOpenAssignedEvents = useCallback(
    async (type: 'Vendor' | 'Worker') => {
      setIsActionsOpen(false);
      setIsAssignedEventsModalOpen(true);
      setIsLoadingAssignedEvents(true);
      setAssignedEventsList([]);

      try {
        let eventsData = [];
        if (type === 'Vendor') {
          const vendor = vendors.find((v) => v.id === selectedVendorId);
          setAssignedEventsTargetName(vendor?.name || 'Vendor');
          eventsData = await getVendorAssignedEvents(selectedVendorId);
        } else {
          const worker = workers.find((w) => w.id === selectedWorkerId);
          setAssignedEventsTargetName(
            worker ? `${worker.firstName} ${worker.lastName}` : 'Worker'
          );
          eventsData = await getWorkerAssignedEvents(selectedWorkerId);
        }
        setAssignedEventsList(eventsData);
      } catch (error) {
        console.error('Failed to fetch assigned events', error);
      } finally {
        setIsLoadingAssignedEvents(false);
      }
    },
    [selectedVendorId, selectedWorkerId, vendors, workers]
  );

  // ─── Filtered + sorted data ───────────────────────────────────────────────
  const filteredData = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const combinedSearchTerm = (localSearchTerm || searchTerm).trim().toLowerCase();
    const matchesSearch = (fields: Array<string | number>, term: string) =>
      !term || fields.some((field) => String(field ?? '').toLowerCase().includes(term));

    if (activeTab === 'Events') {
      let data = events.filter((event) => {
        const venueValue = event.venue?.trim().toLowerCase();
        const venueLabel =
          venueValue && !['', '-', '–', '—', 'n/a', 'tba'].includes(venueValue)
            ? event.venue
            : 'Venue Required';
        return matchesSearch(
          [
            event.title,
            event.date,
            event.client,
            event.type,
            event.package,
            venueLabel,
            event.status,
            String(event.rsvp),
          ],
          combinedSearchTerm
        );
      });

      if (sortKey && sortDirection) {
        data = [...data].sort((a, b) => {
          let aVal: string | number = '';
          let bVal: string | number = '';
          switch (sortKey) {
            case 'title':     aVal = a.title.toLowerCase();     bVal = b.title.toLowerCase();     break;
            case 'date':      aVal = a.startDate || '';         bVal = b.startDate || '';         break;
            case 'client':    aVal = a.client.toLowerCase();    bVal = b.client.toLowerCase();    break;
            case 'type':      aVal = a.type.toLowerCase();      bVal = b.type.toLowerCase();      break;
            case 'package':   aVal = a.package.toLowerCase();   bVal = b.package.toLowerCase();   break;
            case 'venue':     aVal = a.venue.toLowerCase();     bVal = b.venue.toLowerCase();     break;
            case 'rsvp':      aVal = a.rsvp;                    bVal = b.rsvp;                    break;
            case 'status':    aVal = a.status.toLowerCase();    bVal = b.status.toLowerCase();    break;
            case 'createdAt': aVal = a.createdAt || '';         bVal = b.createdAt || '';         break;
          }
          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return { activeTab: 'Events' as const, data };
    }

    if (activeTab === 'Vendor') {
      const data = vendors.filter((vendor) =>
        matchesSearch(
          [
            vendor.name,
            vendor.contactPerson,
            vendor.email,
            vendor.phone,
            vendor.service,
            vendor.status,
          ],
          normalizedSearchTerm
        )
      );
      return { activeTab: 'Vendor' as const, data };
    }

    const data = workers.filter((worker) =>
      matchesSearch(
        [worker.firstName, worker.lastName, worker.email, worker.role, worker.status],
        normalizedSearchTerm
      )
    );
    return { activeTab: 'Workers' as const, data };
  }, [activeTab, events, vendors, workers, searchTerm, localSearchTerm, sortKey, sortDirection]);

  useEffect(() => {
    if (activeTab === 'Events') {
      setCurrentPage(1);
    }
  }, [searchTerm, localSearchTerm, sortKey, sortDirection, activeTab]);

  const eventRows = filteredData.activeTab === 'Events' ? filteredData.data : [];
  const totalPages = Math.max(1, Math.ceil(eventRows.length / rowsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return eventRows.slice(start, start + rowsPerPage);
  }, [eventRows, currentPage, rowsPerPage]);

  useEffect(() => {
    if (activeTab === 'Events' && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [activeTab, currentPage, totalPages]);

  const errorMessage =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? 'Unable to load events right now.'
        : '';

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
            <p className="text-sm font-medium text-[#b42318]">
              Unable to update event. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 flex flex-col rounded-xl border border-[#eef0f4] bg-white p-3 sm:p-6 shadow-sm overflow-hidden min-h-[calc(100vh-150px)]">
        {/* ── Tabs + Actions bar ── */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#f1eef5] pb-0 gap-4">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap pb-1">
            {EVENT_MANAGER_TABS.map((tabLabel) => (
              <button
                key={tabLabel}
                type="button"
                onClick={() => setActiveTab(tabLabel)}
                className={`relative top-px z-10 rounded-t-lg px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === tabLabel
                    ? 'border border-[#f1eef5] border-b-white bg-white text-[#302a3a]'
                    : 'border border-transparent bg-[#faf9fc] text-[#a49db4] hover:bg-[#f3f0f7]'
                }`}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          <div className="mb-2 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {/* Loading indicator (Events tab) */}
            {isLoading && activeTab === 'Events' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a49db4]">
                <svg className="animate-spin h-3 w-3 text-[#df1b8b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </div>
            )}

            {activeTab === 'Events' && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#a49db4]" />
                <Input
                  placeholder="Search events..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="border border-[#eef0f4] bg-white pl-8 shadow-sm h-9 text-xs sm:text-sm font-semibold text-[#302a3a] outline-none focus:border-[#df1b8b]"
                />
              </div>
            )}

            {/* Actions dropdown */}
            <div className="relative">
              <button
                type="button"
                disabled={updateEventMutation.isPending}
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="flex h-9 w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-linear-to-r from-[#df1b8b] to-[#9f1baf] px-4 sm:px-5 font-sans text-[11px] sm:text-xs font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                Actions
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isActionsOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-[#f1eef5] bg-white py-1 shadow-xl">
                  {activeTab === 'Events' && selectedEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionsOpen(false);
                        const targetEvent = events.find((e) => e.id === selectedEventId);
                        if (targetEvent) {
                          setSelectedEventForDetails(targetEvent);
                          setIsEventDetailsModalOpen(true);
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                    >
                      Edit Event
                    </button>
                  )}
                  {activeTab === 'Vendor' && selectedVendorId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenAssignedEvents('Vendor')}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        View Assigned Events
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          setAssignToEventId(events[0]?.id || '');
                          setIsAssignVendorModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        Assign Vendor
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          setIsUnassignVendorModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        Unassign Vendor
                      </button>
                    </>
                  )}
                  {activeTab === 'Workers' && selectedWorkerId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenAssignedEvents('Worker')}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        View Assigned Events
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          setAssignWorkerToEventId(events[0]?.id || '');
                          setIsAssignWorkerModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        Assign to Event
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          setIsUnassignWorkerModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        Unassign Worker
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={isRefreshing}
                    onClick={handleRefreshAll}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      {isRefreshing && (
                        <svg className="animate-spin h-3 w-3 text-[#df1b8b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-lg">
          <Table className="w-full text-[11px] sm:text-xs relative">
            <TableHeader>
              {activeTab === 'Events' ? (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  {([
                    { key: 'title',   label: 'Title',   alwaysVisible: true },
                    { key: 'date',    label: 'Date',    alwaysVisible: true },
                    { key: 'client',  label: 'Client',  alwaysVisible: false },
                    { key: 'type',    label: 'Type',    alwaysVisible: false },
                    { key: 'package', label: 'Package', alwaysVisible: false },
                    { key: 'venue',   label: 'Venue',   alwaysVisible: false },
                    { key: 'rsvp',    label: 'RSVP',    alwaysVisible: false },
                    { key: 'status',  label: 'Status',  alwaysVisible: false },
                    { key: 'createdAt',  label: 'Approved Date',  alwaysVisible: false },
                  ] as { key: EventSortKey; label: string; alwaysVisible: boolean }[]).map((col) => (
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
                  ))}
                </TableRow>
              ) : activeTab === 'Vendor' ? (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  <TableHead className="h-10 font-black text-[#211a2f]">Name</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f] hidden md:table-cell">Contact Person</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f] hidden md:table-cell">Email</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f] hidden md:table-cell">Phone</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Service</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Status</TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  <TableHead className="h-10 font-black text-[#211a2f]">Worker Name</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Role</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f] hidden md:table-cell">Contact</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f] hidden md:table-cell">Email</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Status</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredData.activeTab === 'Events'
                ? paginatedEvents.map((event) => (
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
                      <TableCell className="py-4 font-semibold text-[#5c546a]">{event.date}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{event.client}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{event.type}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{event.package}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">
                        {event.venue && !['', '-', '–', '—', 'n/a', 'tba'].includes(event.venue.trim().toLowerCase()) ? (
                          event.venue
                        ) : (
                          <span className="font-extrabold text-red-600 uppercase tracking-tight">
                            Venue Required
                          </span>
                        )}
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
                      <TableCell className="py-4 font-semibold text-[#8f879f] hidden md:table-cell">
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                : filteredData.activeTab === 'Vendor'
                  ? filteredData.data.map((vendor) => (
                      <TableRow
                        key={vendor.id}
                        onClick={() => setSelectedVendorId(vendor.id)}
                        className={`group transition-all cursor-pointer border-b border-[#f6f4f9] ${
                          selectedVendorId === vendor.id
                            ? 'bg-[#fdf2f8] border-l-4 border-l-[#df1b8b] shadow-sm'
                            : 'hover:bg-[#faf9fc] border-l-4 border-l-transparent'
                        }`}
                      >
                        <TableCell className="py-4 font-bold text-[#5c546a]">{vendor.name}</TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{vendor.contactPerson}</TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{vendor.email}</TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{vendor.phone}</TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a]">{vendor.service}</TableCell>
                        <TableCell className="py-4">
                          <Badge className={getVendorStatusBadgeClasses(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredData.activeTab === 'Workers'
                    ? filteredData.data.map((worker) => (
                        <TableRow
                          key={worker.id}
                          onClick={() => setSelectedWorkerId(worker.id)}
                          className={`group transition-all cursor-pointer border-b border-[#f6f4f9] ${
                            selectedWorkerId === worker.id
                              ? 'bg-[#fdf2f8] border-l-4 border-l-[#df1b8b] shadow-sm'
                              : 'hover:bg-[#faf9fc] border-l-4 border-l-transparent'
                          }`}
                        >
                          <TableCell className="py-4 font-bold text-[#5c546a]">
                            {worker.firstName} {worker.lastName}
                          </TableCell>
                          <TableCell className="py-4 font-semibold text-[#5c546a]">{worker.role}</TableCell>
                          <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">N/A</TableCell>
                          <TableCell className="py-4 font-semibold text-[#5c546a] hidden md:table-cell">{worker.email}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={
                                worker.status === 'Active'
                                  ? 'bg-[#e6f4ea] text-[#1e7e34]'
                                  : 'bg-[#fce8e6] text-[#c5221f]'
                              }
                            >
                              {worker.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
              {filteredData.data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === 'Events' ? 9 : activeTab === 'Vendor' ? 6 : 5}
                    className="py-12 text-center text-sm text-[#8f879f]"
                  >
                    {isLoading && activeTab === 'Events'
                      ? 'Loading events...'
                      : activeTab === 'Events'
                        ? 'No events found.'
                        : activeTab === 'Vendor'
                          ? 'No vendors found.'
                          : 'No workers found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {activeTab === 'Events' && (
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
                {Math.min(currentPage * rowsPerPage, eventRows.length)} of {eventRows.length}
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
        )}
      </div>

      {/* ── RSVP Modal ── */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
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
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#2e2837]">Live Headcount</p>
                <div className="mb-3 flex justify-center gap-1.5">
                  {String(rsvpModalEvent.rsvp).padStart(3, '0').split('').map((digit, i) => (
                    <div key={i} className="flex h-14 w-10 items-center justify-center rounded border border-[#d4c5e3] bg-white text-4xl font-black text-[#1a1423] shadow-sm">
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
                  FINAL HEADCOUNT: {isLoadingModalRsvps ? '...' : modalRsvps.filter((r) => r.isScanned).length}
                </p>
                <p className="font-semibold text-[#716885]">
                  ABSENTEES: {isLoadingModalRsvps ? '...' : modalRsvps.filter((r) => !r.isScanned).length}
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
                      <tr><td colSpan={2} className="py-4 text-center text-xs text-[#8e879c]">Loading guests...</td></tr>
                    ) : modalRsvps.filter((r) => r.isScanned).length === 0 ? (
                      <tr><td colSpan={2} className="py-4 text-center text-xs text-[#8e879c]">No attendees arrived yet.</td></tr>
                    ) : (
                      modalRsvps.filter((r) => r.isScanned).map((guest, i) => {
                        const scanTime = new Date(guest.scannedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        return (
                          <tr key={guest.id || i} className="border-b border-[#f9f7fb] last:border-0">
                            <td className="py-2.5 font-bold text-[#453e54]">{i + 1}. {guest.firstName} {guest.lastName}</td>
                            <td className="py-2.5 text-right font-semibold text-[#8e879c]">{scanTime}</td>
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

      {/* ── Assign Vendor Modal ── */}
      {isAssignVendorModalOpen && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-xl font-black text-[#2e2837]">Assign Vendor to Event</h2>
            <p className="mb-4 text-xs text-[#7c758d]">Select the event you want to assign this vendor to.</p>
            <select
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-[#df1b8b]"
              value={assignToEventId}
              onChange={(e) => setAssignToEventId(e.target.value)}
            >
              <option value="" disabled>Select an event...</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsAssignVendorModalOpen(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-[#696373] transition-colors hover:bg-gray-100" disabled={isMutating}>Cancel</button>
              <button
                onClick={async () => {
                  if (!assignToEventId) return window.alert('Please select an event');
                  setIsMutating(true);
                  try {
                    await assignVendorToEvent(selectedVendorId, assignToEventId);
                    await fetchVendors();
                    setIsAssignVendorModalOpen(false);
                  } catch {
                    window.alert('Failed to assign vendor. Please try again.');
                  } finally {
                    setIsMutating(false);
                  }
                }}
                disabled={isMutating}
                className="rounded-lg bg-[#df1b8b] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#c11776] disabled:opacity-50"
              >
                {isMutating ? 'Assigning...' : 'Assign Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unassign Vendor Modal ── */}
      {isUnassignVendorModalOpen && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4">
          <div className="w-full max-w-sm animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="mb-2 text-xl font-black text-[#2e2837]">Unassign Vendor</h2>
            <p className="mb-6 text-xs text-[#7c758d]">Are you sure you want to unassign this vendor from its current event?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsUnassignVendorModalOpen(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-[#696373] transition-colors hover:bg-gray-100" disabled={isMutating}>Cancel</button>
              <button
                onClick={async () => {
                  setIsMutating(true);
                  try {
                    await unassignVendorFromEvent(selectedVendorId);
                    await fetchVendors();
                    setIsUnassignVendorModalOpen(false);
                  } catch {
                    window.alert('Failed to unassign vendor. Please try again.');
                  } finally {
                    setIsMutating(false);
                  }
                }}
                disabled={isMutating}
                className="rounded-lg bg-red-500 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {isMutating ? 'Unassigning...' : 'Yes, Unassign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Worker Modal ── */}
      {isAssignWorkerModalOpen && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-xl font-black text-[#2e2837]">Assign Worker to Event</h2>
            <p className="mb-4 text-xs text-[#7c758d]">Select the event you want to assign this worker to.</p>
            <select
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-[#df1b8b]"
              value={assignWorkerToEventId}
              onChange={(e) => setAssignWorkerToEventId(e.target.value)}
            >
              <option value="" disabled>Select an event...</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsAssignWorkerModalOpen(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-[#696373] transition-colors hover:bg-gray-100" disabled={isMutating}>Cancel</button>
              <button
                onClick={async () => {
                  if (!assignWorkerToEventId) return window.alert('Please select an event');
                  const worker = workers.find((w) => w.id === selectedWorkerId);
                  if (!worker?.vendorId) return window.alert('Error: Worker is missing a Vendor ID.');
                  setIsMutating(true);
                  try {
                    await assignWorkerToEvent(worker.vendorId, selectedWorkerId, assignWorkerToEventId);
                    await fetchWorkers();
                    setIsAssignWorkerModalOpen(false);
                    window.alert('Worker assigned successfully!');
                  } catch {
                    window.alert('Failed to assign worker. Please try again.');
                  } finally {
                    setIsMutating(false);
                  }
                }}
                disabled={isMutating}
                className="rounded-lg bg-[#df1b8b] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#c11776] disabled:opacity-50"
              >
                {isMutating ? 'Assigning...' : 'Assign Worker'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unassign Worker Modal ── */}
      {isUnassignWorkerModalOpen && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4">
          <div className="w-full max-w-sm animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 className="mb-2 text-xl font-black text-[#2e2837]">Unassign Worker</h2>
            <p className="mb-6 text-xs text-[#7c758d]">
              {(() => {
                const worker = workers.find((w) => w.id === selectedWorkerId);
                const evt = events.find((e) => e.id === worker?.eventId);
                return `Are you sure you want to unassign this worker from "${evt ? evt.title : 'its current event'}"?`;
              })()}
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsUnassignWorkerModalOpen(false)} className="rounded-lg px-4 py-2 text-xs font-bold text-[#696373] transition-colors hover:bg-gray-100" disabled={isMutating}>Cancel</button>
              <button
                onClick={async () => {
                  const worker = workers.find((w) => w.id === selectedWorkerId);
                  if (!worker?.vendorId) return window.alert('Error: Worker is missing a Vendor ID.');
                  setIsMutating(true);
                  try {
                    await unassignWorkerFromEvent(worker.vendorId, selectedWorkerId);
                    await fetchWorkers();
                    setIsUnassignWorkerModalOpen(false);
                    window.alert('Worker unassigned successfully!');
                  } catch {
                    window.alert('Failed to unassign worker. Please try again.');
                  } finally {
                    setIsMutating(false);
                  }
                }}
                disabled={isMutating}
                className="rounded-lg bg-red-500 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {isMutating ? 'Unassigning...' : 'Yes, Unassign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assigned Events Modal ── */}
      {isAssignedEventsModalOpen && (
        <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
          <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in rounded-3xl bg-white p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsAssignedEventsModalOpen(false)}
              className="absolute right-5 top-5 text-[#a69eb5] hover:text-[#df1b8b] transition-colors"
            >
              <X className="size-5" />
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#2e2837]">Assigned Events</h2>
              <p className="text-sm font-semibold text-[#df1b8b]">{assignedEventsTargetName}</p>
            </div>
            <div className="max-h-[50vh] overflow-y-auto pr-2 [scrollbar-width:thin]">
              {isLoadingAssignedEvents ? (
                <div className="flex h-32 flex-col items-center justify-center text-sm font-semibold text-[#a69eb5]">
                  <svg className="mb-2 h-6 w-6 animate-spin text-[#df1b8b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Fetching events...
                </div>
              ) : assignedEventsList.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#e1d5eb] bg-[#faf9fc] text-center">
                  <CalendarDays className="mb-2 size-8 text-[#d4c5e3]" />
                  <p className="text-sm font-semibold text-[#8b839c]">No events assigned yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {assignedEventsList.filter((e) => String(e.status).toLowerCase() !== 'completed').length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#625974]">
                        <span className="h-2 w-2 rounded-full bg-[#df1b8b]"></span>
                        Current Assignments
                      </h3>
                      <div className="space-y-3">
                        {assignedEventsList
                          .filter((e) => String(e.status).toLowerCase() !== 'completed')
                          .map((evt, i) => (
                            <div key={`curr-${i}`} className="flex items-center justify-between rounded-xl border border-[#f1eef5] bg-white p-4 shadow-sm transition-all hover:border-[#df1b8b]/40 hover:shadow-md">
                              <div>
                                <p className="font-bold text-[#352f44]">{evt.title || 'Unknown Event'}</p>
                                <p className="text-xs font-medium text-[#8b839c]">
                                  {evt.eventDate || evt.startDate
                                    ? new Date(evt.eventDate || evt.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'Date TBD'}
                                </p>
                              </div>
                              <Badge className="bg-[#fff5d3] text-[#b68c17] uppercase tracking-wider text-[9px] shadow-none">
                                {evt.status || 'Pending'}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {assignedEventsList.filter((e) => String(e.status).toLowerCase() === 'completed').length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#625974]">
                        <span className="h-2 w-2 rounded-full bg-[#8637c3]"></span>
                        Event History
                      </h3>
                      <div className="space-y-3">
                        {assignedEventsList
                          .filter((e) => String(e.status).toLowerCase() === 'completed')
                          .map((evt, i) => (
                            <div key={`past-${i}`} className="flex items-center justify-between rounded-xl border border-[#f1eef5] bg-[#faf9fc] p-4 opacity-80 transition-opacity hover:opacity-100">
                              <div>
                                <p className="font-bold text-[#5c546a]">{evt.title || 'Unknown Event'}</p>
                                <p className="text-xs font-medium text-[#a49db4]">
                                  {evt.eventDate || evt.startDate
                                    ? new Date(evt.eventDate || evt.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'Date TBD'}
                                </p>
                              </div>
                              <Badge className="bg-[#f4e6fc] text-[#8637c3] uppercase tracking-wider text-[9px] shadow-none">Completed</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Event Details Modal ── */}
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