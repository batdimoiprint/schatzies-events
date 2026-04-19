import { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OrganizerLayoutOutletContext } from '@/components/layouts/OrganizerLayout';

type EventStatus = 'Completed' | 'Pending' | 'Cancelled';
type VendorStatus = 'Active' | 'Inactive';

type Event = {
  id: number;
  title: string;
  date: string;
  timeSlot: string;
  client: string;
  type: string;
  package: string;
  venue: string;
  rsvp: number;
  status: EventStatus;
};

type Vendor = {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  service: string;
  status: VendorStatus;
};

const eventTableData: Event[] = [
  {
    id: 1,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 2,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 3,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 4,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
  {
    id: 5,
    title: "Angela's 18 Birthday...",
    date: '00/00/00',
    timeSlot: '9:00 AM - 10:00PM',
    client: 'Samantha Jumuad',
    type: 'Debut',
    package: 'Blooms (40)',
    venue: 'Trees Residence',
    rsvp: 40,
    status: 'Completed',
  },
];

const initialVendorData: Vendor[] = [
  {
    id: 1,
    name: 'Nice Print Photography',
    contactPerson: 'Contact person',
    email: 'niceprint@gmail.com',
    phone: '09123456789',
    service: 'Photo & Video',
    status: 'Active',
  },
  {
    id: 2,
    name: "Sam's Catering Services",
    contactPerson: 'Contact person',
    email: 'sams@gmail.com',
    phone: '09123456789',
    service: 'Catering',
    status: 'Active',
  },
  {
    id: 3,
    name: 'XYZ Lights & Sounds',
    contactPerson: 'Contact person',
    email: 'xyz@gmail.com',
    phone: '09123456789',
    service: 'Technical',
    status: 'Inactive',
  },
];

const tabs: Array<'Events' | 'Outsourced' | 'Insourced' | 'Archived'> = [
  'Events',
  'Outsourced',
  'Insourced',
  'Archived',
];

function getStatusBadgeClasses(status: EventStatus) {
  if (status === 'Completed') return 'bg-[#e8d5f2] text-[#7c3aed]';
  if (status === 'Pending') return 'bg-[#fff5db] text-[#7a5a11]';
  if (status === 'Execution') return 'bg-[#efe6ff] text-[#6f2ea8]';
  if (status === 'On-going') return 'bg-[#e6f4ea] text-[#1e7e34]';
  return 'bg-[#ffe8ef] text-[#8f1f4a]';
}

function getVendorStatusBadgeClasses(status: VendorStatus) {
  if (status === 'Active') return 'bg-[#e6f4ea] text-[#1e7e34]';
  return 'bg-[#fce8e6] text-[#c5221f]';
}

function getTabButtonClasses(isActive: boolean) {
  if (isActive) {
    return 'bg-white text-[#2e2837] shadow-sm ring-1 ring-[#e9e1f1]';
  }

  return 'bg-transparent text-[#786e89] hover:bg-white/70';
}

export function EventManagerPage() {
  const location = useLocation();
  const { searchTerm } = useOutletContext<OrganizerLayoutOutletContext>();
  const [activeTab, setActiveTab] = useState<'Events' | 'Vendor'>(
    location.state?.activeTab || 'Events'
  );
  const [events, setEvents] = useState(eventTableData);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [vendors] = useState(initialVendorData);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EventStatus>('All');
  const statusMenuRef = useRef<HTMLDivElement | null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  function openEditDialogFor(event: Event) {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  }

  function handleSaveEdit(updated: Event) {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  }

  function handleArchive(id: number) {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setArchivedEvents((prev) => [ev, ...prev]);
    setOpenMenuId(null);
  }

  function handleUnarchive(id: number) {
    const ev = archivedEvents.find((e) => e.id === id);
    if (!ev) return;
    setArchivedEvents((prev) => prev.filter((e) => e.id !== id));
    setEvents((prev) => [ev, ...prev]);
    setOpenMenuId(null);
  }

  // RSVP dialog state
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpEvent, setRsvpEvent] = useState<Event | null>(null);
  const [rsvpAttendees, setRsvpAttendees] = useState<Array<{ name: string; time: string }>>([]);

  function generateAttendees(n: number) {
    const names = [
      'Jeremy Urmenita',
      'Diana Rose Urmenita',
      'Meryl C. Alicantara',
      'Stefani Vienne R. Carcer',
      'Aleah Missy Cabria',
      'Kridsel Ybanez',
      'Anna Lopez',
      'John Doe',
      'Jane Smith',
      'Robert Brown',
    ];
    const list: Array<{ name: string; time: string }> = [];
    for (let i = 0; i < Math.min(n, 200); i++) {
      list.push({ name: names[i % names.length], time: '00:00 AM' });
    }
    return list;
  }

  function openRsvpDialog(event: Event) {
    // close edit dialog to avoid overlap
    setIsEditDialogOpen(false);
    setRsvpEvent(event);
    // simulate live attendees (up to full RSVP)
    setRsvpAttendees(generateAttendees(Math.min(event.rsvp, 50)));
    setIsRsvpOpen(true);
    setOpenMenuId(null);
  }

  // RSVP modal removed per request — no state or dialog for RSVP

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isStatusOpen &&
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      // close per-row action menu on outside click
      setOpenMenuId((prev) => (prev !== null ? null : prev));
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isStatusOpen]);

  //sa API ng backend here, pa check if tama hehe
  /*
  useEffect(() => {
    void fetchVendors(selectedEventId);
  }, [fetchVendors, selectedEventId]);

  const handleCreateEvent = useCallback(async () => {
    const title = window.prompt('Enter event title');
    if (!title?.trim()) {
      return;
    }

    const startDateInput = window.prompt('Enter start date and time (YYYY-MM-DDTHH:mm)', '');
    if (!startDateInput?.trim()) {
      return;
    }

    const startDate = startDateInput.includes('T')
      ? `${startDateInput}:00.000Z`
      : `${startDateInput}T09:00:00.000Z`;

    setIsMutating(true);
    setError('');
    try {
      await createEvent({
        title: title.trim(),
        startDate,
      });
      await fetchEvents();
    } catch {
      setError('Unable to create event. Check required fields and permissions.');
    } finally {
      setIsMutating(false);
    }
  }, [fetchEvents]);

  const handleUpdateEventTitle = useCallback(
    async (event: EventManagerEvent) => {
      const nextTitle = window.prompt('Update event title', event.title);
      if (!nextTitle?.trim() || nextTitle.trim() === event.title) {
        return;
      }

      setIsMutating(true);
      setError('');
      try {
        await updateEvent(event.id, { title: nextTitle.trim() });
        await fetchEvents();
      } catch {
        setError('Unable to update event.');
      } finally {
        setIsMutating(false);
      }
    },
    [fetchEvents]
  );

  const handleDeleteEvent = useCallback(
    async (event: EventManagerEvent) => {
      const shouldDelete = window.confirm(`Delete ${event.title}?`);
      if (!shouldDelete) {
        return;
      }

      setIsMutating(true);
      setError('');
      try {
        await deleteEvent(event.id);
        await fetchEvents();
      } catch {
        setError('Unable to delete event.');
      } finally {
        setIsMutating(false);
      }
    },
    [fetchEvents]
  );


  const filteredData = useMemo(() => {
    const q = (localSearch || searchTerm || '').trim().toLowerCase();

    if (activeTab === 'Events') {
      let list = events.slice();

      if (statusFilter !== 'All') {
        list = list.filter((e) => e.status === statusFilter);
      }

      if (!q) return { activeTab: 'Events' as const, data: list };

      const data = list.filter((event) => {
        const searchableFields = [
          event.title,
          event.date,
          event.timeSlot,
          event.organizerName ?? '',
          event.client,
          event.clientEmail ?? '',
          event.type,
          event.package,
          event.venue,
          event.message ?? '',
          String(event.rsvp),
          String(event.status),
        ];

        return searchableFields.some((field) => field.toLowerCase().includes(q));
      });

      return { activeTab: 'Events' as const, data };
    }

    // Archived tab: show archived events using same columns as Events
    if (activeTab === 'Archived') {
      let list = archivedEvents.slice();
      if (statusFilter !== 'All') {
        list = list.filter((e) => e.status === statusFilter);
      }
      if (!q) return { activeTab: 'Events' as const, data: list };
      const data = list.filter((event) => {
        const searchableFields = [
          event.title,
          event.date,
          event.timeSlot,
          event.organizerName ?? '',
          event.client,
          event.clientEmail ?? '',
          event.type,
          event.package,
          event.venue,
          event.message ?? '',
          String(event.rsvp),
          String(event.status),
        ];
        return searchableFields.some((field) => field.toLowerCase().includes(q));
      });
      return { activeTab: 'Events' as const, data };
    }

    let vlist = vendors.slice();
    if (!q) return { activeTab: 'Vendor' as const, data: vlist };

    const vdata = vlist.filter((vendor) => {
      const searchableFields = [
        vendor.name,
        vendor.contactPerson,
        vendor.email,
        vendor.phone,
        vendor.service,
        vendor.status,
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(q));
    });

    return { activeTab: 'Vendor' as const, data: vdata };
  }, [activeTab, events, vendors, localSearch, searchTerm, statusFilter]);

  return (
    <div className="space-y-5 p-6 font-sans">
      <Card className="border-0 bg-linear-to-r from-[#fff6fb] via-[#f7f3ff] to-[#eef8ff] shadow-md ring-1 ring-[#efe6f6]">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight text-[#2e2837]">Event Manager</CardTitle>
          <CardDescription className="text-[#685f79]">
            Track events and vendors in one polished workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">Events</p>
              <p className="text-2xl font-black text-[#2e2837]">{events.length}</p>
            </div>
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">Vendors</p>
              <p className="text-2xl font-black text-[#2e2837]">{vendors.length}</p>
            </div>
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">Search</p>
              <p className="truncate text-sm font-semibold text-[#2e2837]">
                {searchTerm.trim() || 'No active search'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2e2837]">Event Manager</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <Button
                key={tab}
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'bg-white/90 text-[#2e2837] shadow-sm'
                    : 'text-[#8f879f] hover:bg-white/60'
                }`}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        {/* removed centered search - moved beside Status button */}

        <div className="flex items-center gap-2">
          {/* Search moved here and shortened */}
          <input
            aria-label="Search events"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-48 rounded-full border border-[#e7e0ef] px-3 text-sm outline-none"
          />

          {/* Actions button removed per design */}

          <div className="relative" ref={statusMenuRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen((v) => !v)}
              className="h-9 rounded-full bg-white border border-[#e7e0ef] px-4 text-sm text-[#655d75] flex items-center gap-2"
            >
              Status
              <span className="text-xs">▾</span>
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-[#e3deec] bg-white p-2 shadow-[0_14px_24px_rgba(49,25,77,0.16)]">
                <div
                  onClick={() => {
                    setStatusFilter('Pending');
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#faf7ff] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ffd95a] inline-block" />
                  <span className="text-sm text-[#2e2837]">Planning</span>
                </div>

                <div
                  onClick={() => {
                    setStatusFilter('Execution');
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#faf7ff] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#f347a5] inline-block" />
                  <span className="text-sm text-[#2e2837]">Execution</span>
                </div>

                <div
                  onClick={() => {
                    setStatusFilter('Completed');
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#faf7ff] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] inline-block" />
                  <span className="text-sm text-[#2e2837]">Completed</span>
                </div>

                <div
                  onClick={() => {
                    setStatusFilter('All');
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#faf7ff] cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#cfc9d9] inline-block" />
                  <span className="text-sm text-[#2e2837]">All</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown menus: implemented below via refs and state */}

      {/* Dropdown menus: implemented below via refs and state */}

      {activeTab === 'Vendor' && events.length > 0 ? (
        <div className="flex items-center gap-3 rounded-xl bg-[#f8f4fc] px-3 py-2 ring-1 ring-[#ece4f4]">
          <label htmlFor="event-vendor-filter" className="text-sm font-semibold text-[#5f556f]">
            Selected event
          </label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger id="event-vendor-filter" className="h-8 min-w-64 bg-white">
              <SelectValue placeholder="Pick event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {error ? (
        <Card className="border-0 bg-[#fff1f2] py-3 ring-1 ring-[#fecdd3]">
          <CardContent>
            <p className="text-sm font-medium text-[#b42318]">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-0 bg-white shadow-md ring-1 ring-[#ebe6f1]">
        <CardHeader className="border-b border-[#f0eaf6]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#2e2837]">
                {activeTab === 'Events' ? 'Events Overview' : 'Vendor Directory'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'Events'
                  ? 'Manage event details, status, and quick actions.'
                  : 'Monitor assigned vendors for the selected event.'}
              </CardDescription>
            </div>
            <Badge className="bg-[#f3edfc] text-[#6f4eb8] ring-1 ring-[#e5d7fa]">
              {filteredData.data.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {activeTab === 'Events' || activeTab === 'Archived' ? (
                  <tr className="border-b border-[#e8e4ed]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Title
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Date
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Time
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Client
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Type
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Package
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Venue
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      RSVP
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Actions
                    </th>
                  </tr>
                ) : (
                  <TableRow className="border-[#efe8f6] bg-[#fcfbff]">
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Name
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Contact Person
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Email
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Phone
                    </TableHead>
                    <TableHead className="px-3 font-semibold text-[#5c536d]">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Last Transaction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#2e2837] font-sans">
                      Actions
                    </th>
                  </tr>
                )}
              </TableHeader>
              <TableBody>
                {filteredData.activeTab === 'Events'
                  ? filteredData.data.map((event) => (
                      <TableRow
                        key={event.id}
                        className="border-[#f2edf8]"
                      >
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.title}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.date}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.timeSlot}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">
                          <div>{event.client}</div>
                          {event.clientEmail && (
                            <div className="text-xs text-[#7d7686]">{event.clientEmail}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.type}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.package}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{event.venue}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">
                              {String(event.rsvp).padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={() => openRsvpDialog(event)}
                              className="text-xs text-[#6f2ea8] underline"
                            >
                              View RSVP
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm relative">
                          <div onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === event.id ? null : event.id);
                              }}
                              className="h-8 w-8 rounded-full bg-white border border-[#e7e0ef] text-sm text-[#655d75] flex items-center justify-center"
                              aria-label={`Actions for event ${event.id}`}
                            >
                              ⋯
                            </button>

                            {openMenuId === event.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-2 w-36 rounded-xl border border-[#e3deec] bg-white p-1 shadow-[0_14px_24px_rgba(49,25,77,0.16)] z-30"
                              >
                                {activeTab === 'Archived' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUnarchive(event.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-[#2e2837] hover:bg-[#faf7ff]"
                                  >
                                    Unarchive
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        openEditDialogFor(event);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-[#2e2837] hover:bg-[#faf7ff]"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleArchive(event.id)}
                                      className="w-full text-left px-3 py-2 text-sm text-[#2e2837] hover:bg-[#faf7ff]"
                                    >
                                      Archive
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  : filteredData.data.map((vendor) => (
                      <TableRow
                        key={vendor.id}
                        className="border-[#f2edf8]"
                      >
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.name}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.contactPerson}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.email}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.phone}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">{vendor.service}</td>
                        <td className="px-4 py-3 text-sm text-[#2e2837]">
                          {vendor.lastTransaction}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getVendorStatusBadgeClasses(
                              vendor.status
                            )}`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">&nbsp;</td>
                      </tr>
                    ))}
                {filteredData.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab === 'Events' || activeTab === 'Archived' ? 10 : 8}
                      className="px-4 py-6 text-center text-sm text-[#8f879f]"
                    >
                      {isLoading
                        ? 'Loading data...'
                        : `No ${activeTab.toLowerCase()} found for "${searchTerm.trim()}".`}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog for events */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => setIsEditDialogOpen(open)}>
        <DialogContent className="bg-transparent p-0 shadow-none" showCloseButton={false}>
          <DialogTitle>Edit Event</DialogTitle>
          <div className="grid grid-cols-1 gap-2 mt-3">
            <Input
              placeholder="Title"
              value={editingEvent?.title ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, title: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Input
                placeholder="Date"
                value={editingEvent?.date ?? ''}
                onChange={(e) =>
                  editingEvent && setEditingEvent({ ...editingEvent, date: e.target.value })
                }
              />
              <Input
                placeholder="Time slot"
                value={editingEvent?.timeSlot ?? ''}
                onChange={(e) =>
                  editingEvent && setEditingEvent({ ...editingEvent, timeSlot: e.target.value })
                }
              />
            </div>
            <Input
              placeholder="Client"
              value={editingEvent?.client ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, client: e.target.value })
              }
            />
            <Input
              placeholder="Client Email"
              value={editingEvent?.clientEmail ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, clientEmail: e.target.value })
              }
            />
            <Input
              placeholder="Organizer Name"
              value={editingEvent?.organizerName ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, organizerName: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Input
                placeholder="Type"
                value={editingEvent?.type ?? ''}
                onChange={(e) =>
                  editingEvent && setEditingEvent({ ...editingEvent, type: e.target.value })
                }
              />
              <Input
                placeholder="Package"
                value={editingEvent?.package ?? ''}
                onChange={(e) =>
                  editingEvent && setEditingEvent({ ...editingEvent, package: e.target.value })
                }
              />
            </div>
            <Input
              placeholder="Venue"
              value={editingEvent?.venue ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, venue: e.target.value })
              }
            />
            <Input
              placeholder="Message"
              value={editingEvent?.message ?? ''}
              onChange={(e) =>
                editingEvent && setEditingEvent({ ...editingEvent, message: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Input
                placeholder="RSVP"
                value={editingEvent?.rsvp ?? 0}
                onChange={(e) =>
                  editingEvent &&
                  setEditingEvent({ ...editingEvent, rsvp: Number(e.target.value) || 0 })
                }
              />
              <Select
                value={editingEvent?.status ?? 'Pending'}
                onValueChange={(val: string) =>
                  editingEvent && setEditingEvent({ ...editingEvent, status: val as EventStatus })
                }
              >
                <option value="Pending">Planning</option>
                <option value="Execution">Execution</option>
                <option value="On-going">On-going</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <button className="px-4 py-2 bg-[#f3f2f7] rounded">Cancel</button>
            </DialogClose>
            <button
              onClick={() => editingEvent && handleSaveEdit(editingEvent)}
              className="px-4 py-2 bg-gradient-to-r from-[#f051a3] to-[#8f1fd0] text-white rounded"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RSVP dialog (live counts + attendees) */}
      <Dialog open={isRsvpOpen} onOpenChange={(open) => setIsRsvpOpen(open)}>
        <DialogContent>
          <div className="w-full flex justify-center items-start p-6">
            <div className="relative w-full max-w-3xl">
              {/* white backdrop behind the purple card */}
              <div
                aria-hidden
                className="absolute -left-4 -top-4 w-[calc(100%+32px)] h-[calc(100%+32px)] rounded-2xl bg-white"
                style={{ boxShadow: '0 18px 30px rgba(49,25,77,0.12)' }}
              />

              <div className="relative z-10 w-full rounded-2xl bg-[#f3e0fb] p-6">
                <DialogClose asChild>
                  <button
                    aria-label="Close RSVP"
                    className="absolute right-4 top-4 text-white hover:text-gray-100"
                  >
                    ×
                  </button>
                </DialogClose>

                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-semibold mb-1">RSVP</DialogTitle>
                    <p className="text-sm text-gray-600">Live counts of attendees</p>
                  </div>
                  <div className="w-1/4" />
                </div>

                <div className="flex gap-6 items-start mt-6">
                  <div className="w-72 flex-shrink-0">
                    <div className="rounded-lg border-2 border-[#e6c9f5] bg-[#f6e9fb] p-4 h-full">
                      <p className="text-xs text-[#6b5b72] uppercase tracking-wider text-center font-semibold">
                        LIVE HEADCOUNT
                      </p>
                      <div className="mt-4 flex justify-center">
                        <div className="flex gap-3">
                          {String(rsvpAttendees.length)
                            .padStart(3, '0')
                            .split('')
                            .map((d, i) => (
                              <div
                                key={i}
                                className="w-20 h-20 rounded-md bg-white border border-[#d8cbe6] flex items-center justify-center text-3xl font-mono font-bold shadow-sm"
                              >
                                {d}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mt-4 text-center">
                        Expected Attendees:{' '}
                        <span className="font-semibold">{rsvpEvent?.rsvp ?? '-'}</span> pax
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <div className="text-sm text-right">
                      <div className="text-xs font-semibold text-[#6b5b72]">DETAILS:</div>
                      <div className="mt-2 text-sm text-gray-800">
                        FINAL HEADCOUNT:{' '}
                        <span className="font-semibold">{rsvpAttendees.length}</span>
                      </div>
                      <div className="text-sm text-gray-800">
                        ABSENTEES:{' '}
                        <span className="font-semibold">
                          {Math.max((rsvpEvent?.rsvp ?? 0) - rsvpAttendees.length, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-center mt-6">
                  NAMES OF PRESENT ATTENDEES
                </h3>

                <div className="mt-4 rounded-lg border border-[#e6e0ea] bg-white p-2">
                  <div className="overflow-auto" style={{ maxHeight: 320 }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500">
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvpAttendees.map((a, idx) => (
                          <tr key={idx} className="border-t border-[#f3f1f6]">
                            <td className="px-4 py-3 text-gray-700">
                              {idx + 1}. {a.name}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{a.time}</td>
                          </tr>
                        ))}
                        {rsvpAttendees.length === 0 && (
                          <tr>
                            <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500">
                              No attendees yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
