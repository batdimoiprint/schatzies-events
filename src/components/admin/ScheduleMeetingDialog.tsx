import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { scheduleInquiryMeeting } from '@/api/inquiries';

interface ScheduleMeetingDialogProps {
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  organizersLoading: boolean;
  organizers: any[];
  selectedInquiry: any;
  onInquiryUpdated: (updatedInquiry: any) => void;
}

export function ScheduleMeetingDialog({
  isScheduleModalOpen,
  setIsScheduleModalOpen,
  organizersLoading,
  organizers,
  selectedInquiry,
  onInquiryUpdated,
}: ScheduleMeetingDialogProps) {
  const todayKey = new Date().toISOString().split('T')[0];
  const [scheduleError, setScheduleError] = useState('');
  const [draftEntry, setDraftEntry] = useState({
    title: '',
    startDateKey: todayKey,
    startTime: '09:00',
    endDateKey: todayKey,
    endTime: '10:00',
    label: 'Meeting',
    organizerId: '',
    location: '',
    description: '',
    eventType: 'Client',
  });

  useEffect(() => {
    if (!isScheduleModalOpen || !selectedInquiry) return;

    const inquiryDateKey = selectedInquiry?.date
      ? new Date(selectedInquiry.date).toISOString().split('T')[0]
      : todayKey;

    setDraftEntry((prev) => ({
      ...prev,
      title: `Meeting with ${selectedInquiry?.firstName} ${selectedInquiry?.lastName}`,
      startDateKey: inquiryDateKey,
      endDateKey: inquiryDateKey,
      organizerId:
        selectedInquiry?.meetingDetails?.organizerId || prev.organizerId || organizers[0]?.user_id || '',
      location: selectedInquiry?.meetingDetails?.location || '',
    }));
    setScheduleError('');
  }, [isScheduleModalOpen, selectedInquiry, organizers, todayKey]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    if (!draftEntry.organizerId) {
      setScheduleError('Please assign an organizer before scheduling this meeting.');
      return;
    }

    try {
      const id = selectedInquiry.id || selectedInquiry._id;
      setScheduleError('');

      await scheduleInquiryMeeting(id, {
        date: draftEntry.startDateKey,
        time: draftEntry.startTime,
        location: draftEntry.location,
        organizerId: draftEntry.organizerId,
      });

      onInquiryUpdated({
        ...selectedInquiry,
        status: 'Meeting Scheduled',
        meetingDetails: {
          date: draftEntry.startDateKey,
          time: draftEntry.startTime,
          location: draftEntry.location,
          organizerId: draftEntry.organizerId,
        },
      });

      setIsScheduleModalOpen(false);
      setDraftEntry((prev) => ({
        ...prev,
        title: '',
        location: '',
        description: '',
        organizerId: '',
      }));
    } catch (error) {
      console.error('Failed to schedule meeting and assign organizer', error);
      setScheduleError('Unable to schedule meeting right now. Please try again.');
    }
  };

  return (
    <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2e2837]">
              Schedule Meeting
            </DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-xs font-semibold text-[#7e768f]">
            Plot tasks, meetings, and reminders in your calendar.
          </p>
          <form
            onSubmit={handleScheduleSubmit}
            className="mt-2 flex flex-col gap-4 md:flex-row md:items-start"
          >
            <div className="w-full space-y-3 md:w-1/2">
              <div className="space-y-1.5">
                <Label htmlFor="calendar-title" className="text-[11px] font-bold text-[#6a627c]">
                  Title
                </Label>
                <Input
                  id="calendar-title"
                  required
                  value={draftEntry.title}
                  onChange={(e) => setDraftEntry({ ...draftEntry, title: e.target.value })}
                  placeholder="Enter title"
                  className="h-9 rounded-lg border-[#ddd8e8] bg-white px-3 text-lg text-[#4c455e]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-[#6a627c]">Assign Organizer *</Label>
                <select
                  required
                  value={draftEntry.organizerId}
                  onChange={(e) => setDraftEntry({ ...draftEntry, organizerId: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-xs font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
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
                  <Label className="text-[11px] font-bold text-[#6a627c]">Start Date</Label>
                  <Input
                    type="date"
                    required
                    value={draftEntry.startDateKey}
                    onChange={(e) => setDraftEntry({ ...draftEntry, startDateKey: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-lg text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">Start Time</Label>
                  <Input
                    type="time"
                    required
                    value={draftEntry.startTime}
                    onChange={(e) => setDraftEntry({ ...draftEntry, startTime: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-lg text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">End Date</Label>
                  <Input
                    type="date"
                    required
                    value={draftEntry.endDateKey}
                    onChange={(e) => setDraftEntry({ ...draftEntry, endDateKey: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-lg text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">End Time</Label>
                  <Input
                    type="time"
                    required
                    value={draftEntry.endTime}
                    onChange={(e) => setDraftEntry({ ...draftEntry, endTime: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-lg text-[#4c455e]"
                  />
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">Label</Label>
                  <select
                    value={draftEntry.label}
                    onChange={(e) => setDraftEntry({ ...draftEntry, label: e.target.value })}
                    className="h-9 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-xs font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Task">Task</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">Event Type</Label>
                  <select
                    value={draftEntry.eventType}
                    onChange={(e) => setDraftEntry({ ...draftEntry, eventType: e.target.value })}
                    className="h-9 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-xs font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
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
                <Label className="text-[11px] font-bold text-[#6a627c]">Location</Label>
                <Input
                  value={draftEntry.location}
                  onChange={(e) => setDraftEntry({ ...draftEntry, location: e.target.value })}
                  placeholder="Optional location / Link"
                  className="h-9 rounded-lg border-[#ddd8e8] px-3 text-lg text-[#4c455e]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-[#6a627c]">Description</Label>
                <textarea
                  value={draftEntry.description}
                  onChange={(e) => setDraftEntry({ ...draftEntry, description: e.target.value })}
                  placeholder="Optional notes"
                  className="h-20 w-full resize-none rounded-lg border border-[#ddd8e8] bg-white px-3 py-2 text-lg text-[#4c455e] outline-none placeholder:text-[#a49cb3] focus:border-[#be8de4]"
                />
              </div>

              {scheduleError ? (
                <p className="text-xs font-semibold text-[#c33274]" role="alert">
                  {scheduleError}
                </p>
              ) : null}

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={organizersLoading || organizers.length === 0}
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
