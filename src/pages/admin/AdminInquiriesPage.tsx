import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInquiries, updateInquiryStatus, scheduleInquiryMeeting } from '@/api/inquiries';
import { getOrganizerUsers } from '@/api/users';

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState('');
  const [selectedMeetingOrganizerId, setSelectedMeetingOrganizerId] = useState('');
  const [isUpdatingMeetingOrganizer, setIsUpdatingMeetingOrganizer] = useState(false);

  const todayKey = new Date().toISOString().split('T')[0];
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
    const fetchInquiries = async () => {
      try {
        const data = await getInquiries();
        setInquiries(data);
      } catch (error) {
        console.error('Failed to fetch inquiries', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const users = await getOrganizerUsers();
        setOrganizers(users);
      } catch (error) {
        console.error('Failed to fetch organizer users', error);
      } finally {
        setOrganizersLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const handleViewDetails = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setSelectedMeetingOrganizerId(inquiry?.meetingDetails?.organizerId || '');
    setIsDialogOpen(true);
  };

  const getOrganizerLabel = (organizerId: string) => {
    if (!organizerId) return 'Unassigned';
    const organizer = organizers.find((user) => user.user_id === organizerId);
    if (!organizer) return organizerId;

    const fullName = [organizer.firstName, organizer.middleName, organizer.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (fullName) {
      return organizer.email ? `${fullName} (${organizer.email})` : fullName;
    }

    return organizer.email || organizerId;
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;
    const id = selectedInquiry.id || selectedInquiry._id;
    try {
      await updateInquiryStatus(id, newStatus);
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      setInquiries(inquiries.map(inq => (inq.id || inq._id) === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

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
      
      // Update UI state reflecting new status and meeting details globally
      const newStatus = 'Meeting Scheduled';
      const meetingDetails = {
        date: draftEntry.startDateKey,
        time: draftEntry.startTime,
        location: draftEntry.location,
        organizerId: draftEntry.organizerId,
      };
      
      setSelectedInquiry({ ...selectedInquiry, status: newStatus, meetingDetails });
      setInquiries(inquiries.map(inq => (inq.id || inq._id) === id ? { ...inq, status: newStatus, meetingDetails } : inq));
      
      setIsScheduleModalOpen(false);
      // Reset form properly
      setDraftEntry(prev => ({ ...prev, title: '', location: '', description: '', organizerId: '' }));
    } catch (error) {
      console.error('Failed to schedule meeting and assign organizer', error);
      setScheduleError('Unable to schedule meeting right now. Please try again.');
    }
  };

  const handleUpdateMeetingOrganizer = async () => {
    if (!selectedInquiry) return;
    if (!selectedInquiry.meetingDetails) return;
    if (!selectedMeetingOrganizerId) {
      setScheduleError('Please select an organizer.');
      return;
    }

    try {
      setIsUpdatingMeetingOrganizer(true);
      setScheduleError('');

      const id = selectedInquiry.id || selectedInquiry._id;
      const existingMeeting = selectedInquiry.meetingDetails;

      await scheduleInquiryMeeting(id, {
        date: existingMeeting.date || selectedInquiry.date,
        time: existingMeeting.time || '09:00',
        location: existingMeeting.location || 'TBA',
        organizerId: selectedMeetingOrganizerId,
      });

      const updatedMeetingDetails = {
        ...existingMeeting,
        organizerId: selectedMeetingOrganizerId,
      };

      setSelectedInquiry({
        ...selectedInquiry,
        status: 'Meeting Scheduled',
        meetingDetails: updatedMeetingDetails,
      });

      setInquiries(
        inquiries.map((inq) =>
          (inq.id || inq._id) === id
            ? {
                ...inq,
                status: 'Meeting Scheduled',
                meetingDetails: updatedMeetingDetails,
              }
            : inq
        )
      );
    } catch (error) {
      console.error('Failed to update meeting organizer', error);
      setScheduleError('Unable to update organizer right now. Please try again.');
    } finally {
      setIsUpdatingMeetingOrganizer(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#2e2837]">Client Inquiries</h1>
        <p className="font-semibold text-[#8f879f]">
          Monitor and respond to incoming event requests
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        {loading ? (
          <div className="p-6"><p>Loading inquiries...</p></div>
        ) : inquiries.length === 0 ? (
          <div className="p-6"><p>No inquiries found.</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry: any) => (
                <TableRow key={inquiry.id || inquiry._id}>
                  <TableCell className="font-medium">
                    {inquiry.firstName} {inquiry.lastName}
                  </TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.eventType || inquiry.subject || 'Inquiry'}</TableCell>
                  <TableCell>{new Date(inquiry.date || inquiry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={`
                      ${inquiry.status === 'New' || inquiry.status === 'Pending Review' || inquiry.status === 'pending' ? 'bg-[#ff7eb3] hover:bg-[#ff7eb3] text-white' : ''}
                      ${inquiry.status === 'In Progress' || inquiry.status === 'Requires Clarification' ? 'bg-amber-100 hover:bg-amber-100 text-amber-700' : ''}
                      ${inquiry.status === 'Meeting Scheduled' || inquiry.status === 'meeting scheduled' ? 'bg-[#f7ebff] hover:bg-[#f7ebff] text-[#6f2ea8]' : ''}
                      ${inquiry.status === 'Resolved' || inquiry.status === 'Approved' || inquiry.status === 'approved' ? 'bg-emerald-100 hover:bg-emerald-100 text-emerald-700' : ''}
                      ${inquiry.status === 'Declined' || inquiry.status === 'declined' ? 'bg-red-100 hover:bg-red-100 text-red-700' : ''}
                    `}>
                      {inquiry.status || 'New'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-bold" onClick={() => handleViewDetails(inquiry)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="pt-4 md:flex md:gap-4">
              <div className="space-y-4 md:w-1/2">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Sender</h4>
                  <p className="text-[#2e2837] font-medium">{selectedInquiry.firstName} {selectedInquiry.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                  {selectedInquiry.contactNumber && (
                    <p className="text-sm text-muted-foreground">{selectedInquiry.contactNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Event Format</h4>
                    <p className="text-[#2e2837] font-medium">{selectedInquiry.eventType || selectedInquiry.subject || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase">Planned Date</h4>
                    <p className="text-[#2e2837] font-medium">{new Date(selectedInquiry.date || selectedInquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectedInquiry.eventPackage && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase">Package</h4>
                      <p className="text-[#2e2837] font-medium">{selectedInquiry.eventPackage}</p>
                    </div>
                  )}
                  {selectedInquiry.eventPax && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase">Expected Pax</h4>
                      <p className="text-[#2e2837] font-medium">{selectedInquiry.eventPax}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 items-center pt-2">
                  <div className="w-full">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Status</h4>
                    <Select value={selectedInquiry.status || 'New'} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending Review">Pending Review</SelectItem>
                        <SelectItem value="Requires Clarification">Requires Clarification</SelectItem>
                        <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                        {['New', 'In Progress', 'Resolved', 'pending', 'approved', 'declined'].includes(selectedInquiry.status) && (
                          <SelectItem value={selectedInquiry.status} disabled className="hidden">{selectedInquiry.status}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Message</h4>
                  <div className="bg-slate-50 p-4 rounded-md mt-1 text-[#2e2837] min-h-[100px] whitespace-pre-wrap">
                    {selectedInquiry.message || "No additional message provided."}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 md:mt-0 md:w-1/2 md:border-t-0 md:border-l md:pl-4 md:pt-0">
                {selectedInquiry.meetingDetails ? (
                  <div className="w-full space-y-3">
                    <div className="rounded-lg border border-[#eadcf7] bg-[#fbf6ff] p-3">
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6f2ea8]">
                        Meeting Details
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#5f4f7a]">
                        {selectedInquiry.meetingDetails.date
                          ? new Date(selectedInquiry.meetingDetails.date).toLocaleDateString()
                          : 'TBD'}{' '}
                        at {selectedInquiry.meetingDetails.time || 'TBD'}
                      </p>
                      <p className="mt-1 text-xs text-[#6a5a83]">
                        Location: {selectedInquiry.meetingDetails.location || 'TBD'}
                      </p>
                      <p className="mt-1 text-xs text-[#6a5a83]">
                        Organizer: {getOrganizerLabel(selectedInquiry.meetingDetails.organizerId || '')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                      <div className="w-full sm:flex-1">
                        <Label className="mb-1 block text-[11px] font-bold text-[#6a627c]">
                          Reassign Organizer
                        </Label>
                        <select
                          value={selectedMeetingOrganizerId}
                          onChange={(e) => setSelectedMeetingOrganizerId(e.target.value)}
                          className="h-9 w-full rounded-lg border border-[#ddd8e8] bg-white px-2 text-xs font-semibold text-[#4c455e] outline-none focus:border-[#be8de4]"
                        >
                          <option value="">Select organizer</option>
                          {organizers.map((organizer) => (
                            <option key={organizer.user_id} value={organizer.user_id}>
                              {[organizer.firstName, organizer.middleName, organizer.lastName]
                                .filter(Boolean)
                                .join(' ')}
                              {organizer.email ? ` (${organizer.email})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        type="button"
                        onClick={handleUpdateMeetingOrganizer}
                        disabled={isUpdatingMeetingOrganizer || organizersLoading || !selectedMeetingOrganizerId}
                        className="bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
                      >
                        {isUpdatingMeetingOrganizer ? 'Updating...' : 'Update Organizer'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-dashed border-[#eadcf7] bg-[#fbf6ff] p-3 text-sm text-[#6a5a83]">
                      No meeting has been scheduled yet.
                    </div>
                    <Button
                      className="w-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
                      onClick={() => {
                        setDraftEntry(prev => ({
                          ...prev,
                          title: `Meeting with ${selectedInquiry?.firstName} ${selectedInquiry?.lastName}`,
                          startDateKey: selectedInquiry?.date ? new Date(selectedInquiry.date).toISOString().split('T')[0] : prev.startDateKey,
                          endDateKey: selectedInquiry?.date ? new Date(selectedInquiry.date).toISOString().split('T')[0] : prev.endDateKey,
                          organizerId: prev.organizerId || organizers[0]?.user_id || '',
                        }));
                        setScheduleError('');
                        setIsScheduleModalOpen(true);
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Sub-Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2e2837]">Schedule Meeting</DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-xs font-semibold text-[#7e768f]">
            Plot tasks, meetings, and reminders in your calendar.
          </p>
          <form onSubmit={handleScheduleSubmit} className="mt-2 flex flex-col gap-4 md:flex-row md:items-start">
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
                  className="h-9 rounded-lg border-[#ddd8e8] bg-white px-3 text-sm text-[#4c455e]"
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
                  <option value="">{organizersLoading ? 'Loading organizers...' : 'Select organizer'}</option>
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
                  <p className="text-xs font-semibold text-[#c33274]">No organizer accounts available.</p>
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
                    className="h-9 rounded-lg border-[#ddd8e8] text-sm text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">Start Time</Label>
                  <Input
                    type="time"
                    required
                    value={draftEntry.startTime}
                    onChange={(e) => setDraftEntry({ ...draftEntry, startTime: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-sm text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">End Date</Label>
                  <Input
                    type="date"
                    required
                    value={draftEntry.endDateKey}
                    onChange={(e) => setDraftEntry({ ...draftEntry, endDateKey: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-sm text-[#4c455e]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-[#6a627c]">End Time</Label>
                  <Input
                    type="time"
                    required
                    value={draftEntry.endTime}
                    onChange={(e) => setDraftEntry({ ...draftEntry, endTime: e.target.value })}
                    className="h-9 rounded-lg border-[#ddd8e8] text-sm text-[#4c455e]"
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
                  className="h-9 rounded-lg border-[#ddd8e8] px-3 text-sm text-[#4c455e]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-[#6a627c]">Description</Label>
                <textarea
                  value={draftEntry.description}
                  onChange={(e) => setDraftEntry({ ...draftEntry, description: e.target.value })}
                  placeholder="Optional notes"
                  className="h-20 w-full resize-none rounded-lg border border-[#ddd8e8] bg-white px-3 py-2 text-sm text-[#4c455e] outline-none placeholder:text-[#a49cb3] focus:border-[#be8de4]"
                />
              </div>

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
    </div>
  );
}
