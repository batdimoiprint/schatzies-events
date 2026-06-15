import axiosInstance from './axios-instance';

export type VendorStatus = 'Active' | 'Inactive';

export interface Vendor {
  id: string;
  eventId: string;
  vendorName: string;
  name: string;
  contactPerson: string;
  serviceType: string;
  typeOfSupply: string;
  servicesOffered: string;
  pricing: string;
  price: number | null;
  availabilityStatus: string;
  lastEventHandled: string;
  notes: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorPayload {
  vendorName: string;
  contactPerson?: string;
  typeOfSupply?: string;
  servicesOffered?: string;
  pricing?: string;
  serviceType: string;
  price?: number | null;
  eventId?: string;
  email?: string;
  contactNumber?: string;
  availabilityStatus?: string;
  lastEventHandled?: string;
  notes?: string;
}

export type UpdateVendorPayload = Partial<CreateVendorPayload>;

export interface EventManagerVendor {
  id: string;
  eventId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  service: string;
  status: VendorStatus;
}

interface BackendVendor {
  id: string;
  eventId?: string;
  vendorName?: string;
  name?: string;
  contactPerson?: string;
  typeOfSupply?: string;
  servicesOffered?: string;
  pricing?: string;
  serviceType?: string;
  price?: number | null;
  lastEventHandled?: string;
  notes?: string;
  contactNumber?: string;
  email?: string;
  availabilityStatus?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapVendorStatus(status?: string): VendorStatus {
  const normalized = String(status || '')
    .trim()
    .toLowerCase();
  return normalized === 'active' ? 'Active' : 'Inactive';
}

function mapVendor(vendor: BackendVendor): EventManagerVendor {
  const status = vendor.availabilityStatus || vendor.status;
  return {
    id: vendor.id,
    eventId: vendor.eventId || '',
    name: vendor.vendorName || vendor.name || 'Unnamed vendor',
    contactPerson: '-',
    email: vendor.email || vendor.contactEmail || '-',
    phone: vendor.contactNumber || vendor.contactPhone || '-',
    service: vendor.serviceType || '-',
    status: mapVendorStatus(status),
  };
}

function mapVendorEntity(vendor: BackendVendor): Vendor {
  const status = vendor.availabilityStatus || vendor.status;
  const vendorName = vendor.vendorName || vendor.name || 'Unnamed vendor';

  return {
    id: vendor.id,
    eventId: vendor.eventId || '',
    vendorName,
    name: vendorName,
    contactPerson: vendor.contactPerson || '',
    serviceType: vendor.serviceType || '',
    typeOfSupply: vendor.typeOfSupply || '',
    servicesOffered: vendor.servicesOffered || '',
    pricing: vendor.pricing || '',
    price: vendor.price ?? null,
    availabilityStatus: String(vendor.availabilityStatus || status || 'inactive'),
    lastEventHandled: vendor.lastEventHandled || '',
    notes: vendor.notes || '',
    contactEmail: vendor.email || vendor.contactEmail || '',
    contactPhone: vendor.contactNumber || vendor.contactPhone || '',
    status: String(status || 'inactive'),
    createdAt: vendor.createdAt,
    updatedAt: vendor.updatedAt,
  };
}

export async function createVendor(payload: CreateVendorPayload): Promise<Vendor> {
  const response = await axiosInstance.post('/vendors', payload);
  return mapVendorEntity(response.data.vendor || {});
}

export async function getVendors(eventId?: string): Promise<Vendor[]> {
  const response = await axiosInstance.get('/vendors', {
    params: eventId ? { eventId } : undefined,
  });
  const vendors: BackendVendor[] = response.data.vendors || [];
  return vendors.map(mapVendorEntity);
}

export async function getVendorById(vendorId: string): Promise<Vendor> {
  const response = await axiosInstance.get(`/vendors/${vendorId}`);
  return mapVendorEntity(response.data.vendor || {});
}

export async function updateVendor(
  vendorId: string,
  payload: UpdateVendorPayload
): Promise<Vendor> {
  const response = await axiosInstance.put(`/vendors/${vendorId}`, payload);
  return mapVendorEntity(response.data.vendor || {});
}

export async function deleteVendor(vendorId: string): Promise<void> {
  await axiosInstance.delete(`/vendors/${vendorId}`);
}

export async function getVendorsByEventId(eventId: string): Promise<EventManagerVendor[]> {
  if (!eventId) {
    return [];
  }

  const response = await axiosInstance.get(`/vendors/event/${eventId}`);
  const vendors = response.data.vendors || [];
  return vendors.map(mapVendor);
}

export async function getVendorEntitiesByEventId(eventId: string): Promise<Vendor[]> {
  if (!eventId) {
    return [];
  }

  const response = await axiosInstance.get(`/vendors/event/${eventId}`);
  const vendors: BackendVendor[] = response.data.vendors || [];
  return vendors.map(mapVendorEntity);
}

export async function getVendorsByEventIds(eventIds: string[]): Promise<EventManagerVendor[]> {
  if (!eventIds.length) {
    return [];
  }

  const responses = await Promise.all(eventIds.map((eventId) => getVendorsByEventId(eventId)));
  const deduped = new Map<string, EventManagerVendor>();

  responses.flat().forEach((vendor) => {
    deduped.set(vendor.id, vendor);
  });

  return Array.from(deduped.values());
}

export async function assignVendorToEvent(vendorId: string, eventId: string) {
  const response = await axiosInstance.post(`/vendors/${vendorId}/assign-event`, { eventId });
  return response.data;
}

export async function unassignVendorFromEvent(vendorId: string) {
  const response = await axiosInstance.delete(`/vendors/${vendorId}/unassign-event`);
  return response.data;
}

export async function getVendorAssignedEvents(vendorId: string) {
  const response = await axiosInstance.get(`/vendors/${vendorId}/events`);
  return Array.isArray(response.data) ? response.data : response.data.events || [];
}

export interface VendorWorker {
  id: string;
  vendorId: string;
  workerName: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  contactNumber: string;
  jobTitle: string;
  status: string;
  eventId?: string;
  notes?: string;
}

export async function getVendorWorkersList(vendorId: string): Promise<VendorWorker[]> {
  const response = await axiosInstance.get(`/vendors/${vendorId}/workers`);
  const workers = response.data.workers || response.data || [];
  return workers.map((w: Record<string, string | undefined>) => ({
    id: w.id || w.workerId || '',
    vendorId: w.vendorId || vendorId,
    workerName: w.workerName || `${w.firstName || ''} ${w.lastName || ''}`.trim() || 'Worker',
    firstName: w.firstName || w.workerName?.split(' ')[0] || '',
    lastName: w.lastName || w.workerName?.split(' ').slice(1).join(' ') || '',
    role: w.role || '',
    email: w.email || '',
    contactNumber: w.contactNumber || w.contactPhone || '',
    jobTitle: w.jobTitle || '',
    status: String(w.status || w.availabilityStatus || 'Active'),
    eventId: w.eventId || '',
    notes: w.notes || '',
  }));
}

export interface VendorEvent {
  eventId: string;
  title: string;
  status: string;
  startDate?: string;
  eventDate?: string;
}

export async function getVendorEventHistory(vendorId: string): Promise<VendorEvent[]> {
  const response = await axiosInstance.get(`/vendors/${vendorId}/events`);
  const events = Array.isArray(response.data) ? response.data : response.data.events || [];
  return events.map((e: Record<string, string | undefined>) => ({
    eventId: e.eventId || e.id || '',
    title: e.title || e.eventTitle || 'Untitled Event',
    status: e.status || 'Unknown',
    startDate: e.startDate || '',
    eventDate: e.eventDate || '',
  }));
}

export async function createVendorWorker(
  vendorId: string,
  payload: {
    workerName: string;
    role?: string;
    contactNumber?: string;
    email?: string;
    jobTitle?: string;
    availabilityStatus?: string;
    notes?: string;
  }
): Promise<unknown> {
  const response = await axiosInstance.post(`/vendors/${vendorId}/workers`, payload);
  return response.data;
}

export async function deleteVendorWorker(vendorId: string, workerId: string): Promise<void> {
  await axiosInstance.delete(`/vendors/${vendorId}/workers/${workerId}`);
}
