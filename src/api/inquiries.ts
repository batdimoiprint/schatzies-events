import axiosInstance from './axios-instance';

export interface InquiryData {
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
  id: string; // or number based on your DB
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  createdAt: string;
  status: string;
}

export const submitInquiry = async (inquiryData: InquiryData): Promise<void> => {
  await axiosInstance.post('/inquiries', inquiryData);
};

export const getInquiries = async (): Promise<any[]> => {
  const response = await axiosInstance.get('/inquiries');
  return response.data;
};

export const updateInquiryStatus = async (id: string, status: string): Promise<any> => {
  const response = await axiosInstance.patch(`/inquiries/${id}/status`, { status });
  return response.data;
};

export const scheduleInquiryMeeting = async (id: string, data: { date: string, time: string, location: string, organizerId: string }): Promise<any> => {
  const response = await axiosInstance.post(`/inquiries/${id}/meeting`, data);
  return response.data;
};
