import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  CalendarDays,
  Pencil,
  Search,
  Trash2,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendorEntitiesByEventId,
  getVendors,
  updateVendor,
  getVendorWorkersList,
  getVendorEventHistory,
  createVendorWorker as createVendorWorkerApi,
  deleteVendorWorker as deleteVendorWorkerApi,
  type CreateVendorPayload,
  type UpdateVendorPayload,
  type Vendor,
  type VendorWorker,
  type VendorEvent,
} from '@/api/vendors';
import { getEvents } from '@/api/events';

type VendorDialogMode = 'create' | 'edit';
type ViewMode = 'cards' | 'table';
type SortField = 'name' | 'serviceType' | 'status' | 'email' | 'phone' | 'event';

interface EventOption {
  id: string;
  title: string;
}

const EMPTY_VENDOR_FORM: CreateVendorPayload = {
  vendorName: '',
  contactPerson: '',
  typeOfSupply: '',
  servicesOffered: '',
  pricing: '',
  serviceType: '',
  price: null,
  email: '',
  contactNumber: '',
  availabilityStatus: 'inactive',
  lastEventHandled: '',
  notes: '',
};

function normalizeStatus(status: string): 'active' | 'inactive' {
  return String(status).trim().toLowerCase() === 'active' ? 'active' : 'inactive';
}

function getStatusBadge(status: string): { label: string; className: string } {
  if (normalizeStatus(status) === 'active') {
    return {
      label: 'Active',
      className: 'bg-[#29bf4c] hover:bg-[#23a542] text-white',
    };
  }

  return {
    label: 'Inactive',
    className: 'bg-[#d3d3d3] hover:bg-[#c4c4c4] text-[#333]',
  };
}

