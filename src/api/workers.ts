import axiosInstance from './axios-instance';

// Current Interface for Organizer Table Display
export interface EventWorker {
  id: string;
  vendorId: string; // Required for assign/unassign endpoints
  eventId?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

// Payload Interface based on your Swagger for Admin (Create/Update)
export interface WorkerPayload {
  workerName?: string;
  role?: string;
  contactNumber?: string;
  email?: string;
  jobTitle?: string;
  availabilityStatus?: string;
  eventId?: string;
  notes?: string;
}

// FOR ORGANIZER USE

// Fetch all workers for the table display
export const getWorkers = async (): Promise<EventWorker[]> => {
  const response = await axiosInstance.get('/vendors/workers');
  // Map safely in case backend returns slightly different keys
  const workers = response.data.workers || response.data || [];
  return workers.map((w: Record<string, string | undefined>) => ({
    id: w.id || w.workerId,
    vendorId: w.vendorId || '',
    eventId: w.eventId || '',
    firstName: w.firstName || w.workerName?.split(' ')[0] || 'Worker',
    lastName: w.lastName || w.workerName?.split(' ').slice(1).join(' ') || '',
    email: w.email || '-',
    role: w.role || '-',
    status: String(w.status || w.availabilityStatus || 'Inactive'),
  }));
};

// FOR ADMIN USE

// Retrieve all workers for a specific vendor
export const getVendorWorkers = async (vendorId: string) => {
  const response = await axiosInstance.get(`/vendors/${vendorId}/workers`);
  return response.data;
};

// Create a new worker for a vendor
export const createWorker = async (vendorId: string, data: WorkerPayload) => {
  const response = await axiosInstance.post(`/vendors/${vendorId}/workers`, data);
  return response.data;
};

// Retrieve a specific worker by ID for a vendor
export const getWorkerById = async (vendorId: string, workerId: string) => {
  const response = await axiosInstance.get(`/vendors/${vendorId}/workers/${workerId}`);
  return response.data;
};

// Update a worker for a vendor
export const updateWorker = async (vendorId: string, workerId: string, data: WorkerPayload) => {
  const response = await axiosInstance.put(`/vendors/${vendorId}/workers/${workerId}`, data);
  return response.data;
};

// Delete a worker for a vendor
export const deleteWorker = async (vendorId: string, workerId: string) => {
  const response = await axiosInstance.delete(`/vendors/${vendorId}/workers/${workerId}`);
  return response.data;
};

// Assign an existing worker to an event
export const assignWorkerToEvent = async (vendorId: string, workerId: string, eventId: string) => {
  const response = await axiosInstance.post(
    `/vendors/${vendorId}/workers/${workerId}/assign-event`,
    { eventId }
  );
  return response.data;
};

// Unassign a worker from its current event
export const unassignWorkerFromEvent = async (vendorId: string, workerId: string) => {
  const response = await axiosInstance.delete(
    `/vendors/${vendorId}/workers/${workerId}/unassign-event`
  );
  return response.data;
};

export async function getWorkerAssignedEvents(workerId: string) {
  const response = await axiosInstance.get(`/vendors/workers/${workerId}/events`);
  return Array.isArray(response.data) ? response.data : response.data.events || [];
}
