import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
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
import type { EventManagerEvent } from '@/api/events';

interface EventDetailsModalProps {
  event: EventManagerEvent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, data: EventFormData) => Promise<void>;
  isUpdating: boolean;
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

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
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
      eventPackage: event.package,
      eventPax: 0,
      venue: event.venue,
      status: event.status,
      notes: '',
    },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (isOpen && event) {
      // Parse the date from the event (format: MM/DD/YY)
      const dateParts = event.date.split('/');
      let startDateISO = '';
      if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        const fullYear = `20${year}`;
        startDateISO = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      // Parse package to extract name and pax
      const packageMatch = event.package.match(/^(.+?)\s*\((\d+)\)$/);
      const packageName = packageMatch ? packageMatch[1] : event.package;
      const packagePax = packageMatch ? parseInt(packageMatch[2], 10) : 0;

      reset({
        title: event.title,
        startDate: startDateISO,
        endDate: '',
        eventType: event.type,
        eventPackage: packageName,
        eventPax: packagePax,
        venue: event.venue,
        status: event.status,
        notes: '',
      });
    }
  }, [isOpen, event, reset]);

  const onSubmit = async (data: EventFormData) => {
    await onUpdate(event.id, data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex min-h-full items-center justify-center bg-[#1a1423]/60 backdrop-blur-md p-4 overflow-auto">
      <div className="relative w-full max-w-2xl animate-in zoom-in-95 fade-in rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={isUpdating}
          className="absolute right-6 top-6 text-[#a69eb5] hover:text-[#df1b8b] transition-colors disabled:opacity-50"
        >
          <X className="size-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-black text-[#2e2837]">Event Details</h2>
          <p className="text-sm font-semibold text-[#7c758d]">Update event information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Event Type and Package */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-sm font-bold text-[#2e2837]">
                Event Type *
              </Label>
              <Input
                id="eventType"
                {...register('eventType', { required: 'Event type is required' })}
                className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b]"
                placeholder="e.g., Wedding, Birthday, Corporate"
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
                placeholder="e.g., Premium, Standard"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Pax and Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="border-[#e1d5eb] focus:border-[#df1b8b] focus:ring-[#df1b8b] min-h-[100px]"
              placeholder="Additional notes or special requirements..."
              disabled={isUpdating}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#f1eef5]">
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
        </form>
      </div>
    </div>
  );
}
