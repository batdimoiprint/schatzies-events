import axiosInstance from './axios-instance';

export type VendorStatus = 'Active' | 'Inactive';

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  serviceType: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorPayload {
  name: string;
  serviceType: string;
  eventId?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
}

export interface UpdateVendorPayload extends Partial<CreateVendorPayload> {}

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
  name?: string;
  serviceType?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapVendorStatus(status?: string): VendorStatus {
  const normalized = String(status || '').trim().toLowerCase();
  return normalized === 'active' ? 'Active' : 'Inactive';
}

function mapVendor(vendor: BackendVendor): EventManagerVendor {
  return {
    id: vendor.id,
    eventId: vendor.eventId || '',
    name: vendor.name || 'Unnamed vendor',
    contactPerson: '-',
    email: vendor.contactEmail || '-',
    phone: vendor.contactPhone || '-',
    service: vendor.serviceType || '-',
    status: mapVendorStatus(vendor.status),
  };
}

function mapVendorEntity(vendor: BackendVendor): Vendor {
  return {
    id: vendor.id,
    eventId: vendor.eventId || '',
    name: vendor.name || 'Unnamed vendor',
    serviceType: vendor.serviceType || '',
    contactEmail: vendor.contactEmail || '',
    contactPhone: vendor.contactPhone || '',
    status: String(vendor.status || 'inactive'),
    createdAt: vendor.createdAt,
    updatedAt: vendor.updatedAt,
  };
}

export async function createVendor(payload: CreateVendorPayload): Promise<Vendor> {
  const response = await axiosInstance.post('/vendors', payload);
  return mapVendorEntity(response.data.vendor || {});
}

export async function createVendorPool(payload: CreateVendorPayload): Promise<Vendor> {
  const response = await axiosInstance.post('/vendors/pool', payload);
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

export async function updateVendor(vendorId: string, payload: UpdateVendorPayload): Promise<Vendor> {
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
