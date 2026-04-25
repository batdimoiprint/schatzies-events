export interface RSVPResponse {
  id: string;
  guestId?: string;
  SK?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  contactNumber: string;
  message?: string;
  status: 'Attending' | 'Not Attending' | 'CONFIRMED' | 'TRUE' | string;
  isScanned: boolean;
  qrCode?: string;
  eventId?: string;
  createdAt?: string;
  updatedAt?: string;
  attending?: boolean; // For legacy storage support
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  couple?: {
    name1: string;
    name2: string;
  };
  organizerName: string;
  description?: string;
}

export interface LocalStorageRSVP {
  responses: RSVPResponse[];
  events: EventData[];
}
