import api from './axios-instance';

export interface CostBreakdownPayload {
  packagePricePerPax: number;
  eventPax: number;
  manpowerCost: number;
  additionalCharges: number;
}

export const createCostBreakdown = async (eventId: string, data: CostBreakdownPayload) => {
  const response = await api.post(`/api/events/${eventId}/cost-breakdown`, data);
  return response.data;
};

export const getCostBreakdown = async (eventId: string) => {
  const response = await api.get(`/api/events/${eventId}/cost-breakdown`);
  return response.data;
};

export const updateCostBreakdown = async (eventId: string, data: CostBreakdownPayload) => {
  const response = await api.put(`/api/events/${eventId}/cost-breakdown`, data);
  return response.data;
};

export const exportCostBreakdown = async (eventId: string) => {
  const response = await api.get(`/api/events/${eventId}/cost-breakdown/export`, {
    responseType: 'blob', // Important for downloading files
  });
  return response.data;
};
