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
  data: { date: string; time: string; location: string; organizerId: string }
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
