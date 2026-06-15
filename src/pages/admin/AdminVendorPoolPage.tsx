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
  assignVendorToEvent,
  unassignVendorFromEvent,
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
type SortField = 'name' | 'serviceType' | 'status' | 'email' | 'phone' | 'price';

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
        case 'price':
          cmp = (a.price ?? 0) - (b.price ?? 0);
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
      <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-brand-deep" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-brand-deep" />
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
          <h1 className="text-3xl font-black text-foreground">Vendor Pool</h1>
          <p className="font-semibold text-muted-foreground">
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

          <div className="flex items-center rounded-lg border border-border bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#f3e8ff] text-brand-deep'
                  : 'text-muted-foreground hover:text-foreground/80'
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
                  ? 'bg-[#f3e8ff] text-brand-deep'
                  : 'text-muted-foreground hover:text-foreground/80'
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
                <h2 className="text-2xl font-black tracking-tight text-foreground">
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
                          <span className="font-semibold text-foreground/80">Contact Person:</span>{' '}
                          {vendor.contactPerson || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Event:</span> {eventName}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Email:</span>{' '}
                          {vendor.contactEmail || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Phone:</span>{' '}
                          {vendor.contactPhone || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Type of Supply:</span>{' '}
                          {vendor.typeOfSupply || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Services Offered:</span>{' '}
                          {vendor.servicesOffered || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Pricing:</span>{' '}
                          {vendor.pricing || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Price:</span>{' '}
                          {vendor.price ?? '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Last Event Handled:</span>{' '}
                          {vendor.lastEventHandled || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Notes:</span>{' '}
                          {vendor.notes || '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Created:</span>{' '}
                          {vendor.createdAt ? new Date(vendor.createdAt).toLocaleString() : '-'}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground/80">Updated:</span>{' '}
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
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
              <Table>
                <TableHeader className="bg-[#faf7fd]">
                  <TableRow className="border-b border-[#efe7f6]">
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        Vendor
                        <SortIcon field="name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('serviceType')}
                    >
                      <div className="flex items-center">
                        Service Type
                        <SortIcon field="serviceType" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('price')}
                    >
                      <div className="flex items-center">
                        Price
                        <SortIcon field="price" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('phone')}
                    >
                      <div className="flex items-center">
                        Phone
                        <SortIcon field="phone" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="h-11 cursor-pointer text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-brand-deep"
                      onClick={() => toggleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        <SortIcon field="status" />
                      </div>
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-black uppercase tracking-[0.06em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVendors.map((vendor) => {
                    const badge = getStatusBadge(vendor.status);

                    return (
                      <TableRow
                        key={vendor.id}
                        className="border-b border-[#f3edf8] hover:bg-brand/5"
                      >
                        <TableCell className="py-3 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-[#ff7eb3]" />
                            {vendor.name}
                          </div>
                          {vendor.contactPerson && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{vendor.contactPerson}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-foreground/80">
                          {vendor.serviceType || '-'}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-foreground/80">
                          {vendor.price != null
                            ? `₱${Number(vendor.price).toLocaleString('en-PH')}`
                            : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-foreground/80">
                          {vendor.contactEmail || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-foreground/80">
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
              <div className="flex flex-col gap-3 border-t border-border bg-brand/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-md border border-border bg-white px-2 py-1 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-brand-deep/30"
                  >
                    {[5, 10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="ml-2 text-muted-foreground">
                    {(currentPage - 1) * rowsPerPage + 1}–
                    {Math.min(currentPage * rowsPerPage, sortedVendors.length)} of{' '}
                    {sortedVendors.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border disabled:opacity-40"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="mx-2 text-sm font-bold text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border disabled:opacity-40"
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
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          {/* Dialog Header */}
          <div className="bg-gradient-to-r from-[#fdfbff] to-[#f5f1ff] p-6 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-foreground">
                {dialogMode === 'create' ? 'Add New Vendor' : 'Edit Vendor'}
              </DialogTitle>
              <DialogDescription className="text-sm font-semibold text-muted-foreground mt-1">
                {dialogMode === 'create'
                  ? 'Fill in the vendor details below. Fields marked with * are required.'
                  : 'Update vendor details, manage workers, and view event assignments.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <div
              className={`grid gap-8 ${dialogMode === 'edit' ? 'md:grid-cols-[1.2fr_1fr]' : 'grid-cols-1 max-w-2xl mx-auto'}`}
            >
              {/* ──── LEFT COLUMN: Vendor Form ──── */}
              <div className="space-y-6">
                {/* Basic Information */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Vendor Name <span className="text-brand">*</span>
                        </label>
                        <Input
                          placeholder="e.g. Bloom Studio"
                          value={vendorForm.vendorName}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              vendorName: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Service Type <span className="text-brand">*</span>
                        </label>
                        <Input
                          placeholder="e.g. Photography, Catering"
                          value={vendorForm.serviceType}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              serviceType: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        Contact Person
                      </label>
                      <Input
                        placeholder="e.g. Maria Santos"
                        value={vendorForm.contactPerson || ''}
                        onChange={(event) =>
                          setVendorForm((current) => ({
                            ...current,
                            contactPerson: event.target.value,
                          }))
                        }
                        className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Details */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="vendor@email.com"
                        value={vendorForm.email || ''}
                        onChange={(event) =>
                          setVendorForm((current) => ({ ...current, email: event.target.value }))
                        }
                        className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+63 912 345 6789"
                        value={vendorForm.contactNumber || ''}
                        onChange={(event) =>
                          setVendorForm((current) => ({
                            ...current,
                            contactNumber: event.target.value,
                          }))
                        }
                        className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                      />
                    </div>
                  </div>
                </section>

                {/* Supply & Services */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Supply & Services
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Type of Supply
                        </label>
                        <Input
                          placeholder="e.g. Flowers, Equipment"
                          value={vendorForm.typeOfSupply || ''}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              typeOfSupply: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Services Offered
                        </label>
                        <Input
                          placeholder="e.g. Full coverage, Setup & teardown"
                          value={vendorForm.servicesOffered || ''}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              servicesOffered: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pricing & Status */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Pricing & Status
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Pricing Model
                        </label>
                        <Input
                          placeholder="e.g. Per event, Hourly"
                          value={vendorForm.pricing || ''}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              pricing: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Price (₱)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={vendorForm.price ?? ''}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setVendorForm((current) => ({
                              ...current,
                              price: nextValue === '' ? null : Number(nextValue),
                            }));
                          }}
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Availability Status
                        </label>
                        <Select
                          value={normalizeStatus(vendorForm.availabilityStatus || 'inactive')}
                          onValueChange={(value) =>
                            setVendorForm((current) => ({
                              ...current,
                              availabilityStatus: normalizeStatus(value),
                            }))
                          }
                        >
                          <SelectTrigger className="h-10 w-full bg-white border-border font-semibold text-foreground">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#29bf4c]" />
                                Active
                              </span>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#d3d3d3]" />
                                Inactive
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Last Event Handled
                        </label>
                        <Input
                          placeholder="e.g. Santos-Reyes Wedding"
                          value={vendorForm.lastEventHandled || ''}
                          onChange={(event) =>
                            setVendorForm((current) => ({
                              ...current,
                              lastEventHandled: event.target.value,
                            }))
                          }
                          className="h-10 bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Event Assignment (create mode) */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Event Assignment
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Assign to Event <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Select
                      value={vendorForm.eventId || 'none'}
                      onValueChange={(value) =>
                        setVendorForm((current) => ({
                          ...current,
                          eventId: value === 'none' ? '' : value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-10 w-full bg-white border-border font-semibold text-foreground">
                        <SelectValue placeholder="Select an event..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">No event for now</span>
                        </SelectItem>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-3.5 w-3.5 text-brand-deep" />
                              {event.title}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </section>

                {/* Notes */}
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
                    <span className="h-px w-4 bg-[#d5c9e4]" />
                    Additional Notes
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Notes
                    </label>
                    <textarea
                      placeholder="Any additional notes or comments about this vendor..."
                      value={vendorForm.notes || ''}
                      onChange={(event) =>
                        setVendorForm((current) => ({ ...current, notes: event.target.value }))
                      }
                      rows={3}
                      className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground placeholder:text-[#b5aec3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C6bB1] focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                </section>
              </div>

              {/* ──── RIGHT COLUMN: Workers & Events (edit mode only) ──── */}
              {dialogMode === 'edit' && editingVendorId && (
                <VendorSidepanel vendorId={editingVendorId} availableEvents={events} />
              )}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-[#fdfbff] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-10 px-5 border-border text-[#5f5472] font-bold hover:bg-[#f8f2fd]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveVendor()}
              disabled={isSaving}
              className="h-10 px-6 bg-[#ff7eb3] text-white hover:bg-[#ff6aa5] font-bold shadow-sm"
            >
              {isSaving ? 'Saving...' : dialogMode === 'create' ? 'Create Vendor' : 'Update Vendor'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── SIDE PANEL COMPONENT: Workers + Events ─────────────────────────────────

function VendorSidepanel({
  vendorId,
  availableEvents,
}: {
  vendorId: string;
  availableEvents: EventOption[];
}) {
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

  const [isAssigningEvent, setIsAssigningEvent] = useState(false);
  const [selectedEventToAssign, setSelectedEventToAssign] = useState<string>('');

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

  const handleAssignEvent = async () => {
    if (!selectedEventToAssign) return;
    setIsAssigningEvent(true);
    try {
      await assignVendorToEvent(vendorId, selectedEventToAssign);
      setSelectedEventToAssign('');
      await loadEvents(); // Refresh assigned events
    } catch {
      window.alert('Failed to assign event.');
    } finally {
      setIsAssigningEvent(false);
    }
  };

  const handleUnassignEvent = async () => {
    if (!window.confirm('Unassign this vendor from this event?')) return;
    try {
      await unassignVendorFromEvent(vendorId); // Unassigns from current event
      await loadEvents();
    } catch {
      window.alert('Failed to unassign event.');
    }
  };

  return (
    <div className="space-y-6">
      {/* ──── Workers Section ──── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <span className="h-px w-4 bg-[#d5c9e4]" />
            Workers ({workers.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-brand hover:text-[#c11776] transition-colors px-2 py-1 rounded-md hover:bg-[#fff0f6]"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Worker'}
          </button>
        </div>

        {/* Add Worker Form */}
        {showAddForm && (
          <div className="mb-4 rounded-2xl border border-border bg-gradient-to-b from-[#faf7ff] to-white p-4 space-y-3 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Worker Name <span className="text-brand">*</span>
              </label>
              <Input
                placeholder="e.g. Juan Dela Cruz"
                value={newWorkerForm.workerName}
                onChange={(e) => setNewWorkerForm((f) => ({ ...f, workerName: e.target.value }))}
                className="h-9 text-sm bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Role
                </label>
                <Input
                  placeholder="e.g. Lead"
                  value={newWorkerForm.role}
                  onChange={(e) => setNewWorkerForm((f) => ({ ...f, role: e.target.value }))}
                  className="h-9 text-sm bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Job Title
                </label>
                <Input
                  placeholder="e.g. Photographer"
                  value={newWorkerForm.jobTitle}
                  onChange={(e) => setNewWorkerForm((f) => ({ ...f, jobTitle: e.target.value }))}
                  className="h-9 text-sm bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <Input
                  placeholder="worker@email.com"
                  value={newWorkerForm.email}
                  onChange={(e) => setNewWorkerForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-9 text-sm bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Phone
                </label>
                <Input
                  placeholder="+63 912 345 6789"
                  value={newWorkerForm.contactNumber}
                  onChange={(e) =>
                    setNewWorkerForm((f) => ({ ...f, contactNumber: e.target.value }))
                  }
                  className="h-9 text-sm bg-white border-border focus-visible:ring-[#8C6bB1] font-semibold"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleAddWorker()}
              disabled={isAddingWorker || !newWorkerForm.workerName.trim()}
              className="w-full h-9 bg-brand hover:bg-[#c11776] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              {isAddingWorker ? 'Adding...' : 'Add Worker'}
            </Button>
          </div>
        )}

        {/* Workers List */}
        <div className="max-h-52 overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin]">
          {isLoadingWorkers ? (
            <p className="text-xs font-semibold text-muted-foreground text-center py-4">
              Loading workers...
            </p>
          ) : workers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-[#faf9fc] py-8 text-center">
              <Briefcase className="mx-auto mb-2 h-6 w-6 text-[#d4c5e3]" />
              <p className="text-xs font-semibold text-muted-foreground">No workers yet</p>
              <p className="text-[10px] text-[#b5aec3] mt-0.5">
                Click "+ Add Worker" to get started
              </p>
            </div>
          ) : (
            workers.map((worker) => (
              <div
                key={worker.id}
                className="flex items-center justify-between rounded-xl border border-border bg-white px-3.5 py-3 transition-all hover:border-brand/25 hover:shadow-sm group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{worker.workerName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {worker.role && (
                      <span className="text-[10px] font-semibold text-muted-foreground bg-[#f5f1fa] px-1.5 py-0.5 rounded">
                        {worker.role}
                      </span>
                    )}
                    {worker.email && (
                      <span className="text-[10px] font-semibold text-muted-foreground truncate">
                        {worker.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span
                    className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      worker.status.toLowerCase() === 'active'
                        ? 'bg-[#e6f9ec] text-[#1e7e34]'
                        : 'bg-[#f3f0f7] text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        worker.status.toLowerCase() === 'active' ? 'bg-[#29bf4c]' : 'bg-[#b5aec3]'
                      }`}
                    />
                    {worker.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleDeleteWorker(worker.id)}
                    disabled={isDeletingWorkerId === worker.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-[#a31b18] disabled:opacity-50 p-1 rounded hover:bg-red-50"
                    title="Remove worker"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ──── Event Assignment Section ──── */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-4">
          <span className="h-px w-4 bg-[#d5c9e4]" />
          Event Assignment
        </h3>

        {/* Assign to Event Card */}
        <div className="rounded-2xl border border-border bg-gradient-to-b from-[#faf7ff] to-white p-4 mb-4 shadow-sm">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 block">
            Assign to Event
          </label>
          <div className="flex items-center gap-2">
            <Select value={selectedEventToAssign} onValueChange={setSelectedEventToAssign}>
              <SelectTrigger className="h-9 flex-1 bg-white text-xs border-border font-semibold">
                <SelectValue placeholder="Select event to assign..." />
              </SelectTrigger>
              <SelectContent>
                {availableEvents.map((evt) => (
                  <SelectItem key={evt.id} value={evt.id} className="text-xs">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-3 w-3 text-brand-deep" />
                      {evt.title}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleAssignEvent()}
              disabled={!selectedEventToAssign || isAssigningEvent}
              className="h-9 px-4 bg-brand-deep text-white hover:bg-[#7918b3] text-xs font-bold whitespace-nowrap rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isAssigningEvent ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>

        {/* Event History */}
        <div className="space-y-1.5 mb-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Event History ({vendorEvents.length})
          </label>
        </div>
        <div className="max-h-44 overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin]">
          {isLoadingEvents ? (
            <p className="text-xs font-semibold text-muted-foreground text-center py-4">
              Loading events...
            </p>
          ) : vendorEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-[#faf9fc] py-8 text-center">
              <CalendarDays className="mx-auto mb-2 h-6 w-6 text-[#d4c5e3]" />
              <p className="text-xs font-semibold text-muted-foreground">No events assigned yet</p>
              <p className="text-[10px] text-[#b5aec3] mt-0.5">
                Use the selector above to assign an event
              </p>
            </div>
          ) : (
            vendorEvents.map((evt) => {
              const isExecution = evt.status.toLowerCase() === 'execution';
              const isCompleted =
                evt.status.toLowerCase() === 'completed' ||
                evt.status.toLowerCase() === 'confirmed';
              const dateStr = evt.startDate || evt.eventDate;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString('en-US', {
                    timeZone: 'UTC',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date TBD';

              return (
                <div
                  key={evt.eventId}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-3 transition-all ${
                    isExecution
                      ? 'border-brand/20 bg-[#fff8fb] shadow-sm'
                      : isCompleted
                        ? 'border-border bg-[#faf9fc] opacity-70'
                        : 'border-border bg-white hover:border-brand/25 hover:shadow-sm'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{evt.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CalendarDays className="h-3 w-3 text-[#b5aec3]" />
                      <p className="text-[10px] font-semibold text-muted-foreground">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isExecution
                          ? 'bg-[#ffe6f1] text-brand'
                          : isCompleted
                            ? 'bg-brand/5 text-brand-deep'
                            : 'bg-[#fff5d3] text-[#b68c17]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isExecution
                            ? 'bg-brand'
                            : isCompleted
                              ? 'bg-brand-deep'
                              : 'bg-[#b68c17]'
                        }`}
                      />
                      {evt.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleUnassignEvent()}
                      className="text-destructive hover:text-[#a31b18] p-1 rounded hover:bg-red-50 opacity-60 hover:opacity-100 transition-all"
                      title="Unassign Event"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
