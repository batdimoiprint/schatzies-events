import axiosInstance from './axios-instance';

export interface CalendarEntryPayload {
  title: string;
  startDateKey: string;
  startTime: string;
  endDateKey: string;
  endTime: string;
  label: string;
  location: string;
  description: string;
  eventType: string;
}

export const getCalendarEntries = async (filters: any = {}): Promise<any[]> => {
  const response = await axiosInstance.get('/calendar', { params: filters });
  return response.data.entries || [];
};

export const createCalendarEntry = async (data: CalendarEntryPayload): Promise<any> => {
  const response = await axiosInstance.post('/calendar', data);
  return response.data.entry;
};
