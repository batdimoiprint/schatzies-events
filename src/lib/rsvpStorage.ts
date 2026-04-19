import type { RSVPResponse, EventData, LocalStorageRSVP } from '@/types/rsvp';

const STORAGE_KEY = 'schatzies_rsvp_data';

// Default mock events
const DEFAULT_EVENTS: EventData[] = [
  {
    id: 'evt-001',
    title: 'Wedding Celebration',
    date: 'February 25, 2024',
    time: '6:00 PM',
    location: 'Manila Marriott Hotel',
    couple: {
      name1: 'Kring',
      name2: 'Dave',
    },
    organizerName: 'Schatzies Events',
    description: 'Together with their family and friends invites you to their wedding ceremony!',
  },
  {
    id: 'evt-002',
    title: 'Corporate Gala',
    date: 'March 15, 2024',
    time: '7:00 PM',
    location: 'Grand Ballroom, Shangri-La',
    organizerName: 'Schatzies Events',
    description: 'Join us for an evening of celebration and networking.',
  },
  {
    id: 'evt-003',
    title: 'Birthday Bash',
    date: 'April 10, 2024',
    time: '5:00 PM',
    location: 'Makati Garden Club',
    organizerName: 'Schatzies Events',
    description: 'Celebrate a special milestone with us!',
  },
];

// Initialize localStorage with default data if empty
export function initializeRSVPStorage(): LocalStorageRSVP {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (existing) {
    return JSON.parse(existing);
  }

  const defaultData: LocalStorageRSVP = {
    responses: [],
    events: DEFAULT_EVENTS,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

// Get all events
export function getAllEvents(): EventData[] {
  const data = initializeRSVPStorage();
  return data.events;
}

// Get event by ID
export function getEventById(eventId: string): EventData | undefined {
  const data = initializeRSVPStorage();
  return data.events.find((e) => e.id === eventId);
}

// Get all RSVP responses
export function getAllRSVPs(): RSVPResponse[] {
  const data = initializeRSVPStorage();
  return data.responses;
}

// Get RSVP responses for an event
export function getRSVPsByEvent(eventId: string): RSVPResponse[] {
  const data = initializeRSVPStorage();
  return data.responses.filter((r) => r.eventId === eventId);
}

// Check if guest already RSVP'd (by name and event)
export function checkExistingRSVP(
  eventId: string,
  firstName: string,
  lastName: string
): RSVPResponse | undefined {
  const data = initializeRSVPStorage();
  return data.responses.find(
    (r) =>
      r.eventId === eventId &&
      r.firstName.toLowerCase() === firstName.toLowerCase() &&
      r.lastName.toLowerCase() === lastName.toLowerCase()
  );
}

// Add or update RSVP response
export function addOrUpdateRSVP(
  eventId: string,
  firstName: string,
  lastName: string,
  middleName: string | undefined,
  contactNumber: string,
  attending: boolean,
  message: string | undefined,
  qrCode: string
): RSVPResponse {
  const data = initializeRSVPStorage();
  const now = new Date().toISOString();

  // Check if already exists
  const existingIndex = data.responses.findIndex(
    (r) =>
      r.eventId === eventId &&
      r.firstName.toLowerCase() === firstName.toLowerCase() &&
      r.lastName.toLowerCase() === lastName.toLowerCase()
  );

  const rsvpResponse: RSVPResponse = {
    id:
      existingIndex >= 0
        ? data.responses[existingIndex].id
        : `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    eventId,
    firstName,
    lastName,
    middleName,
    contactNumber,
    attending,
    message,
    qrCode,
    createdAt: existingIndex >= 0 ? data.responses[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    data.responses[existingIndex] = rsvpResponse;
  } else {
    data.responses.push(rsvpResponse);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return rsvpResponse;
}

// Get RSVP by ID
export function getRSVPById(id: string): RSVPResponse | undefined {
  const data = initializeRSVPStorage();
  return data.responses.find((r) => r.id === id);
}

// Delete RSVP response
export function deleteRSVP(id: string): boolean {
  const data = initializeRSVPStorage();
  const index = data.responses.findIndex((r) => r.id === id);

  if (index >= 0) {
    data.responses.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }

  return false;
}

// Clear all data (for testing)
export function clearRSVPStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Get storage statistics
export function getStorageStats() {
  const data = initializeRSVPStorage();
  return {
    totalEvents: data.events.length,
    totalRSVPs: data.responses.length,
    attending: data.responses.filter((r) => r.attending).length,
    notAttending: data.responses.filter((r) => !r.attending).length,
  };
}
