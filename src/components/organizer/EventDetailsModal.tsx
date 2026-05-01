import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Trash2, Users, CalendarDays, User, Briefcase } from 'lucide-react';
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
import { getRSVPList } from '@/api/rsvp';

interface EventDetailsModalProps {
  event: EventManagerEvent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, data: EventFormData) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting?: boolean;
  isAdmin?: boolean;
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
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
  Execution: { label: 'Execution', dot: 'bg-[#df1b8b]', bg: 'bg-[#ffe6f1]', text: 'text-[#df1b8b]' },
  Completed: { label: 'Completed', dot: 'bg-[#8637c3]', bg: 'bg-[#f4e6fc]', text: 'text-[#8637c3]' },
  Cancelled: { label: 'Cancelled', dot: 'bg-[#c5221f]', bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]' },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
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

  useEffect(() => {
    if (isOpen && event) {
      // Parse start and end dates — prefer raw ISO, fall back to formatted date string
      const startDateISO = parseISODate(event.startDate) || parseFormattedDate(event.date?.split(' – ')[0]);
      const endDateISO = parseISODate(event.endDate) || parseFormattedDate(event.date?.split(' – ')[1]);

      // Parse package to extract name and pax
      const { name: packageName, pax: packagePax } = parsePackageInfo(event.package);

      reset({
        title: event.title,
        startDate: startDateISO,
        endDate: endDateISO,
        eventType: event.type,
        eventPackage: packageName,
        eventPax: packagePax,
        venue: event.venue,
        status: event.status,
        notes: '',
      });

      setShowDeleteConfirm(false);

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

            return {
              id: item.id || item.guestId || item.SK || Math.random().toString(),
              firstName: fName || 'Guest',
              lastName: lName,
              isScanned: isAttending,
              scannedAt: item.updatedAt || item.scannedAt || item.createdAt || '',
              contactNumber: item.contactNumber || item.contact_number || '',
              message: item.message || '',
            };
          });

          setRsvpGuests(mapped);
        })
        .catch(() => setRsvpGuests([]))
        .finally(() => setIsLoadingRsvp(false));
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

  return (
    <div className="fixed inset-0 z-1000 flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
      <div className="relative w-full max-w-4xl animate-in zoom-in-95 fade-in rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={isUpdating || isDeleting}
          className="absolute right-6 top-6 z-10 text-[#a69eb5] hover:text-[#df1b8b] transition-colors disabled:opacity-50"
        >
          <X className="size-6" />
        </button>

        {/* ──── Header ──── */}
        <div className="px-8 pt-8 pb-0">
          <div className="flex items-start gap-4 mb-2">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-[#2e2837]">Event Details</h2>
              <p className="text-sm font-semibold text-[#7c758d]">
                Manage event information, RSVP, and assignments
              </p>
            </div>
            <Badge className={`${statusCfg.bg} ${statusCfg.text} text-xs font-black tracking-wide px-3 py-1.5 shadow-none`}>
              <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${statusCfg.dot}`}></span>
              {statusCfg.label}
            </Badge>
          </div>

          {/* ──── Info Cards ──── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-6">
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3.5 w-3.5 text-[#df1b8b]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">Client</span>
              </div>
              <p className="text-sm font-bold text-[#2e2837] truncate">{event.client}</p>
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-3.5 w-3.5 text-[#8637c3]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">Organizer</span>
              </div>
              <p className="text-sm font-bold text-[#2e2837] truncate">{event.organizerName || 'Unassigned'}</p>
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-3.5 w-3.5 text-[#e2b020]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">Date</span>
              </div>
              <p className="text-sm font-bold text-[#2e2837] truncate">{event.date}</p>
            </div>
            <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] px-3 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-[#29bf4c]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b839c]">RSVP</span>
              </div>
              <p className="text-sm font-bold text-[#2e2837]">
                {isLoadingRsvp ? '...' : `${attendingCount} / ${totalRsvp}`}
              </p>
            </div>
          </div>
        </div>

        {/* ──── Two Column Layout ──── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* ──── Left: Edit Form (3 cols) ──── */}
          <div className="md:col-span-3 px-8 pb-8 md:border-r border-[#f1eef5]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    End Date
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
                  <Label htmlFor="venue" className="text-sm font-bold text-[#2e2837]">
                    Venue
                  </Label>
                  <Input
                    id="venue"
                    {...register('venue')}
                    className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                    placeholder="Event location"
                    disabled={isUpdating}
                  />
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f1eef5]">
                {/* Admin Delete */}
                <div>
                  {isAdmin && onDelete && (
                    <>
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#c5221f]">Delete this event?</span>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => void handleDelete()}
                            disabled={isDeleting}
                            className="h-7 rounded-md bg-[#c5221f] px-3 text-[10px] font-bold text-white hover:bg-[#a31b18] disabled:opacity-50"
                          >
                            {isDeleting ? 'Deleting...' : 'Confirm'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                            className="h-7 rounded-md px-3 text-[10px] font-bold text-[#696373]"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={isUpdating}
                          className="h-8 text-xs font-bold text-[#c5221f] hover:bg-[#fce8e6] hover:text-[#a31b18]"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Delete Event
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    disabled={isUpdating}
                    variant="outline"
                    className="rounded-lg px-6 py-2 text-sm font-bold text-[#696373] border-[#e1d5eb] hover:bg-[#faf9fc]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-lg bg-linear-to-r from-[#df1b8b] to-[#9f1baf] px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </div>
                    ) : (
                      'Update Event'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* ──── Right: RSVP Panel (2 cols) ──── */}
          <div className="md:col-span-2 px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#7c7390]">
                RSVP Guests ({totalRsvp})
              </h3>
            </div>

            {/* RSVP Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-xl border border-[#e1d5eb] bg-[#F6E7FF] p-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2e2837] mb-1">Attending</p>
                <p className="text-2xl font-black text-[#8637c3]">
                  {isLoadingRsvp ? '...' : attendingCount}
                </p>
              </div>
              <div className="rounded-xl border border-[#f1eef5] bg-[#faf9fc] p-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2e2837] mb-1">Absent</p>
                <p className="text-2xl font-black text-[#8b839c]">
                  {isLoadingRsvp ? '...' : totalRsvp - attendingCount}
                </p>
              </div>
            </div>

            {/* Guest List */}
            <div className="overflow-hidden rounded-xl border border-[#eae4f1]">
              <div className="border-b border-[#eae4f1] bg-[#faf9fc] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#2e2837]">
                  Guest List
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto bg-white [scrollbar-width:thin]">
                {isLoadingRsvp ? (
                  <div className="flex items-center justify-center py-8">
                    <svg
                      className="animate-spin h-5 w-5 text-[#df1b8b]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : rsvpGuests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="mb-2 h-6 w-6 text-[#d4c5e3]" />
                    <p className="text-xs font-semibold text-[#8b839c]">No RSVP guests yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f9f7fb]">
                    {rsvpGuests.map((guest, i) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-[#faf9fc] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#2e2837] truncate">
                            {i + 1}. {guest.firstName} {guest.lastName}
                          </p>
                          {guest.contactNumber && (
                            <p className="text-[10px] font-semibold text-[#a49db4] truncate">
                              {guest.contactNumber}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={`text-[9px] px-1.5 py-0.5 shadow-none ${
                            guest.isScanned
                              ? 'bg-[#e6f4ea] text-[#1e7e34]'
                              : 'bg-[#f3f0f7] text-[#7c7390]'
                          }`}
                        >
                          {guest.isScanned ? 'Present' : 'Absent'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
