import axiosInstance from './axios-instance';

export type EventStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface EventManagerEvent {
  id: string;
  title: string;
  date: string;
  timeSlot: string;
  client: string;
  type: string;
  package: string;
  venue: string;
  rsvp: number;
  status: EventStatus;
}

interface BackendEvent {
  id: string;
  clientId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  eventDate?: string;
  eventType?: string;
  eventPackage?: string;
  eventPax?: number | null;
  venue?: string;
  status?: string;
}

interface BackendEventDetails extends BackendEvent {
  clientName?: string;
  dateStart?: string;
  dateEnd?: string;
  package?: {
    name?: string;
    pax?: number;
  };
  headcount?: {
    expectedAttendee?: number;
  };
}

export interface CreateEventPayload {
  title: string;
  startDate: string;
  endDate?: string;
  eventType?: string;
  eventPackage?: string;
  eventPax?: number;
  venue?: string;
  status?: string;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  notes?: string;
  location?: string;
  description?: string;
}

function formatDate(dateValue?: string): string {
  if (!dateValue) return '-';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '-';

  return parsed.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}

function formatTimeRange(startDate?: string, endDate?: string): string {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (!start || Number.isNaN(start.getTime())) return '-';

  const startLabel = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (!end || Number.isNaN(end.getTime())) {
    return startLabel;
  }

  const endLabel = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${startLabel} - ${endLabel}`;
}

function mapEventStatus(status?: string): EventStatus {
  const normalized = String(status || '').trim().toLowerCase();

  if (normalized === 'completed' || normalized === 'confirmed') {
    return 'Completed';
  }

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'Cancelled';
  }

  return 'Pending';
}

function mapToManagerRow(baseEvent: BackendEvent, details?: BackendEventDetails): EventManagerEvent {
  const startDate = details?.dateStart || baseEvent.startDate || baseEvent.eventDate;
  const endDate = details?.dateEnd || baseEvent.endDate;
  const packageName = details?.package?.name || baseEvent.eventPackage || '-';
  const packagePax = details?.package?.pax ?? baseEvent.eventPax ?? 0;

  return {
    id: baseEvent.id,
    title: baseEvent.title || 'Untitled event',
    date: formatDate(startDate),
    timeSlot: formatTimeRange(startDate, endDate),
    client: details?.clientName || baseEvent.clientId || 'Unknown client',
    type: baseEvent.eventType || '-',
    package: packagePax > 0 ? `${packageName} (${packagePax})` : packageName,
    venue: baseEvent.venue || '-',
    rsvp: Number(details?.headcount?.expectedAttendee || 0),
    status: mapEventStatus(baseEvent.status),
  };
}

export async function getEvents(): Promise<BackendEvent[]> {
  const response = await axiosInstance.get('/events');
  return response.data.events || [];
}

export async function getEventById(eventId: string): Promise<BackendEventDetails> {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data.event;
}

export async function getEventManagerEvents(): Promise<EventManagerEvent[]> {
  const events = await getEvents();
  if (!events.length) {
    return [];
  }

  const details = await Promise.all(
    events.map(async (event) => {
      try {
        return await getEventById(event.id);
      } catch {
        return undefined;
      }
    })
  );

  return events.map((event, index) => mapToManagerRow(event, details[index]));
}

export async function createEvent(payload: CreateEventPayload): Promise<BackendEvent> {
  const response = await axiosInstance.post('/events', payload);
  return response.data.event;
}

export async function updateEvent(eventId: string, payload: UpdateEventPayload): Promise<BackendEvent> {
  const response = await axiosInstance.put(`/events/${eventId}`, payload);
  return response.data.event;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await axiosInstance.delete(`/events/${eventId}`);
}
