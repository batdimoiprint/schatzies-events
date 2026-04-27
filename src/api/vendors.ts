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
