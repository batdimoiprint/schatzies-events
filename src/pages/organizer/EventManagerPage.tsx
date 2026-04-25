import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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
import {
  deleteEvent,
  getEventManagerEvents,
  updateEvent,
  type EventManagerEvent,
} from '@/api/events';
import { getVendorsByEventId, type EventManagerVendor } from '@/api/vendors';

type VendorStatus = EventManagerVendor['status'];

function getVendorStatusBadgeClasses(status: VendorStatus) {
  if (status === 'Active') return 'bg-[#e6f4ea] text-[#1e7e34]';
  return 'bg-[#fce8e6] text-[#c5221f]';
}

export function EventManagerPage() {
  const location = useLocation();
  const outletContext = useOutletContext<OrganizerLayoutOutletContext | undefined>();
  const searchTerm = outletContext?.searchTerm ?? '';
  const [activeTab, setActiveTab] = useState<'Events' | 'Vendor' | 'Workers'>(
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
      setEvents([]);
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

    if (activeTab === 'Vendor') {
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
    }

    return { activeTab: 'Workers' as const, data: [] as never[] };
  }, [activeTab, events, searchTerm, vendors]);

  const [rsvpModalEvent, setRsvpModalEvent] = useState<EventManagerEvent | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  return (
    <div className="relative space-y-4 bg-transparent font-sans">
      {error ? (
        <Card className="border-0 bg-[#fff1f2] py-3 ring-1 ring-[#fecdd3]">
          <CardContent>
            <p className="text-sm font-medium text-[#b42318]">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col rounded-xl border border-[#eef0f4] bg-white p-6 shadow-sm overflow-hidden min-h-[calc(100vh-260px)]">
        {/* Controls Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between border-b border-[#f1eef5] pb-0">
          {/* Folder Tabs */}
          <div className="flex gap-1">
            {['Events', 'Vendor', 'Workers'].map((tabLabel) => {
              const internalTab = tabLabel as 'Events' | 'Vendor' | 'Workers';
              const isActive = activeTab === internalTab;

              return (
                <button
                  key={tabLabel}
                  type="button"
                  onClick={() => setActiveTab(internalTab)}
                  className={`relative top-px z-10 rounded-t-lg px-6 py-2.5 text-sm font-bold transition-colors ${
                    isActive
                      ? 'border border-[#f1eef5] border-b-white bg-white text-[#302a3a]'
                      : 'border border-transparent bg-[#faf9fc] text-[#a49db4] hover:bg-[#f3f0f7]'
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>

          {/* Actions & Status Buttons */}
          <div className="mb-2 flex items-center gap-3">
            {/* Custom Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => {
                  setIsActionsOpen(!isActionsOpen);
                  setIsStatusOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-full bg-linear-to-r from-[#df1b8b] to-[#9f1baf] px-5 font-sans text-xs font-bold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                Actions
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isActionsOpen && (
                <div className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-xl border border-[#f1eef5] bg-white py-1 shadow-lg">
                  {activeTab === 'Events' && selectedEventId && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          const targetEvent = events.find((e) => e.id === selectedEventId);
                          if (targetEvent) void handleUpdateEventTitle(targetEvent);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                      >
                        Edit Event
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionsOpen(false);
                          const targetEvent = events.find((e) => e.id === selectedEventId);
                          if (targetEvent) void handleDeleteEvent(targetEvent);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#c33274]"
                      >
                        Archive Event
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsActionsOpen(false);
                      void fetchEvents();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] transition-colors hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                  >
                    Refresh Data
                  </button>
                </div>
              )}
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsActionsOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-full bg-[#9f1baf] px-5 font-sans text-xs font-bold text-white shadow-sm transition-all hover:shadow-md"
              >
                Status
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isStatusOpen && (
                <div className="absolute right-0 z-20 mt-2 w-32 overflow-hidden rounded-xl border border-[#f1eef5] bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e2b020]"></span>
                    Planning
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#df1b8b]"></span>
                    Execution
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-[#5c546a] hover:bg-[#faf9fc] hover:text-[#df1b8b]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8637c3]"></span>
                    Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-lg">
          <Table className="w-full text-xs relative">
            <TableHeader>
              {activeTab === 'Events' ? (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  <TableHead className="h-10 font-black text-[#211a2f]">Title</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Date</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Time</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Client</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Type</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Package</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Venue</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">RSVP</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Status</TableHead>
                </TableRow>
              ) : activeTab === 'Vendor' ? (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  <TableHead className="h-10 font-black text-[#211a2f]">Name</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Contact Person</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Email</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Phone</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Service</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Status</TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-b-2 border-[#f1eef5] hover:bg-transparent">
                  <TableHead className="h-10 font-black text-[#211a2f]">Worker Name</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Role</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Contact</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Email</TableHead>
                  <TableHead className="h-10 font-black text-[#211a2f]">Status</TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredData.activeTab === 'Events'
                ? filteredData.data.map((event) => (
                    <TableRow
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      className={`group transition-colors border-b border-[#f6f4f9] ${selectedEventId === event.id ? 'bg-[#faf9fc] ring-1 ring-inset ring-[#e1d5eb]' : 'hover:bg-[#faf9fc]'}`}
                    >
                      <TableCell className="py-4 font-bold text-[#5c546a]">{event.title}</TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.date}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.timeSlot}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.client}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.type}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.package}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-[#5c546a]">
                        {event.venue}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-[#5c546a]">
                        <div className="flex items-center gap-1.5">
                          {event.rsvp}
                          <button
                            type="button"
                            onClick={() => setRsvpModalEvent(event)}
                            className="text-[9px] font-bold uppercase tracking-wider text-[#760CB4] hover:brightness-125 hover:underline"
                          >
                            View RSVP
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[10px] font-black tracking-wide ${
                            event.status === 'Completed'
                              ? 'bg-[#f4e6fc] text-[#8637c3]'
                              : event.status === 'Pending'
                                ? 'bg-[#fff5d3] text-[#b68c17]'
                                : 'bg-[#ffe6f1] text-[#c62876]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              event.status === 'Completed'
                                ? 'bg-[#8637c3]'
                                : event.status === 'Pending'
                                  ? 'bg-[#e2b020]'
                                  : 'bg-[#df1b8b]'
                            }`}
                          ></span>
                          {event.status === 'Pending' ? 'PLANNING' : event.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                : filteredData.activeTab === 'Vendor'
                  ? filteredData.data.map((vendor) => (
                      <TableRow
                        key={vendor.id}
                        className="border-b border-[#f6f4f9] hover:bg-[#faf9fc]"
                      >
                        <TableCell className="py-4 font-bold text-[#5c546a]">
                          {vendor.name}
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a]">
                          {vendor.contactPerson}
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a]">
                          {vendor.email}
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a]">
                          {vendor.phone}
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-[#5c546a]">
                          {vendor.service}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={getVendorStatusBadgeClasses(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              {filteredData.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === 'Events' ? 9 : activeTab === 'Vendor' ? 6 : 5}
                    className="py-12 text-center text-sm text-[#8f879f]"
                  >
                    {isLoading
                      ? 'Loading data...'
                      : activeTab === 'Events'
                        ? 'No events found.'
                        : activeTab === 'Vendor'
                          ? 'No vendors found.'
                          : 'No workers found.'}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* RSVP Modal Overlay */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-1000 flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
          <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in rounded-2xl bg-white p-6 shadow-2xl duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setRsvpModalEvent(null)}
              className="absolute right-4 top-4 text-[#a69eb5] hover:text-[#2d2834]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-[#2e2837]">RSVP</h2>
              <p className="text-xs font-semibold text-[#7c758d]">Live counts of attendees</p>
            </div>

            <div className="mb-6 flex gap-4">
              {/* Left Box */}
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

              {/* Right Info */}
              <div className="flex flex-1 flex-col justify-center gap-1 text-[11px] font-bold text-[#352f44]">
                <p>DETAILS:</p>
                <p className="font-semibold text-[#716885]">
                  FINAL HEADCOUNT: {rsvpModalEvent.rsvp}
                </p>
                <p className="font-semibold text-[#716885]">ABSENTEES: 0</p>
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
                    {[
                      'Jeremy Urmenita',
                      'Diana Rose Urmenita',
                      'Meryl C. Alcantra',
                      'Stefani Vienne R. Carcer',
                      'Aleah Missy Cabria',
                    ].map((name, i) => (
                      <tr key={i} className="border-b border-[#f9f7fb] last:border-0">
                        <td className="py-2.5 font-bold text-[#453e54]">
                          {i + 1}. {name}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-[#8e879c]">00:00 AM</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
