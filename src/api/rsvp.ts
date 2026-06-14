// src/api/rsvp.ts
import axiosInstance from './axios-instance';

/**
 * Raw RSVP/guest record as returned by the backend. Fields arrive in several
 * casings (snake_case, camelCase, DynamoDB attribute form), so most are optional
 * and an index signature covers any extra attributes.
 */
export interface RsvpListItem {
  id?: string;
  _id?: string;
  guestId?: string;
  guest_id?: string;
  SK?: string;
  status?: string;
  isScanned?: boolean | string | { BOOL: boolean };
  is_scanned?: boolean | string;
  isVerified?: boolean | string | { BOOL: boolean };
  is_verified?: boolean | string;
  firstName?: string;
  first_name?: string;
  guestfirstName?: string;
  middleName?: string;
  middle_name?: string;
  guestmiddleName?: string;
  lastName?: string;
  last_name?: string;
  guestlastName?: string;
  contactNumber?: string;
  contact_number?: string;
  email?: string;
  message?: string;
  qrCode?: string | { S: string };
  [key: string]: unknown;
}

export interface RSVPPayload {
  event_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
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

export const getRSVPList = async (eventId: string): Promise<RsvpListItem[]> => {
  // Swagger: GET /api/events/{eventId}/rsvps
  const response = await axiosInstance.get(`/events/${eventId}/rsvps`);
  // The response is an object with a "guests" array based on Swagger
  return (
    response.data.guests ||
    response.data.rsvps ||
    (Array.isArray(response.data) ? response.data : [])
  );
};

export const verifyRSVP = async (eventId: string, guestId: string, token: string) => {
  // Swagger: GET /api/rsvp/verify?eventId=...&guestId=...&token=...
  const response = await axiosInstance.get('/rsvp/verify', {
    params: { eventId, guestId, token },
  });
  return response.data;
};

/**
 * Generate (or retrieve existing) RSVP QR code for an event.
 * The QR is stored in S3 and a presigned URL is returned.
 * Maps to: POST /api/events/:eventId/rsvp-qr
 */
export const generateEventRsvpQr = async (
  eventId: string
): Promise<{ qrCode: string; s3Key?: string; url?: string; message?: string }> => {
  const response = await axiosInstance.post(`/events/${eventId}/rsvp-qr`);
  return response.data;
};
