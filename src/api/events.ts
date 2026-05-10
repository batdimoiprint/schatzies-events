import axiosInstance from './axios-instance';
import { getUsers } from './users';

export type EventStatus = 'Completed' | 'Pending' | 'Execution' | 'Cancelled';

export interface EventManagerEvent {
  id: string;
  title: string;
  date: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  client: string;
  type: string;
  package: string;
  packageInitialAmount?: number | null;
  downpaymentAmount?: number | null;
  packagePrice?: number | null;
  venue: string;
  rsvp: number;
  status: EventStatus;
  clientId: string;
  organizerId: string;
  organizerName: string;
  createdAt: string;
}

interface BackendEvent {
  id: string;
  clientId?: string;
  organizer_id?: string;
  headOrganizerId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  eventDate?: string;
  eventType?: string;
  eventPackage?: string;
  eventPackageKey?: string;
  eventPax?: number | null;
  packageInitialAmount?: number | null;
  downpaymentAmount?: number | null;
  packagePrice?: number | null;
  venue?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
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
  client_id?: string;
  clientId?: string;
  organizer_id?: string;
  organizerId?: string;
  inquiryId?: string;
  inquiry_id?: string;
  eventPackageKey?: string;
  eventLocation?: string;
  eventDate?: string;
  eventTime?: string;
  endDate?: string;
  eventType?: string;
  eventPackage?: string;
  eventPax?: number;
  venue?: string;
  status?: string;
  packageInitialAmount?: number;
  downpaymentAmount?: number;
  packagePrice?: number;
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

function mapEventStatus(status?: string): EventStatus {
  const normalized = String(status || '')
    .trim()
    .toLowerCase();
  if (normalized === 'completed' || normalized === 'confirmed') return 'Completed';
  if (normalized === 'execution') return 'Execution';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Cancelled';
  return 'Pending'; // Acts as Planning
}

function mapToManagerRow(baseEvent: BackendEvent, userMap: Map<string, string>): EventManagerEvent {
  const rawStartDate = baseEvent.startDate || baseEvent.eventDate || '';
  const rawEndDate = baseEvent.endDate || '';
  const packageName = baseEvent.eventPackageKey || baseEvent.eventPackage || '-';
  const packagePax = baseEvent.eventPax ?? 0;

  const formattedStart = formatDate(rawStartDate);
  const formattedEnd = formatDate(rawEndDate);
  const dateDisplay =
    formattedEnd && formattedEnd !== '-' && formattedEnd !== formattedStart
      ? `${formattedStart} – ${formattedEnd}`
      : formattedStart;

  const orgId = baseEvent.organizer_id || baseEvent.headOrganizerId;
  const clientName = baseEvent.clientId
    ? userMap.get(baseEvent.clientId) || baseEvent.clientId
    : 'Unknown client';
  const organizerName = orgId ? userMap.get(orgId) || '' : '';

  return {
    id: baseEvent.id,
    title: baseEvent.title || 'Untitled event',
    date: dateDisplay,
    startDate: rawStartDate,
    endDate: rawEndDate,
    startTime: baseEvent.startTime || '',
    endTime: baseEvent.endTime || '',
    timeSlot: '-',
    client: clientName,
    type: baseEvent.eventType || '-',
    package: packagePax > 0 ? `${packageName} (${packagePax})` : packageName,
    packageInitialAmount: baseEvent.packageInitialAmount ?? null,
    downpaymentAmount: baseEvent.downpaymentAmount ?? null,
    packagePrice: baseEvent.packagePrice ?? null,
    venue:
      baseEvent.venue &&
      !['', '-', '–', '—', 'n/a', 'tba'].includes(baseEvent.venue.trim().toLowerCase())
        ? baseEvent.venue
        : '',
    rsvp: 0,
    status: mapEventStatus(baseEvent.status),
    clientId: baseEvent.clientId || '',
    organizerId: orgId || '',
    organizerName,
    createdAt: baseEvent.createdAt || '',
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
  const [events, allUsers] = await Promise.all([getEvents(), getUsers()]);

  // Build a lookup map: userId -> "FirstName LastName"
  const userMap = new Map<string, string>();
  for (const user of allUsers) {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (name) userMap.set(user.user_id, name);
  }

  return events.map((event) => mapToManagerRow(event, userMap));
}

export async function createEvent(payload: CreateEventPayload): Promise<BackendEvent> {
  const response = await axiosInstance.post('/events', payload);
  return response.data.event;
}

export async function updateEvent(
  eventId: string,
  payload: UpdateEventPayload
): Promise<BackendEvent> {
  const response = await axiosInstance.put(`/events/${eventId}`, payload);
  return response.data.event;
}

export async function patchEvent(
  eventId: string,
  payload: Partial<UpdateEventPayload>
): Promise<BackendEvent> {
  const response = await axiosInstance.patch(`/events/${eventId}`, payload);
  return response.data.event;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await axiosInstance.delete(`/events/${eventId}`);
}

export async function updateEventPricing(
  eventId: string,
  pricing: { packageInitialAmount?: number; downpaymentAmount?: number }
): Promise<BackendEvent> {
  const response = await axiosInstance.patch(`/events/${eventId}/pricing`, pricing);
  return response.data.event;
}

export async function getEventVendors(eventId: string) {
  const response = await axiosInstance.get(`/events/${eventId}/vendors`);
  return response.data;
}

export async function getEventUser(userId: string) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.user || response.data;
}

export async function getEventAllocation(eventId: string) {
  const response = await axiosInstance.get(`/events/${eventId}/allocation`);
  return response.data.allocation;
}

// ==========================================
// NOTES API (With Dynamic JSON/FormData Logic)
// ==========================================

export async function getEventNotes(eventId: string): Promise<any[]> {
  try {
    const response = await axiosInstance.get(`/events/${eventId}/notes`);
    const rawNotes = response.data?.notes || response.data;

    if (typeof rawNotes === 'string') {
      try {
        const parsed = JSON.parse(rawNotes);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [{ id: `note-${Date.now()}`, title: 'Imported Note', body: rawNotes }];
      }
    }
    return Array.isArray(rawNotes) ? rawNotes : [];
  } catch (error) {
    return [];
  }
}

export async function createEventNote(
  eventId: string,
  payload: any,
  _file?: File | null
): Promise<any> {
  const currentNotes = await getEventNotes(eventId);
  const newNote = { ...payload, id: payload.id || `note-${Date.now()}` };
  const updatedNotes = [...currentNotes, newNote];

  const requestData = { notes: JSON.stringify(updatedNotes) };

  const response = await axiosInstance.put(`/events/${eventId}/notes`, requestData);

  return response.data?.notes ? newNote : newNote;
}

export async function updateEventNote(
  eventId: string,
  noteId: string,
  payload: any,
  _file?: File | null
): Promise<any> {
  const currentNotes = await getEventNotes(eventId);
  const updatedNotes = currentNotes.map((n: any) => (n.id === noteId ? { ...n, ...payload } : n));

  const requestData = { notes: JSON.stringify(updatedNotes) };

  await axiosInstance.put(`/events/${eventId}/notes`, requestData);

  return { ...payload, id: noteId };
}

export async function deleteEventNote(eventId: string, noteId: string): Promise<void> {
  const currentNotes = await getEventNotes(eventId);
  const filteredNotes = currentNotes.filter((n: any) => n.id !== noteId);

  // Deletion doesn't need file upload, so JSON is fine
  await axiosInstance.put(
    `/events/${eventId}/notes`,
    { notes: JSON.stringify(filteredNotes) },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// ==========================================
// CHECKLIST & FLOW API
// ==========================================

export async function getEventChecklist(eventId: string): Promise<any[]> {
  try {
    const response = await axiosInstance.get(`/events/${eventId}/checklist`);
    const data = response.data?.checklist || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function updateEventChecklistItem(
  eventId: string,
  _checklistId: string,
  itemId: string,
  done: boolean,
  label?: string
): Promise<any> {
  const payload: any = { id: itemId, done };
  if (label !== undefined) payload.label = label;

  const response = await axiosInstance.patch(`/events/${eventId}/checklist`, {
    checklist: [payload],
  });
  return response.data;
}

export async function addEventChecklistItem(eventId: string, label: string): Promise<any> {
  const tempId = `chk-${Date.now()}`;

  const response = await axiosInstance.post(`/events/${eventId}/checklist`, {
    checklist: [
      {
        id: tempId,
        label: label,
        done: false,
      },
    ],
  });

  return response.data;
}

export async function deleteEventChecklistItem(eventId: string, itemId: string): Promise<void> {
  await axiosInstance.delete(`/events/${eventId}/checklist/${itemId}`);
}

export async function saveEventAllocation(eventId: string, payload: any): Promise<any> {
  const response = await axiosInstance.post(`/events/${eventId}/allocation`, payload);
  return response.data;
}

export async function getEventFlow(eventId: string) {
  try {
    const response = await axiosInstance.get(`/events/${eventId}/program-flow`);
    let data = response.data;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }

    if (Array.isArray(data)) return data;

    if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.flow)) return data.flow;
      if (Array.isArray(data.flows)) return data.flows;
      if (Array.isArray(data.program_flows)) return data.program_flows;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export async function saveEventFlow(eventId: string, payload: any) {
  const isNew = !payload.id || String(payload.id).startsWith('timeline-');
  let response;

  if (isNew) {
    response = await axiosInstance.post(`/events/${eventId}/program-flow`, payload);
  } else {
    response = await axiosInstance.put(`/events/program-flow/${payload.id}`, payload);
  }

  let data = response.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }

  return data?.flow || data?.data || data;
}

export async function deleteEventActivity(_eventId: string, activityId: string) {
  await axiosInstance.delete(`/events/program-flow/${activityId}`);
}
