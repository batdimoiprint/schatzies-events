import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Check, Copy, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createEvent } from '@/api/events';
import { updateCalendarEntry } from '@/api/calendar';
import { checkUserRegistered, updateInquiryStatus } from '@/api/inquiries';
import { createUser } from '@/api/users';

interface InquiryMeetingDetails {
  entryId?: string;
  organizerId?: string;
  title?: string;
  date?: string;
  time?: string;
  startTime?: string;
  startDateKey?: string;
  endDateKey?: string;
  endTime?: string;
  location?: string;
  description?: string;
  eventType?: string;
  label?: string;
  inquiryUserId?: string;
}

interface InquiryRecord {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  status?: string;
  eventType?: string;
  subject?: string;
  title?: string;
  date?: string;
  createdAt?: string;
  created_at?: string;
  eventPackage?: string;
  eventPackageKey?: string;
  eventPax?: number;
  message?: string;
  userId?: string;
  user_id?: string;
  is_Account_Created?: boolean;
  venue?: string;
  location?: string;
  meetingDetails?: InquiryMeetingDetails;
}

interface OrganizerRecord {
  user_id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
}

interface InquiryDetailsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedInquiry: InquiryRecord | null;
  getOrganizerLabel: (id: string) => string;
  organizers: OrganizerRecord[];
  organizersLoading: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  onInquiryUpdated: (updatedInquiry: InquiryRecord) => void;
}

type InquiryStatusOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function normalizeInquiryStatus(status?: string) {
  const normalized = String(status || '')
    .trim()
    .toLowerCase();

  if (!normalized || normalized === 'new' || normalized === 'pending') {
    return 'Pending Review';
  }

  if (normalized === 'resolved') {
    return 'Approved';
  }

  if (normalized === 'in progress') {
    return 'Requires Clarification';
  }

  return String(status || '').trim();
}

