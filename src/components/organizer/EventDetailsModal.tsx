import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Trash2, Pencil, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { EventManagerEvent } from '@/api/events';
import { updateEventPricing } from '@/api/events';
import { getVendors, getVendorEntitiesByEventId, assignVendorToEvent } from '@/api/vendors';
import { getRSVPList } from '@/api/rsvp';

interface EventDetailsModalProps {
  event: EventManagerEvent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, data: EventFormData) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
  onViewPlanner?: (eventId: string) => void;
  isUpdating: boolean;
  isDeleting?: boolean;
  isAdmin?: boolean;
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  eventPackage: string;
  eventPax: number;
  venue: string;
  status: string;
  notes: string;
}

function parseISODate(rawValue?: string): string {
  if (!rawValue) return '';
  // If already YYYY-MM-DD, return directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) return rawValue;
  // Try ISO string
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function parseFormattedDate(formattedDate?: string): string {
  if (!formattedDate) return '';

  // Handle "MM/DD/YY" format
  const dateParts = formattedDate.split('/');
  if (dateParts.length === 3) {
    const [month, day, year] = dateParts;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return '';
}

function parsePackageInfo(packageStr?: string): { name: string; pax: number } {
  if (!packageStr || packageStr === '-') return { name: '', pax: 0 };
  const match = packageStr.match(/^(.+?)\s*\((\d+)\)$/);
  if (match) {
    return { name: match[1].trim(), pax: parseInt(match[2], 10) };
  }
  return { name: packageStr, pax: 0 };
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  Pending: { label: 'Planning', dot: 'bg-[#e2b020]', bg: 'bg-[#fff5d3]', text: 'text-[#b68c17]' },
  Execution: {
    label: 'Execution',
    dot: 'bg-[#df1b8b]',
    bg: 'bg-[#ffe6f1]',
    text: 'text-[#df1b8b]',
  },
  Completed: {
    label: 'Completed',
    dot: 'bg-[#8637c3]',
    bg: 'bg-[#f4e6fc]',
    text: 'text-[#8637c3]',
  },
  Cancelled: {
    label: 'Cancelled',
    dot: 'bg-[#c5221f]',
    bg: 'bg-[#fce8e6]',
    text: 'text-[#c5221f]',
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
}

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

function formatMoney(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return '—';
  return pesoFormatter.format(Number(value));
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onViewPlanner,
  isUpdating,
  isDeleting = false,
  isAdmin = false,
}: EventDetailsModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      title: event.title,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      eventType: event.type,
      eventPackage: '',
      eventPax: 0,
      venue: event.venue,
      status: event.status,
      notes: '',
    },
  });

  const statusValue = watch('status');

  // RSVP state
  const [rsvpGuests, setRsvpGuests] = useState<any[]>([]);
  const [isLoadingRsvp, setIsLoadingRsvp] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Admin pricing edit state
  const [isEditingEventPrice, setIsEditingEventPrice] = useState(false);
  const [isEditingDownpayment, setIsEditingDownpayment] = useState(false);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDownpayment, setEditDownpayment] = useState<string>('');
  const [isSavingEventPrice, setIsSavingEventPrice] = useState(false);
  const [isSavingDownpayment, setIsSavingDownpayment] = useState(false);
  const [eventPriceError, setEventPriceError] = useState<string>('');
  const [downpaymentError, setDownpaymentError] = useState<string>('');

  // Venue vendors state
  const [venueVendors, setVenueVendors] = useState<{ id: string; name: string; price: number | null }[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);
  const [isSavingVenue, setIsSavingVenue] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      // Parse start and end dates — prefer raw ISO, fall back to formatted date string
      const startDateISO =
        parseISODate(event.startDate) || parseFormattedDate(event.date?.split(' – ')[0]);
      const endDateISO =
        parseISODate(event.endDate) || parseFormattedDate(event.date?.split(' – ')[1]);

      // Parse package to extract name and pax
      const { name: packageName, pax: packagePax } = parsePackageInfo(event.package);

      reset({
        title: event.title,
        startDate: startDateISO,
        endDate: endDateISO,
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        eventType: event.type,
        eventPackage: packageName,
        eventPax: packagePax,
        venue: event.venue,
        status: event.status,
        notes: '',
      });

      setShowDeleteConfirm(false);
      setIsEditingEventPrice(false);
      setIsEditingDownpayment(false);
      setEventPriceError('');
      setDownpaymentError('');

      // Fetch RSVP guests
      setIsLoadingRsvp(true);
      getRSVPList(event.id)
        .then((data) => {
          const flatArray: any[] = [];
          const processData = (item: any) => {
            if (Array.isArray(item)) item.forEach(processData);
            else if (item && typeof item === 'object') flatArray.push(item);
          };
          processData(data);
          const mapped = flatArray.map((item: any) => {
            const fName = String(item.firstName || item.first_name || item.guestfirstName || '').replace(/undefined/gi, '').trim();
            const lName = String(item.lastName || item.last_name || item.guestlastName || '').replace(/undefined/gi, '').trim();
            const statusStr = String(item.status || '').trim().toUpperCase();
            const isAttending = item.isScanned === true || item.isScanned === 'true' || statusStr === 'ATTENDING' || statusStr === 'CONFIRMED';
            return { id: item.id || item.guestId || item.SK || Math.random().toString(), firstName: fName || 'Guest', lastName: lName, isScanned: isAttending, scannedAt: item.updatedAt || item.scannedAt || item.createdAt || '', contactNumber: item.contactNumber || item.contact_number || '', message: item.message || '' };
          });
          setRsvpGuests(mapped);
        })
        .catch(() => setRsvpGuests([]))
        .finally(() => setIsLoadingRsvp(false));

      // Fetch venue vendors
      setIsLoadingVenues(true);
      getVendors()
        .then((all) => {
          const venues = all.filter(v => v.serviceType.toLowerCase() === 'venue' && v.name && v.name !== 'Unnamed vendor').map(v => ({ id: v.id, name: v.name, price: v.price }));
          setVenueVendors(Array.from(new Map(venues.map(v => [v.name, v])).values()));
        })
        .catch(() => setVenueVendors([]))
        .finally(() => setIsLoadingVenues(false));
    }
  }, [isOpen, event, reset]);

  const onSubmit = async (data: EventFormData) => {
    await onUpdate(event.id, data);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(event.id);
    }
  };

  if (!isOpen) return null;

  const statusCfg = getStatusConfig(event.status);
  const attendingCount = rsvpGuests.filter((g) => g.isScanned).length;
  const totalRsvp = rsvpGuests.length;
  const eventPrice = Number.isFinite(Number(event.packageInitialAmount))
    ? Number(event.packageInitialAmount)
    : Number.isFinite(Number(event.packagePrice))
      ? Number(event.packagePrice)
      : null;
  const downpaymentAmount = Number.isFinite(Number(event.downpaymentAmount))
    ? Number(event.downpaymentAmount)
    : null;

  return (
    <div className="fixed inset-0 z-1000 flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
      <div className="relative w-full max-w-5xl animate-in zoom-in-95 fade-in rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* ──── Header with Actions ──── */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#f1eef5] px-8 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-[#2e2837]">Event Details</h2>
              <Badge className={`${statusCfg.bg} ${statusCfg.text} text-[10px] font-black tracking-wide px-2.5 py-1 shadow-none`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${statusCfg.dot}`}></span>
                {statusCfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && onDelete && (
                <>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#c5221f]">Delete?</span>
                      <Button type="button" size="sm" onClick={() => void handleDelete()} disabled={isDeleting} className="h-7 bg-[#c5221f] px-3 text-[10px] font-bold text-white hover:bg-[#a31b18]">
                        {isDeleting ? 'Deleting...' : 'Yes'}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="h-7 px-3 text-[10px] font-bold text-[#696373]">
                        No
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} disabled={isUpdating} className="h-8 text-xs font-bold text-[#c5221f] hover:bg-[#fce8e6]">
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  )}
                </>
              )}
              {onViewPlanner && (
                <Button type="button" onClick={() => onViewPlanner(event.id)} className="h-8 bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold px-4 text-xs">
                  View Planner
                </Button>
              )}
              <Button type="button" onClick={onClose} disabled={isUpdating} variant="outline" className="h-8 px-4 text-xs font-bold text-[#696373] border-[#e1d5eb]">
                Cancel
              </Button>
              <Button type="submit" form="event-details-form" disabled={isUpdating} className="h-8 bg-linear-to-r from-[#df1b8b] to-[#9f1baf] px-5 text-xs font-bold text-white shadow-sm disabled:opacity-50">
                {isUpdating ? <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Updating...</> : 'Update Event'}
              </Button>
              <button type="button" onClick={onClose} disabled={isUpdating || isDeleting} className="text-[#a69eb5] hover:text-[#df1b8b] transition-colors disabled:opacity-50 ml-1">
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 pt-6 pb-0">

          {/* ──── Info Cards ──── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 mb-6">
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c] mb-1 block">
                Client
              </span>
              <p className="text-sm font-bold text-[#2e2837] truncate">{event.client}</p>
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c] mb-1 block">
                Organizer
              </span>
              <p className="text-sm font-bold text-[#2e2837] truncate">
                {event.organizerName || 'Unassigned'}
              </p>
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c] mb-1 block">
                Date
              </span>
              <p className="text-sm font-bold text-[#2e2837] truncate">{event.date}</p>
            </div>
            <div className={`rounded-xl border px-3 py-3 ${isEditingEventPrice
                ? 'border-[#df1b8b]/30 bg-[#fdf2f8]'
                : 'border-[#f1eef5] bg-[#faf9fc]'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">
                  Event Price
                </span>
                {isAdmin && !isEditingEventPrice && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEventPrice(true);
                      setEditPrice(String(eventPrice ?? ''));
                      setEventPriceError('');
                    }}
                    className="text-[#a69eb5] hover:text-[#df1b8b] transition-colors"
                    title="Edit event price"
                  >
                    <Pencil className="size-3" />
                  </button>
                )}
                {isAdmin && isEditingEventPrice && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isSavingEventPrice}
                      onClick={async () => {
                        setEventPriceError('');
                        const parsedPrice = Number(editPrice);
                        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                          setEventPriceError('Invalid event price');
                          return;
                        }
                        setIsSavingEventPrice(true);
                        try {
                          await updateEventPricing(event.id, {
                            packageInitialAmount: parsedPrice,
                            // don't touch downpayment
                          });
                          event.packageInitialAmount = parsedPrice;
                          const currentDownpayment = Number(event.downpaymentAmount) || 0;
                          event.packagePrice = Math.max(0, parsedPrice - currentDownpayment);
                          setIsEditingEventPrice(false);
                        } catch (err: any) {
                          setEventPriceError(err?.response?.data?.error || 'Failed to save price');
                        } finally {
                          setIsSavingEventPrice(false);
                        }
                      }}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                      title="Save price"
                    >
                      {isSavingEventPrice ? (
                        <svg className="animate-spin size-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Check className="size-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isSavingEventPrice}
                      onClick={() => {
                        setIsEditingEventPrice(false);
                        setEventPriceError('');
                      }}
                      className="text-[#c5221f] hover:text-[#a31b18] transition-colors disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {isEditingEventPrice ? (
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  disabled={isSavingEventPrice}
                  className="w-full rounded-md border border-[#e1d5eb] bg-white px-2 py-1 text-sm font-bold text-[#2e2837] outline-none focus:border-[#df1b8b] focus:ring-1 focus:ring-[#df1b8b] disabled:opacity-50"
                  placeholder="0"
                />
              ) : (
                <p className="text-sm font-bold text-[#2e2837] truncate">{formatMoney(eventPrice)}</p>
              )}
              {eventPriceError && (
                <p className="text-[10px] font-bold text-[#c5221f] mt-1">{eventPriceError}</p>
              )}
            </div>
            <div className={`rounded-xl border px-3 py-3 ${isEditingDownpayment
                ? 'border-[#df1b8b]/30 bg-[#fdf2f8]'
                : 'border-[#f1eef5] bg-[#faf9fc]'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">
                  Downpayment
                </span>
                {isAdmin && !isEditingDownpayment && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingDownpayment(true);
                      setEditDownpayment(String(downpaymentAmount ?? ''));
                      setDownpaymentError('');
                    }}
                    className="text-[#a69eb5] hover:text-[#df1b8b] transition-colors"
                    title="Edit downpayment"
                  >
                    <Pencil className="size-3" />
                  </button>
                )}
                {isAdmin && isEditingDownpayment && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isSavingDownpayment}
                      onClick={async () => {
                        setDownpaymentError('');
                        const parsedDown = Number(editDownpayment);
                        if (!Number.isFinite(parsedDown) || parsedDown < 0) {
                          setDownpaymentError('Invalid downpayment');
                          return;
                        }
                        setIsSavingDownpayment(true);
                        try {
                          await updateEventPricing(event.id, {
                            downpaymentAmount: parsedDown,
                            // don't touch initial amount
                          });
                          event.downpaymentAmount = parsedDown;
                          const currentPrice = Number(event.packageInitialAmount) || 0;
                          event.packagePrice = Math.max(0, currentPrice - parsedDown);
                          setIsEditingDownpayment(false);
                        } catch (err: any) {
                          setDownpaymentError(err?.response?.data?.error || 'Failed to save downpayment');
                        } finally {
                          setIsSavingDownpayment(false);
                        }
                      }}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                      title="Save downpayment"
                    >
                      {isSavingDownpayment ? (
                        <svg className="animate-spin size-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Check className="size-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isSavingDownpayment}
                      onClick={() => {
                        setIsEditingDownpayment(false);
                        setDownpaymentError('');
                      }}
                      className="text-[#c5221f] hover:text-[#a31b18] transition-colors disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {isEditingDownpayment ? (
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={editDownpayment}
                  onChange={(e) => setEditDownpayment(e.target.value)}
                  disabled={isSavingDownpayment}
                  className="w-full rounded-md border border-[#e1d5eb] bg-white px-2 py-1 text-sm font-bold text-[#2e2837] outline-none focus:border-[#df1b8b] focus:ring-1 focus:ring-[#df1b8b] disabled:opacity-50"
                  placeholder="0"
                />
              ) : (
                <p className="text-sm font-bold text-[#2e2837] truncate">
                  {formatMoney(downpaymentAmount)}
                </p>
              )}
              {downpaymentError && (
                <p className="text-[10px] font-bold text-[#c5221f] mt-1">{downpaymentError}</p>
              )}
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c] mb-1 block">
                RSVP
              </span>
              <p className="text-sm font-bold text-[#2e2837]">
                {isLoadingRsvp ? '...' : `${attendingCount} / ${totalRsvp}`}
              </p>
            </div>
          </div>
        </div>

        {/* ──── Form Section ──── */}
        <div>
          <div className="px-8 pb-8">
            <form id="event-details-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold text-[#2e2837]">
                  Event Title *
                </Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                  disabled={isUpdating}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-bold text-[#2e2837]">
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate', { required: 'Start date is required' })}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    disabled={isUpdating}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-500">{errors.startDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-bold text-[#2e2837]">
                    Event Date (End Date)
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              {/* Event Day Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-bold text-[#2e2837]">
                    Event Day Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-bold text-[#2e2837]">
                    Event Day End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              {/* Type & Package */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-sm font-bold text-[#2e2837]">
                    Event Type *
                  </Label>
                  <Input
                    id="eventType"
                    {...register('eventType', { required: 'Event type is required' })}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    placeholder="e.g., Wedding, Birthday"
                    disabled={isUpdating}
                  />
                  {errors.eventType && (
                    <p className="text-xs text-red-500">{errors.eventType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventPackage" className="text-sm font-bold text-[#2e2837]">
                    Package
                  </Label>
                  <Input
                    id="eventPackage"
                    {...register('eventPackage')}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    placeholder="e.g., Bloom, Grandezza"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              {/* Pax & Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="eventPax" className="text-sm font-bold text-[#2e2837]">
                    Expected Guests (Pax)
                  </Label>
                  <Input
                    id="eventPax"
                    type="number"
                    min="0"
                    {...register('eventPax', { valueAsNumber: true })}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#2e2837]">
                    Venue {isSavingVenue && <Loader2 className="inline ml-1 h-3 w-3 animate-spin text-[#df1b8b]" />}
                  </Label>
                  <Select
                    value={watch('venue') || undefined}
                    onValueChange={async (value) => {
                      setValue('venue', value);
                      // Auto-assign the selected venue vendor to this event
                      const selectedVenueVendor = venueVendors.find(v => v.name === value);
                      if (selectedVenueVendor) {
                        setIsSavingVenue(true);
                        try {
                          // First unassign any existing venue vendor
                          const currentVendors = await getVendorEntitiesByEventId(event.id);
                          const existingVenueVendor = currentVendors.find(v => v.serviceType.toLowerCase() === 'venue');
                          if (existingVenueVendor && existingVenueVendor.id !== selectedVenueVendor.id) {
                            // No need to unassign, just reassign
                          }
                          await assignVendorToEvent(selectedVenueVendor.id, event.id);
                        } catch (err) {
                          console.error('Failed to assign venue vendor:', err);
                        } finally {
                          setIsSavingVenue(false);
                        }
                      }
                    }}
                    disabled={isUpdating || isLoadingVenues}
                  >
                    <SelectTrigger className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]">
                      <SelectValue placeholder={isLoadingVenues ? 'Loading venues...' : 'Select venue...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {venueVendors.map((venue) => (
                        <SelectItem key={venue.id} value={venue.name}>
                          {venue.name}{venue.price != null ? ` (₱${venue.price.toLocaleString('en-PH')})` : ''}
                        </SelectItem>
                      ))}
                      {venueVendors.length === 0 && !isLoadingVenues && (
                        <div className="px-3 py-2 text-xs text-[#8f879f] italic">No venue vendors found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-bold text-[#2e2837]">
                  Status *
                </Label>
                <Select
                  value={statusValue}
                  onValueChange={(value) => setValue('status', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Planning</SelectItem>
                    <SelectItem value="Execution">Execution</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-bold text-[#2e2837]">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b] min-h-[80px]"
                  placeholder="Additional notes or special requirements..."
                  disabled={isUpdating}
                />
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

