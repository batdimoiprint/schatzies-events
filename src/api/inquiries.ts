import axiosInstance from './axios-instance';

export interface InquiryFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  contactNumber: string;
  date: string;
  eventType: string;
  eventPackage: string;
  eventPax: number;
  message?: string;
}

export interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  createdAt: string;
  status: string;
}

export interface ScheduleInquiryMeetingPayload {
  title: string;
  startDateKey: string;
  startTime: string;
  endDateKey: string;
  endTime: string;
  label: string;
  organizerId: string;
  location: string;
  description: string;
  eventType: string;
  inquiryUserId?: string;
}

export interface InquiryStatusOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Hardcoded inquiry status options
 */
export const INQUIRY_STATUS_OPTIONS = {
  PENDING_REVIEW: 'Pending Review',
  REQUIRES_CLARIFICATION: 'Requires Clarification',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
} as const;

/**
 * Get all inquiry status options with disabled states based on current status
 */
export const getInquiryStatusOptions = (currentStatus?: string): InquiryStatusOption[] => {
  const normalized = String(currentStatus || '')
    .trim()
    .toLowerCase();

  // Normalize legacy statuses
  let normalizedStatus = currentStatus;
  if (normalized === 'new' || normalized === 'pending') {
    normalizedStatus = INQUIRY_STATUS_OPTIONS.PENDING_REVIEW;
  } else if (normalized === 'in progress') {
    normalizedStatus = INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION;
  } else if (normalized === 'resolved') {
    normalizedStatus = INQUIRY_STATUS_OPTIONS.APPROVED;
  }

  const currentNormalized = String(normalizedStatus || '')
    .trim()
    .toLowerCase();

  // All possible status options
  const allOptions: InquiryStatusOption[] = [
    { value: INQUIRY_STATUS_OPTIONS.PENDING_REVIEW, label: INQUIRY_STATUS_OPTIONS.PENDING_REVIEW },
    {
      value: INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION,
      label: INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION,
    },
    { value: INQUIRY_STATUS_OPTIONS.APPROVED, label: INQUIRY_STATUS_OPTIONS.APPROVED },
    { value: INQUIRY_STATUS_OPTIONS.DECLINED, label: INQUIRY_STATUS_OPTIONS.DECLINED },
  ];

  // Disable logic based on current status
  if (
    currentNormalized === 'pending review' ||
    currentNormalized === 'new' ||
    currentNormalized === 'pending'
  ) {
    // From Pending Review: can only move to Requires Clarification
    return allOptions.map((option) => ({
      ...option,
      disabled:
        option.value === INQUIRY_STATUS_OPTIONS.PENDING_REVIEW ||
        option.value === INQUIRY_STATUS_OPTIONS.APPROVED ||
        option.value === INQUIRY_STATUS_OPTIONS.DECLINED,
    }));
  }

  if (currentNormalized === 'requires clarification' || currentNormalized === 'in progress') {
    // From Requires Clarification: can move to Approved or Declined
    return allOptions.map((option) => ({
      ...option,
      disabled:
        option.value === INQUIRY_STATUS_OPTIONS.PENDING_REVIEW ||
        option.value === INQUIRY_STATUS_OPTIONS.REQUIRES_CLARIFICATION,
    }));
  }

  if (currentNormalized === 'approved' || currentNormalized === 'resolved') {
    // From Approved: all options disabled (final state)
    return allOptions.map((option) => ({
      ...option,
      disabled: true,
    }));
  }

  if (currentNormalized === 'declined') {
    // From Declined: all options disabled (final state)
    return allOptions.map((option) => ({
      ...option,
      disabled: true,
    }));
  }

  // Default: disable current status
  return allOptions.map((option) => ({
    ...option,
    disabled: option.value === normalizedStatus,
  }));
};

export const submitInquiry = async (inquiryData: InquiryFormData): Promise<void> => {
  try {
    // Transform camelCase to snake_case for backend API
    const payload = {
      firstName: inquiryData.firstName,
      lastName: inquiryData.lastName,
      middleName: inquiryData.middleName,
      email: inquiryData.email,
      contactNumber: inquiryData.contactNumber, // Fixed: changed from contact_number to contactNumber
      date: inquiryData.date,
      eventType: inquiryData.eventType,
      eventPackage: inquiryData.eventPackage,
      eventPax: inquiryData.eventPax,
      message: inquiryData.message,
    };
    await axiosInstance.post('/inquiries', payload);
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    throw error;
  }
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const response = await axiosInstance.get('/inquiries');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    throw error;
  }
};

export const updateInquiryStatus = async (id: string, status: string): Promise<Inquiry> => {
  try {
    const response = await axiosInstance.patch(`/inquiries/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    throw error;
  }
};

export const scheduleInquiryMeeting = async (
  id: string,
  data: ScheduleInquiryMeetingPayload
): Promise<Inquiry> => {
  try {
    const response = await axiosInstance.post(`/inquiries/${id}/meeting`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to schedule meeting:', error);
    throw error;
  }
};

export const checkUserRegistered = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/inquiries/${id}/isUserRegistered`);
    return response.data.isUserRegistered || response.data.is_Account_Created === true;
  } catch (error) {
    console.error('Failed to check user registration:', error);
    return false;
  }
};
