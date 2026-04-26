import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  createEvent,
  deleteEvent,
  getEventManagerEvents,
  updateEvent,
  type EventManagerEvent,
} from '@/api/events';
import { getVendorsByEventId, type EventManagerVendor } from '@/api/vendors';

type EventStatus = EventManagerEvent['status'];
type VendorStatus = EventManagerVendor['status'];

const tabs: Array<'Events' | 'Vendor'> = ['Events', 'Vendor'];

function getStatusBadgeClasses(status: EventStatus) {
  if (status === 'Completed') return 'bg-[#e8d5f2] text-[#7c3aed]';
  if (status === 'Pending') return 'bg-[#fff5db] text-[#7a5a11]';
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
  const outletContext = useOutletContext<OrganizerLayoutOutletContext | undefined>();
  const searchTerm = outletContext?.searchTerm ?? '';
  const [activeTab, setActiveTab] = useState<'Events' | 'Vendor'>(
    location.state?.activeTab || 'Events'
  );
  const [events, setEvents] = useState<EventManagerEvent[]>([]);
  const [vendors, setVendors] = useState<EventManagerVendor[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const eventRows = await getEventManagerEvents();
      setEvents(eventRows);
      setSelectedEventId((current) => {
        if (current && eventRows.some((event) => event.id === current)) {
          return current;
        }

        return eventRows[0]?.id || '';
      });
    } catch {
      setError('Unable to load events right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async (eventId: string) => {
    if (!eventId) {
      setVendors([]);
      return;
    }

    try {
      const vendorRows = await getVendorsByEventId(eventId);
      setVendors(vendorRows);
    } catch {
      setVendors([]);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

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
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (activeTab === 'Events') {
      if (!normalizedSearchTerm) {
        return { activeTab: 'Events' as const, data: events };
      }

      const data = events.filter((event) => {
        const searchableFields = [
          event.title,
          event.date,
          event.timeSlot,
          event.client,
          event.type,
          event.package,
          event.venue,
          event.status,
          String(event.rsvp),
        ];

        return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm));
      });

      return { activeTab: 'Events' as const, data };
    }

    if (!normalizedSearchTerm) {
      return { activeTab: 'Vendor' as const, data: vendors };
    }

    const data = vendors.filter((vendor) => {
      const searchableFields = [
        vendor.name,
        vendor.contactPerson,
        vendor.email,
        vendor.phone,
        vendor.service,
        vendor.status,
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm));
    });

    return { activeTab: 'Vendor' as const, data };
  }, [activeTab, events, searchTerm, vendors]);

  return (
    <div className="space-y-5 p-6 font-sans">
      <Card className="border-0 bg-linear-to-r from-[#fff6fb] via-[#f7f3ff] to-[#eef8ff] shadow-md ring-1 ring-[#efe6f6]">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight text-[#2e2837]">
            Event Manager
          </CardTitle>
          <CardDescription className="text-[#685f79]">
            Track events and vendors in one polished workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">
                Events
              </p>
              <p className="text-2xl font-black text-[#2e2837]">{events.length}</p>
            </div>
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">
                Vendors
              </p>
              <p className="text-2xl font-black text-[#2e2837]">{vendors.length}</p>
            </div>
            <div className="rounded-xl bg-white/85 p-3 ring-1 ring-[#ece2f6] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8d82a0]">
                Search
              </p>
              <p className="truncate text-sm font-semibold text-[#2e2837]">
                {searchTerm.trim() || 'No active search'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2e2837]">Table List</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5f1fa] p-2 ring-1 ring-[#ece4f4]">
        <div className="flex flex-wrap gap-2 rounded-xl bg-[#ede6f6] p-1">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <Button
                key={tab}
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 transition-all ${getTabButtonClasses(isActive)}`}
              >
                {tab}
              </Button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={isMutating}
            onClick={() => void handleCreateEvent()}
            className="h-9 rounded-xl bg-linear-to-r from-[#f051a3] to-[#8f1fd0] px-4 text-white shadow-md shadow-[#c26adf4d] transition-shadow hover:shadow-lg disabled:opacity-60"
          >
            <img src="/Pictures/organizerpics/Actions.png" alt="Actions" className="h-3 w-3" />
            Add Event
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => void fetchEvents()}
            variant="outline"
            className="h-9 rounded-xl border-[#dacde8] bg-white px-4 text-[#4f4462] hover:bg-[#f8f5fc] disabled:opacity-60"
          >
            <img src="/Pictures/organizerpics/All Status.png" alt="Refresh" className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>

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
          <Table className="text-sm">
            <TableHeader>
              {activeTab === 'Events' ? (
                <TableRow className="border-[#efe8f6] bg-[#fcfbff]">
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Title</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Date</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Time</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Client</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Type</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Package</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Venue</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">RSVP</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Status</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Actions</TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-[#efe8f6] bg-[#fcfbff]">
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Name</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">
                    Contact Person
                  </TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Email</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Phone</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Service</TableHead>
                  <TableHead className="px-3 font-semibold text-[#5c536d]">Status</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredData.activeTab === 'Events'
                ? filteredData.data.map((event) => (
                    <TableRow key={event.id} className="border-[#f2edf8]">
                      <TableCell className="px-3 font-medium text-[#2e2837]">
                        {event.title}
                      </TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.date}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.timeSlot}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.client}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.type}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.package}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.venue}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{event.rsvp}</TableCell>
                      <TableCell className="px-3">
                        <Badge className={getStatusBadgeClasses(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isMutating}
                            onClick={() => void handleUpdateEventTitle(event)}
                            className="h-7 rounded-lg border-[#d6cee2] px-3"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={isMutating}
                            onClick={() => void handleDeleteEvent(event)}
                            className="h-7 rounded-lg bg-[#ffe5ee] px-3 text-[#8f1f4a] hover:bg-[#ffd8e7]"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : filteredData.data.map((vendor) => (
                    <TableRow key={vendor.id} className="border-[#f2edf8]">
                      <TableCell className="px-3 font-medium text-[#2e2837]">
                        {vendor.name}
                      </TableCell>
                      <TableCell className="px-3 text-[#514a61]">{vendor.contactPerson}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{vendor.email}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{vendor.phone}</TableCell>
                      <TableCell className="px-3 text-[#514a61]">{vendor.service}</TableCell>
                      <TableCell className="px-3">
                        <Badge className={getVendorStatusBadgeClasses(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              {filteredData.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === 'Events' ? 10 : 6}
                    className="py-12 text-center text-sm text-[#8f879f]"
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
    </div>
  );
}