function getInquiryStatusOptions(currentStatus?: string): InquiryStatusOption[] {
  const normalized = String(currentStatus || '')
    .trim()
    .toLowerCase();
  const displayStatus = normalizeInquiryStatus(currentStatus);

  if (normalized === 'pending review' || normalized === 'new' || normalized === 'pending') {
    return [
      { value: displayStatus, label: displayStatus, disabled: true },
      { value: 'Requires Clarification', label: 'Requires Clarification' },
      { value: 'Approved', label: 'Approved', disabled: true },
      { value: 'Declined', label: 'Declined', disabled: true },
    ];
  }

  const options: InquiryStatusOption[] = [
    { value: 'Requires Clarification', label: 'Requires Clarification' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Declined', label: 'Declined' },
  ];

  if (displayStatus && !options.some((option) => option.value === displayStatus)) {
    options.unshift({ value: displayStatus, label: displayStatus, disabled: true });
  } else {
    const currentIndex = options.findIndex((option) => option.value === displayStatus);
    if (currentIndex >= 0) {
      options[currentIndex] = { ...options[currentIndex], disabled: true };
    }
  }

  return options;
}

function buildEventDateTime(dateValue?: string, timeValue?: string) {
  const normalizedDate = String(dateValue || '').trim();
  if (!normalizedDate) {
    return '';
  }

  if (normalizedDate.includes('T')) {
    const parsedDate = new Date(normalizedDate);
    return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString();
  }

  const normalizedTime =
    String(timeValue || '')
      .trim()
      .slice(0, 5) || '00:00';
  const parsedDate = new Date(`${normalizedDate}T${normalizedTime}:00.000Z`);
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString();
}

export function InquiryDetailsDialog({
  isDialogOpen,
  setIsDialogOpen,
  selectedInquiry,
  getOrganizerLabel,
  organizers,
  setIsScheduleModalOpen,
  onInquiryUpdated,
}: InquiryDetailsDialogProps) {
  const [selectedMeetingOrganizerId, setSelectedMeetingOrganizerId] = useState('');
  const [isUpdatingMeetingOrganizer, setIsUpdatingMeetingOrganizer] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreateError, setAccountCreateError] = useState('');
  const [accountCreateSuccess, setAccountCreateSuccess] = useState('');
  const [isAccountRegisteredByInquiry, setIsAccountRegisteredByInquiry] = useState<
    Record<string, boolean>
  >({});
  const [createdAccounts, setCreatedAccounts] = useState<
    Record<string, { password: string; createdAt: string }>
  >({});
  const [showPasswordByInquiry, setShowPasswordByInquiry] = useState<Record<string, boolean>>({});
  const [copiedInquiryId, setCopiedInquiryId] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState('');
  const [isOrgConfirmOpen, setIsOrgConfirmOpen] = useState(false);
  const [pendingOrganizerId, setPendingOrganizerId] = useState('');

  const getInquiryKey = (inquiry?: InquiryRecord | null) =>
    String(inquiry?.id || inquiry?._id || inquiry?.email || '').trim();

  const selectedInquiryKey = selectedInquiry ? getInquiryKey(selectedInquiry) : '';
  const createdAccount = selectedInquiryKey ? createdAccounts[selectedInquiryKey] : null;
  const isPasswordVisible = selectedInquiryKey
    ? Boolean(showPasswordByInquiry[selectedInquiryKey])
    : false;
  const isCopied = selectedInquiryKey ? copiedInquiryId === selectedInquiryKey : false;
  const isAlreadyRegistered = selectedInquiryKey
    ? isAccountRegisteredByInquiry[selectedInquiryKey]
    : false;

  useEffect(() => {
    if (!selectedInquiry) return;

    setSelectedMeetingOrganizerId(selectedInquiry?.meetingDetails?.organizerId || '');
    setAccountCreateError('');
    setAccountCreateSuccess('');
    setCopiedInquiryId('');

    const inquiryKey = getInquiryKey(selectedInquiry);
    if (!inquiryKey) return;

    const checkRegistered = async () => {
      try {
        const isRegistered = await checkUserRegistered(inquiryKey);
        setIsAccountRegisteredByInquiry((prev) => ({ ...prev, [inquiryKey]: isRegistered }));
      } catch (error) {
        console.error('Failed to check if user is registered', error);
      }
    };

    checkRegistered();
  }, [selectedInquiry]);

  const handleStatusChange = (newStatus: string) => {
    if (!selectedInquiry || newStatus === normalizeInquiryStatus(selectedInquiry.status)) return;
    setStatusChangeError('');
    setPendingStatus(newStatus);
    setIsConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedInquiry || !pendingStatus) return;
    const id = String(selectedInquiry.id || selectedInquiry._id || '').trim();
    if (!id) {
      setStatusChangeError('Inquiry ID is required to update the status.');
      return;
    }
    const previousStatus = normalizeInquiryStatus(selectedInquiry.status) || 'New';

    const clientId = String(selectedInquiry.userId || selectedInquiry.user_id || '').trim();
    const organizerId = String(
      selectedInquiry?.meetingDetails?.organizerId || selectedMeetingOrganizerId || ''
    ).trim();
    const eventDateSource = String(
      selectedInquiry?.meetingDetails?.date || selectedInquiry.date || ''
    ).trim();
    const eventTimeSource = String(
      selectedInquiry?.meetingDetails?.time || selectedInquiry?.meetingDetails?.startTime || ''
    ).trim();
    const eventLocation = String(
      selectedInquiry?.meetingDetails?.location ||
        selectedInquiry.location ||
        selectedInquiry.venue ||
        ''
    ).trim();
    const eventTitle = String(
      selectedInquiry?.title ||
        selectedInquiry?.subject ||
        selectedInquiry?.meetingDetails?.title ||
        `${selectedInquiry.firstName || 'Client'} ${selectedInquiry.lastName || 'Inquiry'} Event`
    ).trim();

    const canCreateApprovedEvent = pendingStatus === 'Approved';

    if (canCreateApprovedEvent) {
      if (!clientId) {
        setStatusChangeError('Create the client account before approving this inquiry.');
        return;
      }

      if (!organizerId) {
        setStatusChangeError('Assign an organizer before approving this inquiry.');
        return;
      }

      if (!eventDateSource) {
        setStatusChangeError('Inquiry date is required before creating the event.');
        return;
      }
    }

    try {
      setIsUpdatingStatus(true);
      setStatusChangeError('');
      await updateInquiryStatus(id, pendingStatus);

      if (canCreateApprovedEvent) {
        const eventDate = buildEventDateTime(eventDateSource, eventTimeSource);

        if (!eventDate) {
          throw new Error('Unable to build a valid event date for approval.');
        }

        try {
          await createEvent({
            title: eventTitle,
            startDate: eventDate,
            client_id: clientId,
            organizer_id: organizerId,
            eventType: String(selectedInquiry.eventType || '').trim() || 'General',
            eventPackageKey: String(
              selectedInquiry.eventPackageKey || selectedInquiry.eventPackage || ''
            ).trim(),
            eventPackage: String(selectedInquiry.eventPackage || '').trim(),
            eventPax:
              selectedInquiry.eventPax !== undefined && selectedInquiry.eventPax !== null
                ? Number(selectedInquiry.eventPax)
                : undefined,
            eventDate,
            eventTime: eventTimeSource || '00:00',
            eventLocation,
            venue: eventLocation,
            status: 'Planning',
          });
        } catch (createError) {
          try {
            await updateInquiryStatus(id, previousStatus);
          } catch (rollbackError) {
            console.error('Failed to roll back approved inquiry status', rollbackError);
          }

          throw createError;
        }
      }

      onInquiryUpdated({
        ...selectedInquiry,
        status: pendingStatus,
        userId: selectedInquiry.userId || selectedInquiry.user_id || '',
      });
      setIsConfirmOpen(false);
      setPendingStatus('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      setStatusChangeError(message);
      console.error('Failed to update status', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOrganizerChange = (newOrgId: string) => {
    if (!selectedInquiry?.meetingDetails || newOrgId === selectedInquiry.meetingDetails.organizerId)
      return;
    setPendingOrganizerId(newOrgId);
    setIsOrgConfirmOpen(true);
  };

  const confirmOrganizerChange = async () => {
    if (!selectedInquiry?.meetingDetails || !pendingOrganizerId) return;
    try {
      setIsUpdatingMeetingOrganizer(true);
      const existingMeeting = selectedInquiry.meetingDetails;
      const entryId = String(existingMeeting.entryId || '').trim();
      if (!entryId) {
        throw new Error('Meeting entry ID is required to update the organizer.');
      }

      const startDateKey = String(
        existingMeeting.startDateKey || existingMeeting.date || selectedInquiry.date || ''
      ).trim();
      const endDateKey = String(
        existingMeeting.endDateKey || existingMeeting.date || selectedInquiry.date || ''
      ).trim();

      await updateCalendarEntry(entryId, {
        title:
          existingMeeting.title ||
          `Meeting with ${selectedInquiry.firstName || ''} ${selectedInquiry.lastName || ''}`.trim(),
        startDateKey,
        startTime: existingMeeting.startTime || existingMeeting.time || '09:00',
        endDateKey,
        endTime: existingMeeting.endTime || '10:00',
        label: existingMeeting.label || 'Meeting',
        organizerId: pendingOrganizerId,
        location: existingMeeting.location || '',
        description: existingMeeting.description || '',
        eventType: existingMeeting.eventType || 'Client',
        eventId: selectedInquiry.id || selectedInquiry._id,
        inquiryUserId:
          selectedInquiry.userId ||
          selectedInquiry.user_id ||
          existingMeeting.inquiryUserId ||
          undefined,
      });
      onInquiryUpdated({
        ...selectedInquiry,
        status: 'Meeting Scheduled',
        meetingDetails: {
          ...existingMeeting,
          organizerId: pendingOrganizerId,
        },
      });
      setIsOrgConfirmOpen(false);
      setPendingOrganizerId('');
      setSelectedMeetingOrganizerId(pendingOrganizerId);
    } catch (error) {
      console.error('Failed to update meeting organizer', error);
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

      const createdUser = await createUser({
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

      onInquiryUpdated({
        ...selectedInquiry,
        is_Account_Created: true,
        userId: createdUser.user_id,
      });

      setAccountCreateSuccess('Account created successfully.');
    } catch (error: unknown) {
      const serverMessage =
        typeof error === 'object' && error !== null && 'response' in error
          ? (
              error as {
                response?: { data?: { error?: string; message?: string } };
              }
            )?.response?.data?.error ||
            (
              error as {
                response?: { data?: { error?: string; message?: string } };
              }
            )?.response?.data?.message ||
            'Unable to create account right now. Please try again.'
          : error instanceof Error && error.message
            ? error.message
            : 'Unable to create account right now. Please try again.';
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-6xl">
        <div className="bg-linear-to-r from-[#fdfbff] to-[#f5f7ff] p-6 border-b border-[#eee7f4]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black text-[#2e2837]">
                Inquiry Details
              </DialogTitle>
              <p className="text-sm font-semibold text-[#8f879f] mt-0.5">
                Submitted on{' '}
                {new Date(
                  selectedInquiry?.createdAt || selectedInquiry?.created_at || Date.now()
                ).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>

        {selectedInquiry && (
          <div className="p-6 md:flex md:gap-8 max-h-[80vh] overflow-y-auto">
            {/* Left Column - Core Info */}
            <div className="space-y-6 md:w-3/5">
              <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] flex items-center gap-2">
                  <span className="h-px w-4 bg-[#d5c9e4]"></span>
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#efe8f6] bg-[#fcfaff] p-4 transition-all hover:border-[#e2d5f0]">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#857a98] mb-1">
                      Full Name
                    </h4>
                    <p className="text-[#2e2837] font-bold text-lg">
                      {selectedInquiry.firstName} {selectedInquiry.lastName}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#efe8f6] bg-[#fcfaff] p-4 transition-all hover:border-[#e2d5f0]">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#857a98] mb-1">
                      Contact Details
                    </h4>
                    <p className="text-sm font-bold text-[#5a5368]">{selectedInquiry.email}</p>
                    {selectedInquiry.contactNumber && (
                      <p className="text-sm font-medium text-[#7a708d] mt-0.5">
                        {selectedInquiry.contactNumber}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] flex items-center gap-2">
                  <span className="h-px w-4 bg-[#d5c9e4]"></span>
                  Event Requirements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-4 py-3 rounded-xl bg-[#f7ebff]/50 border-2 border-[#eadcf7] backdrop-blur-sm shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#857a98] mb-0.5">
                      Current Status
                    </p>
                    <p className="text-sm font-bold text-[#6f2ea8]">
                      {selectedInquiry?.status || 'New'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#f1eaf7] bg-white p-3 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#a094b8] mb-1">
                      Event Format
                    </h4>
                    <p className="text-[#4e4560] font-bold text-sm">
                      {selectedInquiry.eventType || selectedInquiry.subject || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#f1eaf7] bg-white p-3 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#a094b8] mb-1">
                      Planned Date
                    </h4>
                    <p className="text-[#4e4560] font-bold text-sm">
                      {new Date(
                        selectedInquiry.date || selectedInquiry.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#f1eaf7] bg-white p-3 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#a094b8] mb-1">
                      Submitted Date
                    </h4>
                    <p className="text-[#4e4560] font-bold text-sm">
                      {new Date(
                        selectedInquiry.createdAt || selectedInquiry.created_at || Date.now()
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {selectedInquiry.eventPackage && (
                    <div className="rounded-xl border border-[#f1eaf7] bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[#a094b8] mb-1">
                        Package Choice
                      </h4>
                      <p className="text-[#4e4560] font-bold text-sm">
                        {selectedInquiry.eventPackage}
                      </p>
                    </div>
                  )}
                  {selectedInquiry.eventPax && (
                    <div className="rounded-xl border border-[#f1eaf7] bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[#a094b8] mb-1">
                        Guest Count
                      </h4>
                      <p className="text-[#4e4560] font-bold text-sm">
                        {selectedInquiry.eventPax} Pax
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] flex items-center gap-2">
                  <span className="h-px w-4 bg-[#d5c9e4]"></span>
                  Client Message
                </h3>
                <div className="min-h-30 whitespace-pre-wrap rounded-2xl border border-[#ece4f5] bg-[#faf7ff] p-5 text-sm text-[#4e4560] leading-relaxed italic shadow-inner">
                  "{selectedInquiry.message || 'No additional message provided.'}"
                </div>
              </section>
            </div>

            {/* Right Column - Actions & Status */}
            <div className="mt-8 border-t border-[#efe8f6] pt-8 md:mt-0 md:w-2/5 md:border-l md:border-t-0 md:pl-8 md:pt-0 space-y-6">
              <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] mb-2">
                  Inquiry Status
                </h4>
                <div className="p-4 rounded-2xl border border-[#eadcf7] bg-white shadow-sm">
                  <Label className="text-[10px] font-black uppercase text-[#857a98] mb-2 block">
                    Change State
                  </Label>
                  <Select
                    value={normalizeInquiryStatus(selectedInquiry.status)}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full h-11 border-[#e5ddee] bg-white rounded-xl font-bold text-[#4e4560]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#e5ddee]">
                      {getInquiryStatusOptions(selectedInquiry.status).map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {statusChangeError && (
                    <p className="mt-2 text-[11px] font-semibold text-red-600">
                      {statusChangeError}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] mb-2">
                  Meetings
                </h4>
                {selectedInquiry.meetingDetails ? (
                  <div className="w-full space-y-4">
                    <div className="rounded-2xl border border-[#eadcf7] bg-linear-to-br from-[#fbf6ff] to-[#f5f0ff] p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-[#eadcf7] text-[#8f1fd1] shadow-xs">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#5f4f7a]">
                            {new Date(
                              selectedInquiry.meetingDetails.date || Date.now()
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs font-bold text-[#8f1fd1]">
                            at {selectedInquiry.meetingDetails.time || 'TBD'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 text-[11px] font-semibold">
                        <p className="flex justify-between border-b border-[#eee7f4] pb-1.5">
                          <span className="text-[#a094b8]">Location</span>
                          <span className="text-[#5f4f7a]">
                            {selectedInquiry.meetingDetails.location || 'TBA'}
                          </span>
                        </p>
                        <div className="space-y-2">
                          <p className="flex justify-between">
                            <span className="text-[#a094b8]">Current Expert</span>
                            <span className="text-[#5f4f7a] text-right">
                              {getOrganizerLabel(selectedInquiry.meetingDetails.organizerId || '')}
                            </span>
                          </p>
                          <div className="pt-1">
                            <Label className="text-[9px] font-black uppercase text-[#857a98] mb-1.5 block">
                              Reassign Expert
                            </Label>
                            <Select
                              value={selectedMeetingOrganizerId}
                              onValueChange={handleOrganizerChange}
                              disabled={isUpdatingMeetingOrganizer}
                            >
                              <SelectTrigger className="h-9 w-full rounded-xl border-[#eadcf7] bg-white/80 px-3 text-[11px] font-bold text-[#4c455e] transition-all">
                                <SelectValue placeholder="Change organizer..." />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-[#e5ddee]">
                                {organizers.map((organizer) => (
                                  <SelectItem key={organizer.user_id} value={organizer.user_id}>
                                    {[organizer.firstName, organizer.lastName]
                                      .filter(Boolean)
                                      .join(' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-dashed border-[#eadcf7] bg-[#fbf6ff] p-6 text-center">
                      <CalendarIcon className="h-8 w-8 text-[#d5c9e4] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#6a5a83]">No meeting scheduled</p>
                      <p className="text-[11px] text-[#9a8fb0] mt-1">
                        Schedule a discovery call to proceed
                      </p>
                    </div>
                    <Button
                      className="w-full h-12 bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => setIsScheduleModalOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#b0a4c5] mb-2">
                  Portal Access
                </h4>
                <div className="rounded-2xl border border-[#eadcf7] bg-white p-4 shadow-sm overflow-hidden relative">
                  {!selectedInquiry.meetingDetails && !isAlreadyRegistered && !createdAccount && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-6 text-center">
                      <p className="text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 shadow-sm">
                        Schedule a meeting first to enable account creation.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-[#f7ebff] flex items-center justify-center text-[#8f1fd1]">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#5f4f7a]">Client Account</p>
                      <p className="text-[10px] font-semibold text-[#8f879f]">
                        Enable portal access for this client
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCreateUserAccount}
                    disabled={
                      isCreatingAccount ||
                      !selectedInquiry?.email ||
                      Boolean(createdAccount) ||
                      isAlreadyRegistered ||
                      !selectedInquiry.meetingDetails
                    }
                    className="w-full h-11 bg-linear-to-r from-[#2e2837] to-[#5a5368] text-white font-black rounded-xl"
                  >
                    {isCreatingAccount
                      ? 'Processing...'
                      : createdAccount || isAlreadyRegistered
                        ? 'Account Ready'
                        : 'Create User Account'}
                  </Button>

                  {createdAccount && (
                    <div className="mt-4 space-y-2 rounded-xl border border-[#e5dbef] bg-[#faf7ff] p-3 animate-in fade-in slide-in-from-top-2">
                      <p className="text-[10px] font-black uppercase text-[#6f2ea8]">
                        Temporary Access Key
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            readOnly
                            value={isPasswordVisible ? createdAccount.password : '••••••••••••'}
                            className="h-10 border-[#ddd8e8] bg-white text-xs font-bold text-[#4c455e] rounded-lg pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordByInquiry((prev) => ({
                                ...prev,
                                [selectedInquiryKey]: !isPasswordVisible,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f879f] hover:text-[#8f1fd1]"
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleCopyPassword(selectedInquiryKey, createdAccount.password)
                          }
                          className="h-10 w-10 p-0 border-[#ddd8e8] rounded-lg bg-white"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {accountCreateError && (
                    <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-[10px] font-bold text-red-600">{accountCreateError}</p>
                    </div>
                  )}
                  {accountCreateSuccess && (
                    <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-700">
                        {accountCreateSuccess}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none rounded-2xl">
          <div className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-[#2e2837] mb-2">Update Status?</h3>
            <p className="text-sm font-medium text-[#7a708d] mb-6">
              Are you sure you want to change the status of this inquiry from{' '}
              <span className="font-bold text-[#6f2ea8]">{selectedInquiry?.status || 'New'}</span>{' '}
              to <span className="font-bold text-[#8f1fd1]">{pendingStatus}</span>?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 h-11 border-[#e7dff0] text-[#5a5368] font-bold rounded-xl"
              >
                No, Keep it
              </Button>
              <Button
                onClick={confirmStatusChange}
                disabled={isUpdatingStatus}
                className="flex-1 h-11 bg-linear-to-r from-[#f347a5] to-[#8f1fd1] text-white font-black rounded-xl shadow-md"
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Yes, Update'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Organizer Change Confirmation Dialog */}
      <Dialog open={isOrgConfirmOpen} onOpenChange={setIsOrgConfirmOpen}>
        <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none rounded-2xl">
          <div className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#f347a5]/10 to-[#8f1fd1]/10 text-[#8f1fd1] flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-[#2e2837] mb-2">Change Organizer?</h3>
            <p className="text-sm font-medium text-[#7a708d] mb-6">
              Are you sure you want to reassign this inquiry from{' '}
              <span className="font-bold text-[#6f2ea8]">
                {getOrganizerLabel(selectedInquiry?.meetingDetails?.organizerId || '')}
              </span>{' '}
              to{' '}
              <span className="font-bold text-[#8f1fd1]">
                {getOrganizerLabel(pendingOrganizerId)}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOrgConfirmOpen(false)}
                className="flex-1 h-11 border-[#e7dff0] text-[#5a5368] font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmOrganizerChange}
                disabled={isUpdatingMeetingOrganizer}
                className="flex-1 h-11 bg-linear-to-r from-[#2e2837] to-[#5a5368] text-white font-black rounded-xl shadow-md"
              >
                {isUpdatingMeetingOrganizer ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
