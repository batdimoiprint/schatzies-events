import api from './axios-instance';

export interface CostBreakdownPayload {
  packagePrice: number;
  eventPax: number;
  additionalCharges?: number;
}

export interface CostBreakdownResponse {
  costBreakdown_id: string;
  event_id: string;
  packagePrice: number;
  eventPax: number;
  organizerShare: number;
  vendorBudget: number;
  totalVendorCost: number;
  vendorBalance: number;
  organizerTotal: number;
  additionalCharges: number;
}

export const createCostBreakdown = async (eventId: string, data: CostBreakdownPayload) => {
  const response = await api.post(`/events/${eventId}/cost-breakdown`, data);
  return response.data;
};

export const getCostBreakdown = async (eventId: string): Promise<CostBreakdownResponse | null> => {
  const response = await api.get(`/events/${eventId}/cost-breakdown`);
  return response.data?.costBreakdown || null;
};

export const updateCostBreakdown = async (eventId: string, data: CostBreakdownPayload) => {
  const response = await api.put(`/events/${eventId}/cost-breakdown`, data);
  return response.data;
};

export const exportCostBreakdown = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}/cost-breakdown/export`);
  return response.data;
};
