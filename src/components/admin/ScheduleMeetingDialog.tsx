import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scheduleInquiryMeeting, type ScheduleInquiryMeetingPayload } from '@/api/inquiries';

interface ScheduleMeetingDialogProps {
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  organizersLoading: boolean;
  organizers: any[];
  selectedInquiry: any;
  onInquiryUpdated: (updatedInquiry: any) => void;
}

type ScheduleMeetingFormValues = ScheduleInquiryMeetingPayload;

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';

/** Convert a YYYY-MM-DD key to a local Date (noon to avoid timezone shift). */
function keyToDate(key: string | undefined): Date | undefined {
  if (!key) return undefined;
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d, 12);
}

/** Convert a Date to a YYYY-MM-DD key. */
function dateToKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a Date nicely for the button label. */
function formatDateLabel(date: Date | undefined): string {
  if (!date) return 'Pick a date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ScheduleMeetingDialog({
  isScheduleModalOpen,
  setIsScheduleModalOpen,
  organizersLoading,
  organizers,
  selectedInquiry,
  onInquiryUpdated,
}: ScheduleMeetingDialogProps) {
  // Use local date (YYYY-MM-DD) so defaults reflect the user's current day
  const todayKey = new Date().toLocaleDateString('en-CA');
  const [scheduleError, setScheduleError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ScheduleMeetingFormValues>({
    defaultValues: {
      title: '',
      startDateKey: todayKey,
      startTime: DEFAULT_START_TIME,
      endDateKey: todayKey,
      endTime: DEFAULT_END_TIME,
      label: 'Meeting',
      organizerId: '',
      location: '',
      description: '',
      eventType: 'Client',
      inquiryUserId: '',
    },
  });

  const startDateKey = watch('startDateKey');
  const startTime = watch('startTime');
  const endDateKey = watch('endDateKey');
  const endTime = watch('endTime');

  useEffect(() => {
    if (!isScheduleModalOpen) {
      reset({
        title: '',
        startDateKey: todayKey,
        startTime: DEFAULT_START_TIME,
        endDateKey: todayKey,
        endTime: DEFAULT_END_TIME,
        label: 'Meeting',
        organizerId: '',
        location: '',
        description: '',
        eventType: 'Client',
        inquiryUserId: '',
      });
      setScheduleError('');
      return;
    }

    if (!selectedInquiry) return;

    const existingMeeting = selectedInquiry?.meetingDetails || {};
    const inquiryUserId =
      selectedInquiry?.userId || selectedInquiry?.user_id || existingMeeting?.inquiryUserId || '';

    reset({
      title:
        existingMeeting?.title ||
        `Meeting with ${selectedInquiry?.firstName} ${selectedInquiry?.lastName}`,
      startDateKey: existingMeeting?.startDateKey || existingMeeting?.date || todayKey,
      startTime: existingMeeting?.startTime || existingMeeting?.time || DEFAULT_START_TIME,
      endDateKey: existingMeeting?.endDateKey || existingMeeting?.date || todayKey,
      endTime: existingMeeting?.endTime || DEFAULT_END_TIME,
      label: existingMeeting?.label || 'Meeting',
      organizerId: existingMeeting?.organizerId || organizers[0]?.user_id || '',
      location: existingMeeting?.location || '',
      description: existingMeeting?.description || '',
      eventType: existingMeeting?.eventType || 'Client',
      inquiryUserId,
    });
    setScheduleError('');
  }, [isScheduleModalOpen, selectedInquiry, organizers, reset, todayKey]);

  useEffect(() => {
    if (!startDateKey || !endDateKey) return;
    if (startDateKey > endDateKey) {
      setValue('endDateKey', startDateKey);
    }
  }, [startDateKey, endDateKey, setValue]);

  useEffect(() => {
    if (!startDateKey || !endDateKey || startDateKey !== endDateKey) return;
    if (startTime && endTime && startTime > endTime) {
      setValue('endTime', startTime);
    }
  }, [startDateKey, endDateKey, startTime, endTime, setValue]);

  const handleScheduleSubmit = async (formValues: ScheduleMeetingFormValues) => {
    if (!selectedInquiry) return;
    if (!formValues.organizerId) {
      setScheduleError('Please assign an organizer before scheduling this meeting.');
      return;
    }

    try {
      const id = selectedInquiry.id || selectedInquiry._id;
      setScheduleError('');

      const payload: ScheduleInquiryMeetingPayload = {
        ...formValues,
        inquiryUserId: formValues.inquiryUserId || undefined,
      };

      const updatedInquiry = await scheduleInquiryMeeting(id, payload);

      onInquiryUpdated(updatedInquiry);

      setIsScheduleModalOpen(false);
    } catch (error) {
      console.error('Failed to schedule meeting and assign organizer', error);
      setScheduleError('Unable to schedule meeting right now. Please try again.');
    }
  };

  return (
    <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2e2837]">Schedule Meeting</DialogTitle>
        </DialogHeader>
        <p className="mt-1 text-xs font-semibold text-[#7e768f]">
          Plot tasks, meetings, and reminders in your calendar.
        </p>
        <form
          onSubmit={handleSubmit(handleScheduleSubmit)}
          className="mt-2 flex flex-col gap-4 md:flex-row md:items-start"
        >
          <div className="w-full space-y-3 md:w-1/2">
            <div className="space-y-1.5">
              <Label htmlFor="calendar-title" className="text-sm font-bold text-[#6a627c]">
                Title
              </Label>
              <Input
                id="calendar-title"
                required
                {...register('title', { required: true })}
                placeholder="Enter title"
                className="h-11 rounded-lg border-[#ddd8e8] bg-white px-3 text-xl text-[#4c455e]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-[#6a627c]">Assign Organizer *</Label>
              <select
                required
                {...register('organizerId', { required: true })}
                className="h-11 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-sm font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
              >
                <option value="">
                  {organizersLoading ? 'Loading organizers...' : 'Select organizer'}
                </option>
                {organizers.map((organizer) => (
                  <option key={organizer.user_id} value={organizer.user_id}>
                    {[organizer.firstName, organizer.middleName, organizer.lastName]
                      .filter(Boolean)
                      .join(' ')}
                    {organizer.email ? ` (${organizer.email})` : ''}
                  </option>
                ))}
              </select>
              {!organizersLoading && organizers.length === 0 ? (
                <p className="text-xs font-semibold text-[#c33274]">
                  No organizer accounts available.
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">Start Date</Label>
                <input type="hidden" {...register('startDateKey', { required: true })} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'h-11 w-full justify-start rounded-lg border-[#ddd8e8] px-3 text-left text-sm font-semibold text-[#4c455e]',
                        !startDateKey && 'text-[#a49cb3]'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#8a7ca3]" />
                      {formatDateLabel(keyToDate(startDateKey))}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-100000 w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={keyToDate(startDateKey)}
                      onSelect={(date) => {
                        if (date) setValue('startDateKey', dateToKey(date));
                      }}
                      defaultMonth={new Date()}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">Start Time</Label>
                <Input
                  type="time"
                  required
                  {...register('startTime', { required: true })}
                  className="h-11 rounded-lg border-[#ddd8e8] text-xl text-[#4c455e]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">End Date</Label>
                <input type="hidden" {...register('endDateKey', { required: true })} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'h-11 w-full justify-start rounded-lg border-[#ddd8e8] px-3 text-left text-sm font-semibold text-[#4c455e]',
                        !endDateKey && 'text-[#a49cb3]'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#8a7ca3]" />
                      {formatDateLabel(keyToDate(endDateKey))}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-100000 w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={keyToDate(endDateKey)}
                      onSelect={(date) => {
                        if (date) setValue('endDateKey', dateToKey(date));
                      }}
                      defaultMonth={new Date()}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const startDate = keyToDate(startDateKey);
                        const floor = startDate && startDate > today ? startDate : today;
                        return date < new Date(floor.getFullYear(), floor.getMonth(), floor.getDate());
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">End Time</Label>
                <Input
                  type="time"
                  required
                  {...register('endTime', { required: true })}
                  className="h-11 rounded-lg border-[#ddd8e8] text-xl text-[#4c455e]"
                />
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">Label</Label>
                <select
                  {...register('label')}
                  className="h-11 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-sm font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Task">Task</option>
                  <option value="Reminder">Reminder</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-[#6a627c]">Event Type</Label>
                <select
                  {...register('eventType')}
                  className="h-11 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-sm font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
                >
                  <option value="General">General</option>
                  <option value="Booking">Booking</option>
                  <option value="Planning">Planning</option>
                  <option value="Operations">Operations</option>
                  <option value="Client">Client</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-[#6a627c]">Meeting Location</Label>
              <Input
                {...register('location')}
                placeholder="Location"
                className="h-11 rounded-lg border-[#ddd8e8] px-3 text-xl text-[#4c455e]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-[#6a627c]">Description</Label>
              <textarea
                {...register('description')}
                placeholder="Optional notes"
                className="h-24 w-full resize-none rounded-lg border border-[#ddd8e8] bg-white px-3 py-3 text-xl text-[#4c455e] outline-none placeholder:text-[#a49cb3] focus:border-[#be8de4]"
              />
            </div>

            <input type="hidden" {...register('inquiryUserId')} />

            {scheduleError ? (
              <p className="text-xs font-semibold text-[#c33274]" role="alert">
                {scheduleError}
              </p>
            ) : null}

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={organizersLoading || organizers.length === 0 || isSubmitting}
                className="bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
              >
                Confirm Appointment
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
