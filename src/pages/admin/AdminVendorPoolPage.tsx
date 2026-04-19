import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Pencil, Search, Trash2 } from 'lucide-react';
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
  type CreateVendorPayload,
  type UpdateVendorPayload,
  type Vendor,
} from '@/api/vendors';
import { getEvents } from '@/api/events';

type VendorDialogMode = 'create' | 'edit';

interface EventOption {
  id: string;
  title: string;
}

const EMPTY_VENDOR_FORM: CreateVendorPayload = {
  vendorName: '',
  serviceType: '',
  email: '',
  contactNumber: '',
  availabilityStatus: 'inactive',
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
        serviceType: vendor.serviceType,
        eventId: vendor.eventId,
        email: vendor.contactEmail,
        contactNumber: vendor.contactPhone,
        availabilityStatus: normalizeStatus(vendor.status),
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
      serviceType: vendorForm.serviceType.trim(),
      email: vendorForm.email?.trim() || '',
      contactNumber: vendorForm.contactNumber?.trim() || '',
      availabilityStatus: normalizeStatus(vendorForm.availabilityStatus || 'inactive'),
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
          <p className="font-semibold text-[#8f879f]">Manage and track your outsourced event vendors</p>
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
          <CardContent className="py-8 text-center font-semibold text-[#7d728f]">Loading vendors...</CardContent>
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
                <Button className="bg-[#ff7eb3] text-white hover:bg-[#ff6aa5]" onClick={openCreateDialog}>
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
                      <p className="text-sm font-semibold text-muted-foreground">{vendor.serviceType || '-'}</p>
                    </div>

                    <Badge className={badge.className}>{badge.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="mt-auto space-y-3 text-sm">
                  <div className="space-y-1 text-[#7a708a]">
                    <p>
                      <span className="font-semibold text-[#4e445e]">Event:</span> {eventName}
                    </p>
                    <p>
                      <span className="font-semibold text-[#4e445e]">Email:</span> {vendor.contactEmail || '-'}
                    </p>
                    <p>
                      <span className="font-semibold text-[#4e445e]">Phone:</span> {vendor.contactPhone || '-'}
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
      ) : null}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Add Vendor' : 'Edit Vendor'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Create a vendor and assign it to an event.'
                : 'Update vendor details and event assignment.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              placeholder="Vendor name"
              value={vendorForm.vendorName}
              onChange={(event) =>
                setVendorForm((current) => ({ ...current, vendorName: event.target.value }))
              }
            />

            <Input
              placeholder="Service type"
              value={vendorForm.serviceType}
              onChange={(event) =>
                setVendorForm((current) => ({ ...current, serviceType: event.target.value }))
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

            <Select
              value={normalizeStatus(vendorForm.availabilityStatus || 'inactive')}
              onValueChange={(value) =>
                setVendorForm((current) => ({ ...current, availabilityStatus: normalizeStatus(value) }))
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