export function AdminVendorPoolPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [dialogMode, setDialogMode] = useState<VendorDialogMode>('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [vendorForm, setVendorForm] = useState<CreateVendorPayload>(EMPTY_VENDOR_FORM);

  const loadEvents = useCallback(async () => {
    try {
      const eventRows = await getEvents();
      const options: EventOption[] = eventRows.map((event) => ({
        id: event.id,
        title: event.title || 'Untitled event',
      }));
      setEvents(options);
    } catch {
      setEvents([]);
    }
  }, []);

  const loadVendors = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (eventFilter !== 'all') {
        const byEvent = await getVendorEntitiesByEventId(eventFilter);
        setVendors(byEvent);
        return;
      }

      const all = await getVendors();
      setVendors(all);
    } catch {
      setError('Unable to load vendors right now.');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventFilter]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    void loadVendors();
  }, [loadVendors]);

  const visibleVendors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return vendors;
    }

    return vendors.filter((vendor) => {
      const eventName = events.find((event) => event.id === vendor.eventId)?.title || '';
      const fields = [
        vendor.name,
        vendor.serviceType,
        vendor.contactEmail,
        vendor.contactPhone,
        vendor.eventId,
        eventName,
        vendor.status,
      ];

      return fields.some((field) => field.toLowerCase().includes(query));
    });
  }, [events, searchTerm, vendors]);

  const sortedVendors = useMemo(() => {
    return [...visibleVendors].sort((a, b) => {
      let cmp = 0;
      const getEventName = (v: Vendor) =>
        events.find((e) => e.id === v.eventId)?.title || v.eventId || '';

      switch (sortBy) {
        case 'name':
          cmp = (a.name || '').localeCompare(b.name || '');
          break;
        case 'serviceType':
          cmp = (a.serviceType || '').localeCompare(b.serviceType || '');
          break;
        case 'status':
          cmp = (a.status || '').localeCompare(b.status || '');
          break;
        case 'email':
          cmp = (a.contactEmail || '').localeCompare(b.contactEmail || '');
          break;
        case 'phone':
          cmp = (a.contactPhone || '').localeCompare(b.contactPhone || '');
          break;
        case 'event':
          cmp = getEventName(a).localeCompare(getEventName(b));
          break;
      }

      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [visibleVendors, sortBy, sortOrder, events]);

  // Reset to page 1 on filter / search / sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, eventFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedVendors.length / rowsPerPage));
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedVendors.slice(start, start + rowsPerPage);
  }, [sortedVendors, currentPage, rowsPerPage]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-[#8f1fd1]" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-[#8f1fd1]" />
    );
  };

  const hasActiveFilters = searchTerm.trim().length > 0 || eventFilter !== 'all';

  const openCreateDialog = useCallback(() => {
    setDialogMode('create');
    setEditingVendorId(null);
    setVendorForm({
      ...EMPTY_VENDOR_FORM,
      eventId: '',
    });
    setIsDialogOpen(true);
  }, []);

  const openEditDialog = useCallback(async (vendorId: string) => {
    setDialogMode('edit');
    setEditingVendorId(vendorId);
    setIsSaving(true);
    setError('');

    try {
      const vendor = await getVendorById(vendorId);
      setVendorForm({
        vendorName: vendor.name,
        contactPerson: vendor.contactPerson,
        typeOfSupply: vendor.typeOfSupply,
        servicesOffered: vendor.servicesOffered,
        pricing: vendor.pricing,
        serviceType: vendor.serviceType,
        price: vendor.price,
        eventId: vendor.eventId,
        email: vendor.contactEmail,
        contactNumber: vendor.contactPhone,
        availabilityStatus: normalizeStatus(vendor.status),
        lastEventHandled: vendor.lastEventHandled,
        notes: vendor.notes,
      });
      setIsDialogOpen(true);
    } catch {
      setError('Unable to fetch vendor details.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleSaveVendor = useCallback(async () => {
    const normalizedEventId = vendorForm.eventId?.trim() || '';

    const payloadBase = {
      vendorName: vendorForm.vendorName.trim(),
      contactPerson: vendorForm.contactPerson?.trim() || '',
      typeOfSupply: vendorForm.typeOfSupply?.trim() || '',
      servicesOffered: vendorForm.servicesOffered?.trim() || '',
      pricing: vendorForm.pricing?.trim() || '',
      serviceType: vendorForm.serviceType.trim(),
      price:
        vendorForm.price === null || vendorForm.price === undefined
          ? undefined
          : Number(vendorForm.price),
      email: vendorForm.email?.trim() || '',
      contactNumber: vendorForm.contactNumber?.trim() || '',
      availabilityStatus: normalizeStatus(vendorForm.availabilityStatus || 'inactive'),
      lastEventHandled: vendorForm.lastEventHandled?.trim() || '',
      notes: vendorForm.notes?.trim() || '',
    };

    if (!payloadBase.vendorName || !payloadBase.serviceType) {
      setError('Name and service type are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (dialogMode === 'create') {
        const payload: CreateVendorPayload = {
          ...payloadBase,
          eventId: normalizedEventId || undefined,
        };
        await createVendor(payload);
      } else if (editingVendorId) {
        const updatePayload: UpdateVendorPayload = {
          ...payloadBase,
          eventId: normalizedEventId,
        };
        await updateVendor(editingVendorId, updatePayload);
      }

      setIsDialogOpen(false);
      await loadVendors();
    } catch {
      setError('Unable to save vendor. Please verify event and permissions.');
    } finally {
      setIsSaving(false);
    }
  }, [dialogMode, editingVendorId, loadVendors, vendorForm]);

  const handleDeleteVendor = useCallback(
    async (vendor: Vendor) => {
      const shouldDelete = window.confirm(`Delete vendor ${vendor.name}?`);
      if (!shouldDelete) {
        return;
      }

      setIsSaving(true);
      setError('');

      try {
        await deleteVendor(vendor.id);
        await loadVendors();
      } catch {
        setError('Unable to delete vendor.');
      } finally {
        setIsSaving(false);
      }
    },
    [loadVendors]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2e2837]">Vendor Pool</h1>
          <p className="font-semibold text-[#8f879f]">
            Manage and track your outsourced event vendors
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="border-none bg-white pl-8 shadow-sm"
            />
          </div>

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="h-10 w-full bg-white shadow-sm sm:w-52">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-lg border border-[#e5ddee] bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#f3e8ff] text-[#8f1fd1]'
                  : 'text-[#7c7390] hover:text-[#4e445e]'
              }`}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#f3e8ff] text-[#8f1fd1]'
                  : 'text-[#7c7390] hover:text-[#4e445e]'
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button className="bg-[#ff7eb3] text-white hover:bg-[#ff6aa5]" onClick={openCreateDialog}>
            Add Vendor
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border border-[#ffd4e8] bg-[#fff4fa] shadow-none">
          <CardContent className="py-3 text-sm font-semibold text-[#9a2f63]">{error}</CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-8 text-center font-semibold text-[#7d728f]">
            Loading vendors...
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !visibleVendors.length ? (
        <Card className="relative overflow-hidden border-none shadow-sm ring-1 ring-[#f0e7f5]">
          <div className="pointer-events-none absolute -left-14 -top-14 h-36 w-36 rounded-full bg-[#ffd7ea]/70 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-14 h-44 w-44 rounded-full bg-[#dcecff]/70 blur-2xl" />
          <CardContent className="relative py-12">
            <div className="mx-auto max-w-xl space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#f3d8e7]">
                <Briefcase className="h-6 w-6 text-[#ff7eb3]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-[#2e2837]">
                  {hasActiveFilters ? 'No matching vendors' : 'No vendors yet'}
                </h2>
                <p className="text-sm font-semibold text-[#7d728f]">
                  {hasActiveFilters
                    ? 'Try adjusting your search or event filter to widen results.'
                    : 'Start building your trusted vendor roster by adding your first partner.'}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Button
                  className="bg-[#ff7eb3] text-white hover:bg-[#ff6aa5]"
                  onClick={openCreateDialog}
                >
                  Add First Vendor
                </Button>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#eadff2] bg-white text-[#574d68] hover:bg-[#faf7ff]"
                    onClick={() => {
                      setSearchTerm('');
                      setEventFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && visibleVendors.length ? (
        <>
          {/* ──── CARD VIEW ──── */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleVendors.map((vendor) => {
                const badge = getStatusBadge(vendor.status);
                const eventName =
                  events.find((event) => event.id === vendor.eventId)?.title ||
                  vendor.eventId ||
                  'Unassigned';

                return (
                  <Card key={vendor.id} className="flex flex-col border-none shadow-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#ff7eb3]" />
                            <CardTitle className="text-lg font-bold">{vendor.name}</CardTitle>
                          </div>
                          <p className="text-sm font-semibold text-muted-foreground">
                            {vendor.serviceType || '-'}
                          </p>
                        </div>

                        <Badge className={badge.className}>{badge.label}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto space-y-3 text-sm">
                      <div className="space-y-1 text-[#7a708a]">
                        <p>
                          <span className="font-semibold text-[#4e445e]">Contact Person:</span>{' '}
                          {vendor.contactPerson || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Event:</span> {eventName}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Email:</span>{' '}
                          {vendor.contactEmail || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Phone:</span>{' '}
                          {vendor.contactPhone || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Type of Supply:</span>{' '}
                          {vendor.typeOfSupply || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Services Offered:</span>{' '}
                          {vendor.servicesOffered || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Pricing:</span>{' '}
                          {vendor.pricing || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Price:</span>{' '}
                          {vendor.price ?? '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Last Event Handled:</span>{' '}
                          {vendor.lastEventHandled || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Notes:</span>{' '}
                          {vendor.notes || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Created:</span>{' '}
                          {vendor.createdAt ? new Date(vendor.createdAt).toLocaleString() : '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#4e445e]">Updated:</span>{' '}
                          {vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleString() : '-'}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => void openEditDialog(vendor.id)}
                          disabled={isSaving}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => void handleDeleteVendor(vendor)}
                          disabled={isSaving}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ──── TABLE VIEW ──── */}
          {viewMode === 'table' && (
            <div className="overflow-hidden rounded-2xl border border-[#eee7f4] bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
              <Table>
                <TableHeader className="bg-[#faf7fd]">
                  <TableRow className="border-b border-[#efe7f6]">
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        Vendor
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('serviceType')}
                    >
                      <div className="flex items-center">
                        Service Type
                        <SortIcon field="serviceType" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('event')}
                    >
                      <div className="flex items-center">
                        Event
                        <SortIcon field="event" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('phone')}
                    >
                      <div className="flex items-center">
                        Phone
                        <SortIcon field="phone" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-[#7c7390] transition-colors hover:text-[#8f1fd1]"
                      onClick={() => toggleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        <SortIcon field="status" />
                      </div>
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-black uppercase tracking-[0.06em] text-[#7c7390]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVendors.map((vendor) => {
                    const badge = getStatusBadge(vendor.status);
                    const eventName =
                      events.find((e) => e.id === vendor.eventId)?.title ||
                      vendor.eventId ||
                      'Unassigned';

                    return (
                      <TableRow
                        key={vendor.id}
                        className="border-b border-[#f3edf8] hover:bg-[#fcf9ff]"
                      >
                        <TableCell className="py-3 font-semibold text-[#2e2837]">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-[#ff7eb3]" />
                            {vendor.name}
                          </div>
                          {vendor.contactPerson && (
                            <p className="mt-0.5 text-xs text-[#8a7ca3]">{vendor.contactPerson}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-[#4e4560]">
                          {vendor.serviceType || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-[#4e4560]">{eventName}</TableCell>
                        <TableCell className="text-sm text-[#635a73]">
                          {vendor.contactEmail || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-[#635a73]">
                          {vendor.contactPhone || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={badge.className}>{badge.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg border-[#e7dff0] bg-white font-bold text-[#5f5472] hover:bg-[#f8f2fd] hover:text-[#4d4360]"
                              onClick={() => void openEditDialog(vendor.id)}
                              disabled={isSaving}
                            >
                              <Pencil className="mr-1 h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="h-8 rounded-lg"
                              onClick={() => void handleDeleteVendor(vendor)}
                              disabled={isSaving}
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination Bar */}
              <div className="flex flex-col gap-3 border-t border-[#f1eaf7] bg-[#fcf9ff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-[#7c7390]">
                  <span className="font-semibold">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-md border border-[#e5ddee] bg-white px-2 py-1 text-sm font-semibold text-[#2e2837] outline-none focus:ring-2 focus:ring-[#8f1fd1]/30"
                  >
                    {[5, 10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-[#8a7ca3]">
                    {(currentPage - 1) * rowsPerPage + 1}–
                    {Math.min(currentPage * rowsPerPage, sortedVendors.length)} of{' '}
                    {sortedVendors.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-sm font-bold text-[#2e2837]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#e5ddee] disabled:opacity-40"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Add Vendor' : 'Edit Vendor'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Create a vendor and assign it to an event.'
                : 'Update vendor details, manage workers, and view event assignments.'}
            </DialogDescription>
          </DialogHeader>

          <div className={`grid gap-6 ${dialogMode === 'edit' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* ──── LEFT COLUMN: Vendor Form ──── */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#7c7390] border-b border-[#f1eef5] pb-2">
                Vendor Details
              </h3>

              <Input
                placeholder="Vendor name *"
                value={vendorForm.vendorName}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, vendorName: event.target.value }))
                }
              />

              <Input
                placeholder="Service type *"
                value={vendorForm.serviceType}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, serviceType: event.target.value }))
                }
              />

              <Input
                placeholder="Contact person"
                value={vendorForm.contactPerson || ''}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, contactPerson: event.target.value }))
                }
              />

              <Select
                value={vendorForm.eventId || 'none'}
                onValueChange={(value) =>
                  setVendorForm((current) => ({ ...current, eventId: value === 'none' ? '' : value }))
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Assign event (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No event for now</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Contact email"
                  value={vendorForm.email || ''}
                  onChange={(event) =>
                    setVendorForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
                <Input
                  placeholder="Contact phone"
                  value={vendorForm.contactNumber || ''}
                  onChange={(event) =>
                    setVendorForm((current) => ({ ...current, contactNumber: event.target.value }))
                  }
                />
              </div>

              <Input
                placeholder="Type of supply"
                value={vendorForm.typeOfSupply || ''}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, typeOfSupply: event.target.value }))
                }
              />

              <Input
                placeholder="Services offered"
                value={vendorForm.servicesOffered || ''}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, servicesOffered: event.target.value }))
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Pricing"
                  value={vendorForm.pricing || ''}
                  onChange={(event) =>
                    setVendorForm((current) => ({ ...current, pricing: event.target.value }))
                  }
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={vendorForm.price ?? ''}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setVendorForm((current) => ({
                      ...current,
                      price: nextValue === '' ? null : Number(nextValue),
                    }));
                  }}
                />
              </div>

              <Input
                placeholder="Last event handled"
                value={vendorForm.lastEventHandled || ''}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, lastEventHandled: event.target.value }))
                }
              />

              <Input
                placeholder="Notes"
                value={vendorForm.notes || ''}
                onChange={(event) =>
                  setVendorForm((current) => ({ ...current, notes: event.target.value }))
                }
              />

              <Select
                value={normalizeStatus(vendorForm.availabilityStatus || 'inactive')}
                onValueChange={(value) =>
                  setVendorForm((current) => ({
                    ...current,
                    availabilityStatus: normalizeStatus(value),
                  }))
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ──── RIGHT COLUMN: Workers & Events (edit mode only) ──── */}
            {dialogMode === 'edit' && editingVendorId && (
              <VendorSidepanel vendorId={editingVendorId} />
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleSaveVendor()} disabled={isSaving}>
              {isSaving ? 'Saving...' : dialogMode === 'create' ? 'Create Vendor' : 'Update Vendor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── SIDE PANEL COMPONENT: Workers + Events ─────────────────────────────────

function VendorSidepanel({ vendorId }: { vendorId: string }) {
  const [workers, setWorkers] = useState<VendorWorker[]>([]);
  const [vendorEvents, setVendorEvents] = useState<VendorEvent[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [isDeletingWorkerId, setIsDeletingWorkerId] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({
    workerName: '',
    role: '',
    email: '',
    contactNumber: '',
    jobTitle: '',
  });

  const loadWorkers = useCallback(async () => {
    setIsLoadingWorkers(true);
    try {
      const data = await getVendorWorkersList(vendorId);
      setWorkers(data);
    } catch {
      setWorkers([]);
    } finally {
      setIsLoadingWorkers(false);
    }
  }, [vendorId]);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const data = await getVendorEventHistory(vendorId);
      setVendorEvents(data);
    } catch {
      setVendorEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [vendorId]);

  useEffect(() => {
    void loadWorkers();
    void loadEvents();
  }, [loadWorkers, loadEvents]);

  const handleAddWorker = async () => {
    if (!newWorkerForm.workerName.trim()) return;
    setIsAddingWorker(true);
    try {
      await createVendorWorkerApi(vendorId, {
        workerName: newWorkerForm.workerName.trim(),
        role: newWorkerForm.role.trim() || undefined,
        email: newWorkerForm.email.trim() || undefined,
        contactNumber: newWorkerForm.contactNumber.trim() || undefined,
        jobTitle: newWorkerForm.jobTitle.trim() || undefined,
        availabilityStatus: 'Active',
      });
      setNewWorkerForm({ workerName: '', role: '', email: '', contactNumber: '', jobTitle: '' });
      setShowAddForm(false);
      await loadWorkers();
    } catch {
      window.alert('Failed to add worker.');
    } finally {
      setIsAddingWorker(false);
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (!window.confirm('Remove this worker?')) return;
    setIsDeletingWorkerId(workerId);
    try {
      await deleteVendorWorkerApi(vendorId, workerId);
      await loadWorkers();
    } catch {
      window.alert('Failed to remove worker.');
    } finally {
      setIsDeletingWorkerId('');
    }
  };

  return (
    <div className="space-y-5">
      {/* ──── Workers Section ──── */}
      <div>
        <div className="flex items-center justify-between border-b border-[#f1eef5] pb-2 mb-3">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#7c7390]">
            Workers ({workers.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-[#df1b8b] hover:text-[#c11776] transition-colors"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Worker'}
          </button>
        </div>

        {/* Add Worker Form */}
        {showAddForm && (
          <div className="mb-3 rounded-xl border border-[#e1d5eb] bg-[#faf7fd] p-3 space-y-2">
            <Input
              placeholder="Worker name *"
              value={newWorkerForm.workerName}
              onChange={(e) => setNewWorkerForm((f) => ({ ...f, workerName: e.target.value }))}
              className="h-8 text-sm bg-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Role"
                value={newWorkerForm.role}
                onChange={(e) => setNewWorkerForm((f) => ({ ...f, role: e.target.value }))}
                className="h-8 text-sm bg-white"
              />
              <Input
                placeholder="Job Title"
                value={newWorkerForm.jobTitle}
                onChange={(e) => setNewWorkerForm((f) => ({ ...f, jobTitle: e.target.value }))}
                className="h-8 text-sm bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Email"
                value={newWorkerForm.email}
                onChange={(e) => setNewWorkerForm((f) => ({ ...f, email: e.target.value }))}
                className="h-8 text-sm bg-white"
              />
              <Input
                placeholder="Phone"
                value={newWorkerForm.contactNumber}
                onChange={(e) => setNewWorkerForm((f) => ({ ...f, contactNumber: e.target.value }))}
                className="h-8 text-sm bg-white"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleAddWorker()}
              disabled={isAddingWorker || !newWorkerForm.workerName.trim()}
              className="w-full h-8 bg-[#df1b8b] hover:bg-[#c11776] text-white text-xs font-bold"
            >
              {isAddingWorker ? 'Adding...' : 'Add Worker'}
            </Button>
          </div>
        )}

        {/* Workers List */}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin]">
          {isLoadingWorkers ? (
            <p className="text-xs font-semibold text-[#a49db4] text-center py-4">Loading workers...</p>
          ) : workers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e1d5eb] bg-[#faf9fc] py-6 text-center">
              <Briefcase className="mx-auto mb-1.5 h-5 w-5 text-[#d4c5e3]" />
              <p className="text-xs font-semibold text-[#8b839c]">No workers yet</p>
            </div>
          ) : (
            workers.map((worker) => (
              <div
                key={worker.id}
                className="flex items-center justify-between rounded-lg border border-[#f1eef5] bg-white px-3 py-2.5 transition-all hover:border-[#df1b8b]/30 hover:shadow-sm group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#2e2837] truncate">{worker.workerName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {worker.role && (
                      <span className="text-[10px] font-semibold text-[#8b839c]">{worker.role}</span>
                    )}
                    {worker.email && (
                      <span className="text-[10px] font-semibold text-[#a49db4] truncate">{worker.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <Badge
                    className={`text-[9px] px-1.5 py-0.5 ${
                      worker.status.toLowerCase() === 'active'
                        ? 'bg-[#e6f4ea] text-[#1e7e34]'
                        : 'bg-[#f3f0f7] text-[#7c7390]'
                    }`}
                  >
                    {worker.status}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => void handleDeleteWorker(worker.id)}
                    disabled={isDeletingWorkerId === worker.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c5221f] hover:text-[#a31b18] disabled:opacity-50"
                    title="Remove worker"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ──── Assigned Events Section ──── */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-[#7c7390] border-b border-[#f1eef5] pb-2 mb-3">
          Event History ({vendorEvents.length})
        </h3>

        <div className="max-h-44 overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin]">
          {isLoadingEvents ? (
            <p className="text-xs font-semibold text-[#a49db4] text-center py-4">Loading events...</p>
          ) : vendorEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e1d5eb] bg-[#faf9fc] py-6 text-center">
              <CalendarDays className="mx-auto mb-1.5 h-5 w-5 text-[#d4c5e3]" />
              <p className="text-xs font-semibold text-[#8b839c]">No events assigned yet</p>
            </div>
          ) : (
            vendorEvents.map((evt) => {
              const isCompleted = evt.status.toLowerCase() === 'completed' || evt.status.toLowerCase() === 'confirmed';
              const dateStr = evt.startDate || evt.eventDate;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date TBD';

              return (
                <div
                  key={evt.eventId}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all ${
                    isCompleted
                      ? 'border-[#f1eef5] bg-[#faf9fc] opacity-70'
                      : 'border-[#f1eef5] bg-white hover:border-[#df1b8b]/30 hover:shadow-sm'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#2e2837] truncate">{evt.title}</p>
                    <p className="text-[10px] font-semibold text-[#a49db4]">{formattedDate}</p>
                  </div>
                  <Badge
                    className={`text-[9px] px-1.5 py-0.5 ${
                      isCompleted
                        ? 'bg-[#f4e6fc] text-[#8637c3]'
                        : evt.status.toLowerCase() === 'execution'
                          ? 'bg-[#ffe6f1] text-[#df1b8b]'
                          : 'bg-[#fff5d3] text-[#b68c17]'
                    }`}
                  >
                    {evt.status}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
