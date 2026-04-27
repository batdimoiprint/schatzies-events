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
  date?: string;
  endDate?: string;
  type?: string;
  eventId?: string;
}

export const getCalendarEntries = async (filters: any = {}): Promise<any[]> => {
  const response = await axiosInstance.get('/calendar', { params: filters });
  return response.data.entries || [];
};

export const createCalendarEntry = async (data: CalendarEntryPayload): Promise<any> => {
  const response = await axiosInstance.post('/calendar', data);
  return response.data.entry;
};

export const updateCalendarEntry = async (
  entryId: string,
  data: CalendarEntryPayload
): Promise<any> => {
  const response = await axiosInstance.put(`/calendar/${entryId}`, data);
  return response.data;
};

export const deleteCalendarEntry = async (entryId: string): Promise<void> => {
  await axiosInstance.delete(`/calendar/${entryId}`);
};

export const markDoneCalendarEntry = async (entryId: string, isDone: boolean): Promise<any> => {
  const response = await axiosInstance.patch(`/calendar/${entryId}/mark-done`, { isDone });
  return response.data;
};
