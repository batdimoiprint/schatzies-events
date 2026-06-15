import { useEffect, useState, Fragment } from 'react';
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
import { getVendors } from '@/api/vendors';
import { updateCalendarEntry } from '@/api/calendar';
import { calculatePackagePrice } from '@/utils/package-pricing';
import {
  checkUserRegistered,
  updateInquiryStatus,
  updateInquiry,
  getInquiryStatusOptions,
  INQUIRY_STATUS_OPTIONS,
  deleteInquiry,
} from '@/api/inquiries';
import { createUser } from '@/api/users';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient, useMutation } from '@tanstack/react-query';

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

export interface InquiryRecord {
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
  package?: { name?: string; pax?: string | number };
  packageInitialAmount?: number;
  downpaymentAmount?: number;
  currency?: string;
  message?: string;
  userId?: string;
  user_id?: string;
  is_Account_Created?: boolean;
  venue?: string;
  location?: string;
  meetingDetails?: InquiryMeetingDetails;
}

export interface OrganizerRecord {
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

function normalizeInquiryStatus(status?: string) {
  const normalized = String(status || '')
    .trim()
    .toLowerCase();

  if (!normalized || normalized === 'new' || normalized === 'pending') {
    return INQUIRY_STATUS_OPTIONS.PENDING_REVIEW;
  }

  if (normalized === 'meeting scheduled') {
    return INQUIRY_STATUS_OPTIONS.MEETING_SCHEDULED;
  }

  if (normalized === 'resolved') {
    return INQUIRY_STATUS_OPTIONS.APPROVED;
  }

  if (normalized === 'in progress') {
    return INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION;
  }

  return String(status || '').trim();
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [downpaymentInput, setDownpaymentInput] = useState('');
  const [isSavingDownpayment, setIsSavingDownpayment] = useState(false);
  const [customPackageAmountInput, setCustomPackageAmountInput] = useState('');
  const [isSavingCustomPackageAmount, setIsSavingCustomPackageAmount] = useState(false);
  const [venueInput, setVenueInput] = useState('');
  const [isSavingVenue, setIsSavingVenue] = useState(false);
  const [venueVendors, setVenueVendors] = useState<{ name: string; price: number | null }[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);

  const formatMoney = (val?: number) => {
    if (val === undefined || isNaN(val)) return '—';
    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    });
    return `Php ${formatter.format(val)}`;
  };

  const deleteInquiryMutation = useMutation({
    mutationFn: (id: string) => deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      setIsDialogOpen(false);
      setIsDeleteConfirmOpen(false);
    },
  });

  const saveDownpaymentMutation = useMutation({
    mutationFn: async ({ id, downpayment }: { id: string; downpayment: number }) => {
      return await updateInquiry(id, { downpaymentAmount: downpayment });
    },
    onSuccess: (updatedInquiry) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onInquiryUpdated(updatedInquiry as InquiryRecord);
      setDownpaymentInput(
        updatedInquiry?.downpaymentAmount ? String(updatedInquiry.downpaymentAmount) : ''
      );
      setIsSavingDownpayment(false);
    },
    onError: () => {
      setIsSavingDownpayment(false);
      // Optional: Add error feedback here
    },
  });

  const saveCustomPackageAmountMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      return await updateInquiry(id, { packageInitialAmount: amount });
    },
    onSuccess: (updatedInquiry) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onInquiryUpdated(updatedInquiry as InquiryRecord);
      setCustomPackageAmountInput(
        updatedInquiry?.packageInitialAmount ? String(updatedInquiry.packageInitialAmount) : ''
      );
      setIsSavingCustomPackageAmount(false);
    },
    onError: () => {
      setIsSavingCustomPackageAmount(false);
    },
  });

  const saveVenueMutation = useMutation({
    mutationFn: async ({ id, venue }: { id: string; venue: string }) => {
      return await updateInquiry(id, { venue } as Partial<InquiryRecord>);
    },
    onSuccess: (updatedInquiry) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onInquiryUpdated(updatedInquiry as InquiryRecord);
      setVenueInput(String((updatedInquiry as InquiryRecord)?.venue || ''));
      setIsSavingVenue(false);
    },
    onError: () => {
      setIsSavingVenue(false);
    },
  });

  const handleSaveDownpayment = () => {
    if (!selectedInquiry || !downpaymentInput) return;
    const id = String(selectedInquiry.id || selectedInquiry._id || '').trim();
    if (!id) return;
    setIsSavingDownpayment(true);
    saveDownpaymentMutation.mutate({ id, downpayment: Number(downpaymentInput) });
  };

  const handleSaveCustomPackageAmount = () => {
    if (!selectedInquiry || !customPackageAmountInput) return;
    const id = String(selectedInquiry.id || selectedInquiry._id || '').trim();
    if (!id) return;
    setIsSavingCustomPackageAmount(true);
    saveCustomPackageAmountMutation.mutate({ id, amount: Number(customPackageAmountInput) });
  };

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
  const hasAccountForInquiry = Boolean(
    selectedInquiry?.userId || selectedInquiry?.user_id || isAlreadyRegistered || createdAccount
  );

  useEffect(() => {
    if (!selectedInquiry) return;

    setSelectedMeetingOrganizerId(selectedInquiry?.meetingDetails?.organizerId || '');
    setAccountCreateError('');
    setAccountCreateSuccess('');
    setCopiedInquiryId('');
    setDownpaymentInput(
      selectedInquiry?.downpaymentAmount ? String(selectedInquiry.downpaymentAmount) : ''
    );
    setCustomPackageAmountInput(
      selectedInquiry?.packageInitialAmount ? String(selectedInquiry.packageInitialAmount) : ''
    );
    setVenueInput(selectedInquiry?.venue || selectedInquiry?.location || '');

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

    // Fetch venue vendors for the dropdown
    setIsLoadingVenues(true);
    getVendors()
      .then((allVendors) => {
        const venues = allVendors
          .filter(
            (v) => v.serviceType.toLowerCase() === 'venue' && v.name && v.name !== 'Unnamed vendor'
          )
          .map((v) => ({ name: v.name, price: v.price }));
        // Deduplicate by name
        const uniqueVenues = Array.from(new Map(venues.map((v) => [v.name, v])).values());
        setVenueVendors(uniqueVenues);
      })
      .catch(() => setVenueVendors([]))
      .finally(() => setIsLoadingVenues(false));
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
    const meetingDateSource = String(
      selectedInquiry?.meetingDetails?.date || selectedInquiry?.meetingDetails?.startDateKey || ''
    ).trim();

    const plannedDateSource = String(selectedInquiry.date || '').trim();
    const eventTitle = String(
      selectedInquiry?.title ||
        selectedInquiry?.subject ||
        selectedInquiry?.meetingDetails?.title ||
        `${selectedInquiry.firstName || 'Client'} ${selectedInquiry.lastName || 'Inquiry'} Event`
    ).trim();

    const canCreateApprovedEvent = pendingStatus === INQUIRY_STATUS_OPTIONS.APPROVED;

    if (canCreateApprovedEvent) {
      if (!clientId) {
        setStatusChangeError('Create the client account before approving this inquiry.');
        return;
      }

      if (!organizerId) {
        setStatusChangeError('Assign an organizer before approving this inquiry.');
        return;
      }

      if (!meetingDateSource) {
        setStatusChangeError('A scheduled meeting is required before approving this inquiry.');
        return;
      }

      if (!selectedInquiry.downpaymentAmount) {
        setStatusChangeError('A downpayment must be added before approving this inquiry.');
        return;
      }

      const inquiryVenue = String(selectedInquiry.venue || selectedInquiry.location || '').trim();
      if (!inquiryVenue) {
        setStatusChangeError('A venue must be added before approving this inquiry.');
        return;
      }

      const isOthersPackage =
        String(selectedInquiry.eventPackage || '')
          .trim()
          .toLowerCase() === 'others';
      const hasCustomPackageAmount =
        Number.isFinite(Number(selectedInquiry.packageInitialAmount)) &&
        Number(selectedInquiry.packageInitialAmount) > 0;
      if (isOthersPackage && !hasCustomPackageAmount) {
        setStatusChangeError(
          'A custom package amount must be added before approving this inquiry.'
        );
        return;
      }

      if (!plannedDateSource) {
        setStatusChangeError('Inquiry planned date is required before creating the event.');
        return;
      }
    }

    try {
      setIsUpdatingStatus(true);
      setStatusChangeError('');
      await updateInquiryStatus(id, pendingStatus);

      if (canCreateApprovedEvent) {
        const startDate = meetingDateSource
          ? new Date(meetingDateSource).toISOString()
          : new Date().toISOString();
        const endDate = plannedDateSource
          ? new Date(plannedDateSource).toISOString()
          : new Date().toISOString();

        // Compute event price from package + event type + pax if not already set
        const eventTypeStr = String(selectedInquiry.eventType || '').trim();
        const eventPackageStr = String(selectedInquiry.eventPackage || '').trim();
        const eventPaxNum = Number(selectedInquiry.eventPax) || 0;

        const computedPrice = calculatePackagePrice(eventPackageStr, eventTypeStr, eventPaxNum);
        const rawPackageInitialAmount = Number(selectedInquiry.packageInitialAmount);
        const packageInitialAmount =
          Number.isFinite(rawPackageInitialAmount) && rawPackageInitialAmount > 0
            ? rawPackageInitialAmount
            : computedPrice > 0
              ? computedPrice
              : undefined;

        const downpaymentAmount = Number(selectedInquiry.downpaymentAmount);
        const hasPackageInitialAmount = packageInitialAmount !== undefined;
        const hasDownpaymentAmount = Number.isFinite(downpaymentAmount);
        const packagePrice = hasPackageInitialAmount
          ? Math.max(0, packageInitialAmount - (hasDownpaymentAmount ? downpaymentAmount : 0))
          : undefined;

        try {
          await createEvent({
            title: eventTitle,
            startDate,
            endDate,
            inquiryId: id,
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
            packageInitialAmount: hasPackageInitialAmount ? packageInitialAmount : undefined,
            downpaymentAmount: hasDownpaymentAmount ? downpaymentAmount : undefined,
            packagePrice,
            eventDate: endDate,
            eventLocation: String(selectedInquiry.venue || selectedInquiry.location || '').trim(),
            venue: String(selectedInquiry.venue || selectedInquiry.location || '').trim(),
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

  // Determine the normalized current status and build options.
  // Exclude "Requires Clarification" from the selectable list unless
  // the inquiry currently has that status, so the Select can display it.
  const currentStatusValue = normalizeInquiryStatus(selectedInquiry?.status);
  const statusOptions = getInquiryStatusOptions(selectedInquiry?.status).filter(
    (opt) =>
      (opt.value !== INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION ||
        opt.value === currentStatusValue) &&
      opt.value !== INQUIRY_STATUS_OPTIONS.DECLINED
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-linear-to-r from-[#fdfbff] to-[#f5f7ff] p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black text-foreground">
                Inquiry Details
              </DialogTitle>
              <p className="text-sm font-semibold text-muted-foreground mt-0.5">
                Submitted on{' '}
                {new Date(
                  selectedInquiry?.createdAt || selectedInquiry?.created_at || Date.now()
                ).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedInquiry && (
                <Button
                  variant="outline"
                  className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED}
                  onClick={() => handleStatusChange(INQUIRY_STATUS_OPTIONS.DECLINED)}
                >
                  {currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED
                    ? 'Declined'
                    : 'Decline Inquiry'}
                </Button>
              )}
              {user?.role === 'ADMIN' && selectedInquiry && (
                <Button
                  variant="destructive"
                  className="font-bold"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  Delete Inquiry
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedInquiry && (
          <div className="p-6">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.95fr)_minmax(320px,1fr)]">
              {/* First Column - Core Info */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#d5c9e4]"></span>
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-[#fcfaff] p-4 transition-all hover:border-[#e2d5f0]">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                        Full Name
                      </h4>
                      <p className="text-foreground font-bold text-lg">
                        {selectedInquiry.firstName} {selectedInquiry.lastName}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-[#fcfaff] p-4 transition-all hover:border-[#e2d5f0]">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#d5c9e4]"></span>
                    Event Requirements
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="px-4 py-3 rounded-xl bg-brand/5/50 border-2 border-border backdrop-blur-sm shadow-sm flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                        Current Status
                      </p>
                      <p className="text-sm font-bold text-muted-foreground">
                        {selectedInquiry?.status || 'New'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                        Event Format
                      </h4>
                      <p className="text-foreground/80 font-bold text-sm">
                        {selectedInquiry.eventType || selectedInquiry.subject || 'N/A'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                        Planned Date
                      </h4>
                      <p className="text-foreground/80 font-bold text-sm">
                        {new Date(
                          selectedInquiry.date || selectedInquiry.createdAt || Date.now()
                        ).toLocaleDateString('en-US', {
                          timeZone: 'UTC',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                        Submitted Date
                      </h4>
                      <p className="text-foreground/80 font-bold text-sm">
                        {new Date(
                          selectedInquiry.createdAt || selectedInquiry.created_at || Date.now()
                        ).toLocaleDateString('en-US', {
                          timeZone: 'UTC',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {selectedInquiry.eventPackage && (
                      <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                          Package Choice
                        </h4>
                        <p className="text-foreground/80 font-bold text-sm">
                          {selectedInquiry.eventPackage}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.eventPax && (
                      <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                          Guest Count
                        </h4>
                        <p className="text-foreground/80 font-bold text-sm">
                          {selectedInquiry.eventPax} Pax
                        </p>
                      </div>
                    )}

                    {(selectedInquiry.eventPackage ||
                      selectedInquiry.packageInitialAmount !== undefined) &&
                      String(selectedInquiry.eventPackage || '')
                        .trim()
                        .toLowerCase() !== 'others' &&
                      (() => {
                        const displayAmount =
                          Number.isFinite(Number(selectedInquiry.packageInitialAmount)) &&
                          Number(selectedInquiry.packageInitialAmount) > 0
                            ? Number(selectedInquiry.packageInitialAmount)
                            : calculatePackagePrice(
                                String(selectedInquiry.eventPackage || '').trim(),
                                String(selectedInquiry.eventType || '').trim(),
                                Number(selectedInquiry.eventPax) || 0
                              );
                        return (
                          <div className="rounded-xl border border-border bg-white p-3 shadow-sm col-span-2">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 mb-1">
                              Package Amount
                            </h4>
                            <p className="text-foreground/80 font-bold text-sm">
                              {displayAmount > 0 ? formatMoney(displayAmount) : '—'}
                            </p>
                          </div>
                        );
                      })()}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#d5c9e4]"></span>
                    Client Message
                  </h3>
                  <div className="min-h-20 whitespace-pre-wrap rounded-2xl border border-[#ece4f5] bg-[#faf7ff] p-5 text-sm text-foreground/80 leading-relaxed italic shadow-inner">
                    "{selectedInquiry.message || 'No additional message provided.'}"
                  </div>
                </section>
              </div>

              {/* Second Column - Meetings & Account Details */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 mb-2">
                    Meetings
                  </h4>
                  {selectedInquiry.meetingDetails ? (
                    <div className="w-full space-y-4">
                      <div className="rounded-2xl border border-border bg-linear-to-br from-[#fbf6ff] to-[#f5f0ff] p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-border text-brand-deep shadow-xs">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#5f4f7a]">
                              {new Date(
                                selectedInquiry.meetingDetails.date || Date.now()
                              ).toLocaleDateString('en-US', {
                                timeZone: 'UTC',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-xs font-bold text-brand-deep">
                              at {selectedInquiry.meetingDetails.time || 'TBD'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 text-[11px] font-semibold">
                          <p className="flex justify-between border-b border-border pb-1.5">
                            <span className="text-muted-foreground/70">Meeting Location</span>
                            <span className="text-[#5f4f7a]">
                              {selectedInquiry.meetingDetails.location || 'TBA'}
                            </span>
                          </p>
                          <div className="space-y-2">
                            <p className="flex justify-between">
                              <span className="text-muted-foreground/70">Current Organizer</span>
                              <span className="text-[#5f4f7a] text-right">
                                {getOrganizerLabel(
                                  selectedInquiry.meetingDetails.organizerId || ''
                                )}
                              </span>
                            </p>
                            <div className="pt-1">
                              <Label className="text-[9px] font-black uppercase text-muted-foreground mb-1.5 block">
                                Reassign Expert
                              </Label>
                              <Select
                                value={selectedMeetingOrganizerId}
                                onValueChange={handleOrganizerChange}
                                disabled={isUpdatingMeetingOrganizer}
                              >
                                <SelectTrigger className="h-9 w-full rounded-xl border-border bg-white/80 px-3 text-[11px] font-bold text-foreground/80 transition-all">
                                  <SelectValue placeholder="Change organizer..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border">
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
                      <div className="rounded-2xl border border-dashed border-border bg-brand/5 p-6 text-center">
                        <CalendarIcon className="h-8 w-8 text-[#d5c9e4] mx-auto mb-2" />
                        <p className="text-sm font-bold text-[#6a5a83]">No meeting scheduled</p>
                        <p className="text-[11px] text-[#9a8fb0] mt-1">
                          Use the status options above to schedule a discovery call
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 mb-2">
                    Account Details
                  </h4>
                  <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                    {createdAccount && (
                      <div className="space-y-2 rounded-lg border border-[#e5dbef] bg-[#faf7ff] p-2 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[9px] font-black uppercase text-muted-foreground">
                          Temporary Access Key
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              readOnly
                              value={isPasswordVisible ? createdAccount.password : '••••••••••••'}
                              className="h-8 text-[11px] font-bold pr-8"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswordByInquiry((prev) => ({
                                  ...prev,
                                  [selectedInquiryKey]: !isPasswordVisible,
                                }))
                              }
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-deep"
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleCopyPassword(selectedInquiryKey, createdAccount.password)
                            }
                            className="h-8 w-8 p-0 bg-white"
                          >
                            {isCopied ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {!createdAccount && hasAccountForInquiry && (
                      <div className="space-y-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[9px] font-black uppercase text-emerald-700">
                          Account Ready
                        </p>
                        <div className="space-y-1 text-[11px] font-semibold text-emerald-900">
                          {selectedInquiry?.email && (
                            <p className="flex justify-between gap-3">
                              <span className="text-emerald-700/80">Email</span>
                              <span className="text-right break-all">{selectedInquiry.email}</span>
                            </p>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-emerald-700/80">
                          Temporary password is sent to the email.
                        </p>
                      </div>
                    )}

                    {accountCreateError && (
                      <div className="mt-2 p-1.5 rounded bg-red-50 border border-red-100">
                        <p className="text-[9px] font-bold text-red-600">{accountCreateError}</p>
                      </div>
                    )}
                    {accountCreateSuccess && (
                      <div className="mt-2 p-1.5 rounded bg-emerald-50 border border-emerald-100">
                        <p className="text-[9px] font-bold text-emerald-700">
                          {accountCreateSuccess}
                        </p>
                      </div>
                    )}
                    {!createdAccount &&
                      !hasAccountForInquiry &&
                      !accountCreateError &&
                      !accountCreateSuccess && (
                        <p className="text-[11px] text-[#9a8fb0] text-center italic py-2">
                          No account details generated yet.
                        </p>
                      )}
                  </div>
                </section>
              </div>

              {/* Third Column - Inquiry Status */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 mb-2">
                    Inquiry Status
                  </h4>
                  <div className="p-4 rounded-2xl border border-border bg-white shadow-sm flex flex-col gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">
                      Change State
                    </Label>
                    {statusOptions.map((option, index) => {
                      const isMeetingBtn =
                        option.value === INQUIRY_STATUS_OPTIONS.MEETING_SCHEDULED;
                      const isApprovedBtn = option.value === INQUIRY_STATUS_OPTIONS.APPROVED;
                      const hasAccount = Boolean(
                        selectedInquiry?.userId || isAlreadyRegistered || createdAccount
                      );
                      const isActive = currentStatusValue === option.value;
                      const currentIndex = statusOptions.findIndex(
                        (o) => o.value === currentStatusValue
                      );
                      const isCompleted = index < currentIndex;

                      let displayLabel = option.label;
                      if (isMeetingBtn && (isActive || isCompleted)) {
                        displayLabel = 'Meeting Scheduled';
                      }

                      const hasMeetingScheduled = Boolean(selectedInquiry?.meetingDetails);

                      // Override "Approved" gating: enable once account is ready AND meeting is scheduled.
                      // Other statuses keep their default disabled behavior.
                      const hasVenue = Boolean(
                        String(selectedInquiry?.venue || selectedInquiry?.location || '').trim()
                      );
                      const isOthersPackage =
                        String(selectedInquiry?.eventPackage || '')
                          .trim()
                          .toLowerCase() === 'others';
                      const hasCustomPackageAmount =
                        Number.isFinite(Number(selectedInquiry?.packageInitialAmount)) &&
                        Number(selectedInquiry?.packageInitialAmount) > 0;

                      const isOptionDisabled = isApprovedBtn
                        ? !hasAccount ||
                          !hasMeetingScheduled ||
                          !selectedInquiry?.downpaymentAmount ||
                          !hasVenue ||
                          (isOthersPackage && !hasCustomPackageAmount)
                        : option.disabled;

                      return (
                        <Fragment key={option.value}>
                          {isApprovedBtn && (
                            <>
                              {isOthersPackage && (
                                <div className="relative my-2 rounded-xl border border-border bg-[#faf7ff] p-3">
                                  <Label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">
                                    Package Amount (Required for Approval)
                                  </Label>
                                  <div className="flex gap-2 items-center">
                                    <Input
                                      type="number"
                                      placeholder="Enter custom amount"
                                      value={customPackageAmountInput}
                                      onChange={(e) => setCustomPackageAmountInput(e.target.value)}
                                      disabled={
                                        currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED ||
                                        currentStatusValue === INQUIRY_STATUS_OPTIONS.APPROVED
                                      }
                                      className="h-9 flex-1 bg-white border-border focus-visible:ring-[#8C6bB1] text-xs font-bold disabled:opacity-50"
                                    />
                                    <Button
                                      onClick={handleSaveCustomPackageAmount}
                                      disabled={
                                        isSavingCustomPackageAmount ||
                                        !customPackageAmountInput ||
                                        currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED ||
                                        currentStatusValue === INQUIRY_STATUS_OPTIONS.APPROVED
                                      }
                                      className="h-9 px-3 bg-[#8C6bB1] hover:bg-[#6c4e8e] text-white font-bold rounded-lg text-xs transition-all shadow-sm disabled:opacity-50"
                                    >
                                      {isSavingCustomPackageAmount ? (
                                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                      ) : (
                                        'Save'
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}
                              <div className="relative my-2 rounded-xl border border-border bg-[#faf7ff] p-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">
                                  Venue (Required for Approval)
                                </Label>
                                <div className="flex gap-2 items-center">
                                  <Select
                                    value={venueInput || undefined}
                                    onValueChange={(value) => {
                                      setVenueInput(value);
                                      // Auto-save on selection
                                      const id = String(
                                        selectedInquiry.id || selectedInquiry._id || ''
                                      ).trim();
                                      if (id && value.trim()) {
                                        setIsSavingVenue(true);
                                        saveVenueMutation.mutate({ id, venue: value.trim() });
                                      }
                                    }}
                                    disabled={
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED ||
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.APPROVED ||
                                      isLoadingVenues
                                    }
                                  >
                                    <SelectTrigger className="h-9 flex-1 bg-white border-border text-xs font-bold disabled:opacity-50">
                                      <SelectValue
                                        placeholder={
                                          isLoadingVenues ? 'Loading venues...' : 'Select venue...'
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border">
                                      {venueVendors.map((venue) => (
                                        <SelectItem key={venue.name} value={venue.name}>
                                          {venue.name}{' '}
                                          {venue.price !== null && venue.price !== undefined
                                            ? `(₱${venue.price.toLocaleString('en-PH')})`
                                            : ''}
                                        </SelectItem>
                                      ))}
                                      {venueVendors.length === 0 && !isLoadingVenues && (
                                        <div className="px-3 py-2 text-xs text-muted-foreground italic">
                                          No venue vendors found
                                        </div>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {isSavingVenue && (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#8C6bB1]" />
                                  )}
                                </div>
                              </div>
                              <div className="relative my-2 rounded-xl border border-border bg-[#faf7ff] p-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">
                                  Downpayment (Required for Approval)
                                </Label>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={downpaymentInput}
                                    onChange={(e) => setDownpaymentInput(e.target.value)}
                                    disabled={
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED ||
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.APPROVED
                                    }
                                    className="h-9 flex-1 bg-white border-border focus-visible:ring-[#8C6bB1] text-xs font-bold disabled:opacity-50"
                                  />
                                  <Button
                                    onClick={handleSaveDownpayment}
                                    disabled={
                                      isSavingDownpayment ||
                                      !downpaymentInput ||
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.DECLINED ||
                                      currentStatusValue === INQUIRY_STATUS_OPTIONS.APPROVED
                                    }
                                    className="h-9 px-3 bg-[#8C6bB1] hover:bg-[#6c4e8e] text-white font-bold rounded-lg text-xs transition-all shadow-sm disabled:opacity-50"
                                  >
                                    {isSavingDownpayment ? (
                                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    ) : (
                                      'Save'
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="relative my-2 rounded-xl border border-border bg-[#faf7ff] p-3">
                                {!selectedInquiry.meetingDetails && !hasAccount && (
                                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-2 text-center rounded-xl">
                                    <p className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 shadow-sm">
                                      Schedule a meeting first.
                                    </p>
                                  </div>
                                )}
                                <Label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">
                                  Portal Access (Required for Approval)
                                </Label>
                                <Button
                                  type="button"
                                  onClick={handleCreateUserAccount}
                                  disabled={
                                    isCreatingAccount ||
                                    !selectedInquiry?.email ||
                                    hasAccount ||
                                    !selectedInquiry.meetingDetails
                                  }
                                  className={`w-full h-10 ${hasAccount ? 'bg-emerald-600' : 'bg-linear-to-r from-[#2e2837] to-[#5a5368]'} text-white font-bold rounded-lg text-xs`}
                                >
                                  {isCreatingAccount
                                    ? 'Processing...'
                                    : hasAccount
                                      ? 'Account Ready'
                                      : 'Create User Account'}
                                </Button>
                              </div>
                            </>
                          )}
                          <Button
                            variant={isActive ? 'default' : 'outline'}
                            disabled={isOptionDisabled && !isActive}
                            className={`w-full justify-start h-11 rounded-xl font-bold transition-all ${
                              isActive
                                ? 'bg-linear-to-r from-brand to-brand-deep text-white border-none shadow-md'
                                : isCompleted
                                  ? 'bg-[#f7f5fa] border-border text-muted-foreground'
                                  : 'bg-white border-border text-[#5a5368] hover:border-[#d5c9e4] hover:bg-[#faf7ff]'
                            }`}
                            onClick={() => {
                              if (isActive) return;
                              if (isMeetingBtn && !selectedInquiry?.meetingDetails) {
                                setIsScheduleModalOpen(true);
                              } else {
                                handleStatusChange(option.value);
                              }
                            }}
                          >
                            <span
                              className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : isCompleted
                                    ? 'bg-[#e5ddee] text-muted-foreground/70'
                                    : 'bg-[#f3edfa] text-brand-deep'
                              }`}
                            >
                              {index + 1}
                            </span>
                            {displayLabel}
                            {isMeetingBtn &&
                              !selectedInquiry?.meetingDetails &&
                              !option.disabled &&
                              !isActive && <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />}
                          </Button>
                        </Fragment>
                      );
                    })}
                    {statusChangeError && (
                      <p className="mt-2 text-[11px] font-semibold text-red-600">
                        {statusChangeError}
                      </p>
                    )}
                  </div>
                </section>
              </div>
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
            <h3 className="text-xl font-black text-foreground mb-2">Update Status?</h3>
            <p className="text-sm font-medium text-[#7a708d] mb-6">
              Are you sure you want to change the status of this inquiry from{' '}
              <span className="font-bold text-muted-foreground">{selectedInquiry?.status || 'New'}</span>{' '}
              to <span className="font-bold text-brand-deep">{pendingStatus}</span>?
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
                className="flex-1 h-11 bg-linear-to-r from-brand to-brand-deep text-white font-black rounded-xl shadow-md"
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
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-brand/10 to-brand-deep/10 text-brand-deep flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">Change Organizer?</h3>
            <p className="text-sm font-medium text-[#7a708d] mb-6">
              Are you sure you want to reassign this inquiry from{' '}
              <span className="font-bold text-muted-foreground">
                {getOrganizerLabel(selectedInquiry?.meetingDetails?.organizerId || '')}
              </span>{' '}
              to{' '}
              <span className="font-bold text-brand-deep">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-2xl">
          <div className="p-6 text-center">
            <h3 className="text-xl font-black text-foreground mb-2">Delete Inquiry?</h3>
            <p className="text-sm font-medium text-[#7a708d] mb-6">
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={deleteInquiryMutation.isPending}
                className="flex-1 h-11 border-[#e7dff0] text-[#5a5368] font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  deleteInquiryMutation.mutate(selectedInquiry?.id || selectedInquiry?._id || '')
                }
                disabled={deleteInquiryMutation.isPending}
                variant="destructive"
                className="flex-1 h-11 font-black rounded-xl shadow-md"
              >
                {deleteInquiryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
