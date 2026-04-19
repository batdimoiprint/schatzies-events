export interface RSVPResponse {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber: string;
  attending: boolean;
  message?: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
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
