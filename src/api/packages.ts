import axiosInstance from './axios-instance';

export const EVENT_TYPES = ['Wedding', 'Debut'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Suggested inclusion categories; the backend accepts any free-form type */
export const INCLUSION_TYPE_SUGGESTIONS = [
  'Professional Coordination',
  'Catering & Dining',
  'Styling & Production',
  'Media & Glamour',
  'Reception Styling',
] as const;
export type InclusionType = string;

export interface PackageImage {
  key: string;
  url: string;
}

export interface PackagePax {
  id: string;
  pax: number;
  paxPrice: number;
  note?: string;
}

export interface PackageInclusion {
  id: string;
  inclusionType: InclusionType;
  inclusion: string;
  sortOrder?: number;
}

export interface EventPackage {
  id: string;
  eventType: EventType;
  packageName: string;
  description?: string;
  images: PackageImage[];
  pax?: PackagePax[];
  inclusions?: PackageInclusion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PackagePayload {
  eventType: EventType;
  packageName: string;
  description?: string;
  images?: File[];
  existingImages?: PackageImage[];
}

const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

function toFormData(payload: Partial<PackagePayload>): FormData {
  const formData = new FormData();
  if (payload.eventType) formData.append('eventType', payload.eventType);
  if (payload.packageName) formData.append('packageName', payload.packageName);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.existingImages !== undefined) {
    formData.append('existingImages', JSON.stringify(payload.existingImages));
  }
  payload.images?.forEach((file) => formData.append('images', file));
  return formData;
}

export async function getPackages(eventType?: EventType): Promise<EventPackage[]> {
  const response = await axiosInstance.get('/packages', {
    params: eventType ? { eventType } : undefined,
  });
  return response.data.packages ?? [];
}

export async function getPackageById(id: string): Promise<EventPackage> {
  const response = await axiosInstance.get(`/packages/${id}`);
  return response.data.package;
}

export async function createPackage(payload: PackagePayload): Promise<EventPackage> {
  const response = await axiosInstance.post('/packages', toFormData(payload), multipartConfig);
  return response.data.package;
}

export async function updatePackage(
  id: string,
  payload: Partial<PackagePayload>
): Promise<EventPackage> {
  const response = await axiosInstance.patch(
    `/packages/${id}`,
    toFormData(payload),
    multipartConfig
  );
  return response.data.package;
}

export async function deletePackage(id: string): Promise<void> {
  await axiosInstance.delete(`/packages/${id}`);
}

// ---- Pax tiers ----

export async function addPackagePax(
  packageId: string,
  payload: Omit<PackagePax, 'id'>
): Promise<PackagePax> {
  const response = await axiosInstance.post(`/packages/${packageId}/pax`, payload);
  return response.data.pax;
}

export async function updatePackagePax(
  packageId: string,
  paxId: string,
  payload: Partial<Omit<PackagePax, 'id'>>
): Promise<PackagePax> {
  const response = await axiosInstance.patch(`/packages/${packageId}/pax/${paxId}`, payload);
  return response.data.pax;
}

export async function deletePackagePax(packageId: string, paxId: string): Promise<void> {
  await axiosInstance.delete(`/packages/${packageId}/pax/${paxId}`);
}

// ---- Inclusions ----

export async function addPackageInclusion(
  packageId: string,
  payload: Omit<PackageInclusion, 'id'>
): Promise<PackageInclusion> {
  const response = await axiosInstance.post(`/packages/${packageId}/inclusions`, payload);
  return response.data.inclusion;
}

export async function updatePackageInclusion(
  packageId: string,
  inclusionId: string,
  payload: Partial<Omit<PackageInclusion, 'id'>>
): Promise<PackageInclusion> {
  const response = await axiosInstance.patch(
    `/packages/${packageId}/inclusions/${inclusionId}`,
    payload
  );
  return response.data.inclusion;
}

export async function deletePackageInclusion(
  packageId: string,
  inclusionId: string
): Promise<void> {
  await axiosInstance.delete(`/packages/${packageId}/inclusions/${inclusionId}`);
}

export async function copyPackageInclusions(
  targetPackageId: string,
  sourcePackageId: string,
  inclusionIds?: string[]
): Promise<PackageInclusion[]> {
  const response = await axiosInstance.post(`/packages/${targetPackageId}/inclusions/copy`, {
    sourcePackageId,
    inclusionIds,
  });
  return response.data.inclusions;
}

export async function reorderPackageInclusions(
  packageId: string,
  inclusionIds: string[]
): Promise<PackageInclusion[]> {
  const response = await axiosInstance.put(`/packages/${packageId}/inclusions/reorder`, {
    inclusionIds,
  });
  return response.data.inclusions;
}
