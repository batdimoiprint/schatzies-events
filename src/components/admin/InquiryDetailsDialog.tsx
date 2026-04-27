import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Check, Copy, Eye, EyeOff } from 'lucide-react';
import { checkUserRegistered, scheduleInquiryMeeting, updateInquiryStatus } from '@/api/inquiries';
import { createUser } from '@/api/users';

interface InquiryDetailsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedInquiry: any;
  getOrganizerLabel: (id: string) => string;
  organizers: any[];
  organizersLoading: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  onInquiryUpdated: (updatedInquiry: any) => void;
}

export function InquiryDetailsDialog({
  isDialogOpen,
  setIsDialogOpen,
  selectedInquiry,
  getOrganizerLabel,
  organizers,
  organizersLoading,
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
  const [scheduleError, setScheduleError] = useState('');

  const getInquiryKey = (inquiry: any) =>
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
    setScheduleError('');

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

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;

    const id = selectedInquiry.id || selectedInquiry._id;

    try {
      await updateInquiryStatus(id, newStatus);
      onInquiryUpdated({ ...selectedInquiry, status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleUpdateMeetingOrganizer = async () => {
    if (!selectedInquiry?.meetingDetails) return;
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

      onInquiryUpdated({
        ...selectedInquiry,
        status: 'Meeting Scheduled',
        meetingDetails: {
          ...existingMeeting,
          organizerId: selectedMeetingOrganizerId,
        },
      });
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-6xl">
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
                      onClick={() => setIsScheduleModalOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}

                {scheduleError ? (
                  <p className="mt-2 text-xs font-semibold text-[#c33274]" role="alert">
                    {scheduleError}
                  </p>
                ) : null}

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
  );
}
