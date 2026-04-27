import axiosInstance from './axios-instance';

// Current Interface for Organizer Table Display
export interface EventWorker {
  id: string;
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
  const response = await axiosInstance.get('/workers');
  return response.data.workers || [];
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
