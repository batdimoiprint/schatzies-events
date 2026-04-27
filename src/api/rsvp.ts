// src/api/rsvp.ts
import axiosInstance from './axios-instance';

export interface RSVPPayload {
  event_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  contact_number: string;
  status: 'ATTENDING' | 'NOT_ATTENDING';
  message?: string;
}

export const submitRSVP = async (data: RSVPPayload) => {
  // Maps to your backend router.post('/', createRsvp) in rsvp.routes.js
  const response = await axiosInstance.post('/rsvp', data);
  return response.data;
};

export const scanGuest = async (eventId: string, qrCode: string) => {
  // Swagger: POST /api/scanner/scan
  // Request Body: { eventId, qrCode }
  const response = await axiosInstance.post('/scanner/scan', {
    eventId,
    qrCode,
  });
  return response.data;
};

export const getRSVPList = async (eventId: string): Promise<any[]> => {
  // Swagger: GET /api/events/{eventId}/rsvps
  const response = await axiosInstance.get(`/events/${eventId}/rsvps`);
  // The response is an object with a "guests" array based on Swagger
  return (
    response.data.guests ||
    response.data.rsvps ||
    (Array.isArray(response.data) ? response.data : [])
  );
};
