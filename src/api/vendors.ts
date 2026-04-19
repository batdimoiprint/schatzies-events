import axiosInstance from './axios-instance';

export type VendorStatus = 'Active' | 'Inactive';

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

export async function getVendorsByEventId(eventId: string): Promise<EventManagerVendor[]> {
  if (!eventId) {
    return [];
  }

  const response = await axiosInstance.get(`/events/${eventId}/vendors`);
  const vendors = response.data.vendors || [];
  return vendors.map(mapVendor);
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
