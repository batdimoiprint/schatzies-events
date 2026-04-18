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

export const submitInquiry = async (inquiryData: InquiryData): Promise<void> => {
  await axiosInstance.post('/inquiries', inquiryData);
};
