import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  MessageSquareText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInquiries, updateInquiryStatus, scheduleInquiryMeeting, checkUserRegistered } from '@/api/inquiries';
import { createUser, getOrganizerUsers } from '@/api/users';

export function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const {
    data: inquiries = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ['inquiries'],
    queryFn: getInquiries,
    refetchInterval: 10000, // polling every 10 seconds
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState('');
  const [selectedMeetingOrganizerId, setSelectedMeetingOrganizerId] = useState('');
  const [isUpdatingMeetingOrganizer, setIsUpdatingMeetingOrganizer] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreateError, setAccountCreateError] = useState('');
  const [accountCreateSuccess, setAccountCreateSuccess] = useState('');
  const [isAccountRegisteredByInquiry, setIsAccountRegisteredByInquiry] = useState<Record<string, boolean>>({});
  const [createdAccounts, setCreatedAccounts] = useState<
    Record<string, { password: string; createdAt: string }>
  >({});
  const [showPasswordByInquiry, setShowPasswordByInquiry] = useState<Record<string, boolean>>({});
  const [copiedInquiryId, setCopiedInquiryId] = useState('');

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

  const statusCounts = useMemo(() => {
    const counts = {
      total: inquiries.length,
      pending: 0,
      scheduled: 0,
      approved: 0,
    };

    inquiries.forEach((inquiry) => {
      const status = String(inquiry.status || '').toLowerCase();

      if (!status || status === 'new' || status === 'pending review' || status === 'pending') {
        counts.pending += 1;
      }

      if (status === 'meeting scheduled') {
        counts.scheduled += 1;
      }

      if (status === 'approved' || status === 'resolved') {
        counts.approved += 1;
      }
    });

    return counts;
  }, [inquiries]);

  const getStatusBadgeClass = (statusValue?: string) => {
    const status = String(statusValue || '').toLowerCase();

    if (!status || status === 'new' || status === 'pending review' || status === 'pending') {
      return 'bg-[#ff7eb3] hover:bg-[#ff7eb3] text-white';
    }

    if (status === 'in progress' || status === 'requires clarification') {
      return 'bg-amber-100 hover:bg-amber-100 text-amber-700';
    }

    if (status === 'meeting scheduled') {
      return 'bg-[#f7ebff] hover:bg-[#f7ebff] text-[#6f2ea8]';
    }

    if (status === 'resolved' || status === 'approved') {
      return 'bg-emerald-100 hover:bg-emerald-100 text-emerald-700';
    }

    if (status === 'declined') {
      return 'bg-red-100 hover:bg-red-100 text-red-700';
    }

    return 'bg-slate-100 hover:bg-slate-100 text-slate-700';
  };

  const getStatusRank = (statusValue?: string) => {
    const status = String(statusValue || '').toLowerCase();

    if (!status || status === 'new' || status === 'pending review' || status === 'pending')
      return 1;
    if (status === 'in progress' || status === 'requires clarification') return 2;
    if (status === 'meeting scheduled') return 3;
    if (status === 'approved' || status === 'resolved') return 4;
    if (status === 'declined') return 5;

    return 99;
  };

  const filteredAndSortedInquiries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = inquiries.filter((inquiry) => {
      if (!normalizedQuery) return true;

      const searchBucket = [
        inquiry.firstName,
        inquiry.lastName,
        inquiry.email,
        inquiry.eventType,
        inquiry.subject,
        inquiry.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchBucket.includes(normalizedQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'status') {
        const statusCompare = getStatusRank(a.status) - getStatusRank(b.status);
        if (statusCompare !== 0) {
          return sortOrder === 'asc' ? statusCompare : -statusCompare;
        }
      }

      const aDate = new Date(a.date || a.createdAt || 0).getTime();
      const bDate = new Date(b.date || b.createdAt || 0).getTime();
      const dateCompare = aDate - bDate;
      return sortOrder === 'asc' ? dateCompare : -dateCompare;
    });

    return sorted;
  }, [inquiries, searchQuery, sortBy, sortOrder]);

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

  const handleViewDetails = async (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setSelectedMeetingOrganizerId(inquiry?.meetingDetails?.organizerId || '');
    setAccountCreateError('');
    setAccountCreateSuccess('');
    setCopiedInquiryId('');
    setIsDialogOpen(true);

    const inquiryKey = getInquiryKey(inquiry);
    if (inquiryKey) {
      try {
        const isRegistered = await checkUserRegistered(inquiryKey);
        setIsAccountRegisteredByInquiry((prev) => ({ ...prev, [inquiryKey]: isRegistered }));
      } catch (error) {
        console.error('Failed to check if user is registered', error);
      }
    }
  };

  const getInquiryKey = (inquiry: any) =>
    String(inquiry?.id || inquiry?._id || inquiry?.email || '').trim();

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
      queryClient.setQueryData(['inquiries'], (old: any[] | undefined) =>
        (old || []).map((inq) => ((inq.id || inq._id) === id ? { ...inq, status: newStatus } : inq))
      );
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
      queryClient.setQueryData(['inquiries'], (old: any[] | undefined) =>
        (old || []).map((inq) =>
          (inq.id || inq._id) === id ? { ...inq, status: newStatus, meetingDetails } : inq
        )
      );

      setIsScheduleModalOpen(false);
      // Reset form properly
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

      queryClient.setQueryData(['inquiries'], (old: any[] | undefined) =>
        (old || []).map((inq) =>
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

  const generateRandomPassword = (length = 12) => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues, (value) => charset[value % charset.length]).join('');
  };

  const handleCreateUserAccount = async () => {
    if (!selectedInquiry) return;

    const inquiryKey = getInquiryKey(selectedInquiry);
    if (inquiryKey && createdAccounts[inquiryKey]) {
      setAccountCreateError('');
      setAccountCreateSuccess('An account for this inquiry was already created in this session.');
      return;
    }

    const email = String(selectedInquiry.email || '').trim();
    if (!email) {
      setAccountCreateError('Inquiry has no email address to use for account creation.');
      setAccountCreateSuccess('');
      return;
    }

    const generatedPassword = generateRandomPassword();

    try {
      setIsCreatingAccount(true);
      setAccountCreateError('');
      setAccountCreateSuccess('');

      await createUser({
        firstName: selectedInquiry.firstName || 'Client',
        lastName: selectedInquiry.lastName || 'User',
        email,
        password: generatedPassword,
        contactNumber: selectedInquiry.contactNumber || '',
        role: 'CLIENT',
        inquiryId: inquiryKey,
      });

      if (inquiryKey) {
        setIsAccountRegisteredByInquiry((prev) => ({ ...prev, [inquiryKey]: true }));
        setCreatedAccounts((prev) => ({
          ...prev,
          [inquiryKey]: {
            password: generatedPassword,
            createdAt: new Date().toISOString(),
          },
        }));
        setShowPasswordByInquiry((prev) => ({ ...prev, [inquiryKey]: false }));
      }

      setAccountCreateSuccess('Account created successfully.');
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Unable to create account right now. Please try again.';
      setAccountCreateError(String(serverMessage));
      setAccountCreateSuccess('');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleCopyPassword = async (inquiryKey: string, password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedInquiryId(inquiryKey);
      setTimeout(() => {
        setCopiedInquiryId((current) => (current === inquiryKey ? '' : current));
      }, 1500);
    } catch {
      setAccountCreateError('Unable to copy password. Please copy it manually.');
    }
  };

  const selectedInquiryKey = selectedInquiry ? getInquiryKey(selectedInquiry) : '';
  const createdAccount = selectedInquiryKey ? createdAccounts[selectedInquiryKey] : null;
  const isPasswordVisible = selectedInquiryKey
    ? Boolean(showPasswordByInquiry[selectedInquiryKey])
    : false;
  const isCopied = selectedInquiryKey ? copiedInquiryId === selectedInquiryKey : false;
  const isAlreadyRegistered = selectedInquiryKey ? isAccountRegisteredByInquiry[selectedInquiryKey] : false;

  return (
    <div className="space-y-6 p-4 ">
      <section className="relative overflow-hidden rounded-2xl border border-[#efe6f6] bg-linear-to-r from-[#fff8fc] via-[#fef9ff] to-[#f4f7ff] p-5 md:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#f347a5]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 left-20 h-40 w-40 rounded-full bg-[#8f1fd1]/10 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-3 text-2xl font-black text-[#2e2837] md:text-3xl">
              Client Inquiries
            </h1>
            <p className="mt-1 max-w-2xl text-lg font-semibold text-[#8f879f] md:text-[15px]">
              Review incoming requests, schedule discovery meetings, and move clients through your
              booking pipeline.
            </p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">Total</p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.total}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <Clock3 className="h-3.5 w-3.5" /> Pending
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.pending}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <CalendarIcon className="h-3.5 w-3.5" /> Scheduled
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.scheduled}</p>
          </div>
          <div className="rounded-xl border border-[#f1e8f7] bg-white/80 p-3">
            <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#8a7ca3]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
            </p>
            <p className="mt-1 text-2xl font-black text-[#2e2837]">{statusCounts.approved}</p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-[#eee7f4] bg-white shadow-[0_8px_30px_rgba(53,36,71,0.06)]">
        <div className="flex flex-col gap-3 border-b border-[#f1eaf7] bg-[#fcf9ff] p-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-sm">
            <Label
              htmlFor="inquiry-search"
              className="mb-1 block text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]"
            >
              Search
            </Label>
            <Input
              id="inquiry-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, event type, status"
              className="h-9 border-[#e5ddee] bg-white"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <Label className="mb-1 block text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={(value: 'date' | 'status') => setSortBy(value)}>
                <SelectTrigger className="h-9 w-full min-w-[150px] border-[#e5ddee] bg-white sm:w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1 block text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                Order
              </Label>
              <Select
                value={sortOrder}
                onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
              >
                <SelectTrigger className="h-9 w-full min-w-[150px] border-[#e5ddee] bg-white sm:w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <p className="text-lg font-semibold text-[#80788f]">Loading inquiries...</p>
          </div>
        ) : filteredAndSortedInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
            <MessageSquareText className="h-10 w-10 text-[#d5c9e4]" />
            <p className="text-base font-bold text-[#5a5368]">No inquiries found.</p>
            <p className="text-lg font-medium text-[#91889f]">
              {inquiries.length > 0
                ? 'Try adjusting your search or sort settings.'
                : 'New client requests will appear here once submitted.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#faf7fd]">
              <TableRow className="border-b border-[#efe7f6]">
                <TableHead className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390]">
                  Sender
                </TableHead>
                <TableHead className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390]">
                  Email
                </TableHead>
                <TableHead className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390]">
                  Event Type
                </TableHead>
                <TableHead className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390]">
                  Date
                </TableHead>
                <TableHead className="h-12 text-lg font-black uppercase tracking-[0.06em] text-[#7c7390]">
                  Status
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedInquiries.map((inquiry: any) => (
                <TableRow
                  key={inquiry.id || inquiry._id}
                  className="border-b border-[#f3edf8] hover:bg-[#fcf9ff]"
                >
                  <TableCell className="py-3.5 font-semibold text-lg text-[#2e2837]">
                    {inquiry.firstName} {inquiry.lastName}
                  </TableCell>
                  <TableCell className="text-lg text-[#635a73]">{inquiry.email}</TableCell>
                  <TableCell className="font-semibold text-lg text-[#4e4560]">
                    {inquiry.eventType || inquiry.subject || 'Inquiry'}
                  </TableCell>
                  <TableCell className="font-semibold text-lg text-[#4e4560]">
                    {new Date(inquiry.date || inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(inquiry.status)}>
                      {inquiry.status || 'New'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-[#e7dff0] bg-white font-bold text-[#5f5472] hover:bg-[#f8f2fd] hover:text-[#4d4360]"
                      onClick={() => handleViewDetails(inquiry)}
                    >
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
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2e2837]">Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="pt-4 md:flex md:gap-4">
              <div className="space-y-4 md:w-1/2">
                <div className="rounded-xl border border-[#efe8f6] bg-[#fcfaff] p-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                    Sender
                  </h4>
                  <p className="text-[#2e2837] font-medium">
                    {selectedInquiry.firstName} {selectedInquiry.lastName}
                  </p>
                  <p className="text-lg text-[#7a708d]">{selectedInquiry.email}</p>
                  {selectedInquiry.contactNumber && (
                    <p className="text-lg text-[#7a708d]">{selectedInquiry.contactNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#efe8f6] bg-white p-3">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                      Event Format
                    </h4>
                    <p className="text-[#2e2837] font-medium">
                      {selectedInquiry.eventType || selectedInquiry.subject || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#efe8f6] bg-white p-3">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                      Planned Date
                    </h4>
                    <p className="text-[#2e2837] font-medium">
                      {new Date(
                        selectedInquiry.date || selectedInquiry.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedInquiry.eventPackage && (
                    <div className="rounded-xl border border-[#efe8f6] bg-white p-3">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                        Package
                      </h4>
                      <p className="text-[#2e2837] font-medium">{selectedInquiry.eventPackage}</p>
                    </div>
                  )}
                  {selectedInquiry.eventPax && (
                    <div className="rounded-xl border border-[#efe8f6] bg-white p-3">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                        Expected Pax
                      </h4>
                      <p className="text-[#2e2837] font-medium">{selectedInquiry.eventPax}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-full">
                    <h4 className="mb-1 text-lg font-black uppercase tracking-[0.08em] text-[#857a98]">
                      Status
                    </h4>
                    <Select
                      value={selectedInquiry.status || 'New'}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-full border-[#e5ddee] bg-white">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending Review">Pending Review</SelectItem>
                        <SelectItem value="Requires Clarification">
                          Requires Clarification
                        </SelectItem>
                        <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                        {[
                          'New',
                          'In Progress',
                          'Resolved',
                          'pending',
                          'approved',
                          'declined',
                        ].includes(selectedInquiry.status) && (
                          <SelectItem value={selectedInquiry.status} disabled className="hidden">
                            {selectedInquiry.status}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#857a98]">
                    Message
                  </h4>
                  <div className="mt-1 min-h-[100px] whitespace-pre-wrap rounded-xl border border-[#ece4f5] bg-[#faf7ff] p-4 text-[#2e2837]">
                    {selectedInquiry.message || 'No additional message provided.'}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#efe8f6] pt-4 md:mt-0 md:w-1/2 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                {selectedInquiry.meetingDetails ? (
                  <div className="w-full space-y-3">
                    <div className="rounded-lg border border-[#eadcf7] bg-[#fbf6ff] p-3">
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6f2ea8]">
                        Meeting Details
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#5f4f7a]">
                        {selectedInquiry.meetingDetails.date
                          ? new Date(selectedInquiry.meetingDetails.date).toLocaleDateString()
                          : 'TBD'}{' '}
                        at {selectedInquiry.meetingDetails.time || 'TBD'}
                      </p>
                      <p className="mt-1 text-xs text-[#6a5a83]">
                        Location: {selectedInquiry.meetingDetails.location || 'TBD'}
                      </p>
                      <p className="mt-1 text-xs text-[#6a5a83]">
                        Organizer:{' '}
                        {getOrganizerLabel(selectedInquiry.meetingDetails.organizerId || '')}
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
                        disabled={
                          isUpdatingMeetingOrganizer ||
                          organizersLoading ||
                          !selectedMeetingOrganizerId
                        }
                        className="bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
                      >
                        {isUpdatingMeetingOrganizer ? 'Updating...' : 'Update Organizer'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-dashed border-[#eadcf7] bg-[#fbf6ff] p-3 text-lg font-medium text-[#6a5a83]">
                      No meeting has been scheduled yet.
                    </div>
                    <Button
                      className="w-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
                      onClick={() => {
                        setDraftEntry((prev) => ({
                          ...prev,
                          title: `Meeting with ${selectedInquiry?.firstName} ${selectedInquiry?.lastName}`,
                          startDateKey: selectedInquiry?.date
                            ? new Date(selectedInquiry.date).toISOString().split('T')[0]
                            : prev.startDateKey,
                          endDateKey: selectedInquiry?.date
                            ? new Date(selectedInquiry.date).toISOString().split('T')[0]
                            : prev.endDateKey,
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

                <div className="mt-4 rounded-lg border border-[#eadcf7] bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6f2ea8]">
                    Client Account
                  </p>
                  <p className="mt-1 text-xs text-[#6a5a83]">
                    Create a login account for this inquiry using the submitted email.
                  </p>
                  <Button
                    type="button"
                    onClick={handleCreateUserAccount}
                    disabled={
                      isCreatingAccount || !selectedInquiry?.email || Boolean(createdAccount) || isAlreadyRegistered
                    }
                    className="mt-3 w-full bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white hover:brightness-105"
                  >
                    {isCreatingAccount
                      ? 'Creating Account...'
                      : createdAccount || isAlreadyRegistered
                        ? 'Account Created'
                        : 'Create User Account'}
                  </Button>

                  {createdAccount ? (
                    <div className="mt-3 space-y-2 rounded-md border border-[#e5dbef] bg-[#faf7ff] p-2.5">
                      <p className="text-xs font-semibold text-[#5b4f71]">Temporary Password</p>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={
                            isPasswordVisible
                              ? createdAccount.password
                              : '•'.repeat(Math.max(createdAccount.password.length, 8))
                          }
                          className="h-9 border-[#ddd8e8] bg-white text-xs font-semibold text-[#4c455e]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setShowPasswordByInquiry((prev) => ({
                              ...prev,
                              [selectedInquiryKey]: !isPasswordVisible,
                            }))
                          }
                          className="h-9 border-[#ddd8e8] px-2"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleCopyPassword(selectedInquiryKey, createdAccount.password)
                          }
                          className="h-9 border-[#ddd8e8] px-2"
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {accountCreateError ? (
                    <p className="mt-2 text-xs font-semibold text-[#c33274]" role="alert">
                      {accountCreateError}
                    </p>
                  ) : null}

                  {accountCreateSuccess ? (
                    <p className="mt-2 text-xs font-semibold text-emerald-700" role="status">
                      {accountCreateSuccess}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Sub-Modal */}
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
    </div>
  );
}
