import axiosInstance from './axios-instance';

export const fetchDashboardSummary = async () => {
  try {
    console.log('Fetching dashboard summary...'); // Debug step 1
    const response = await axiosInstance.get('/dashboard/summary');
    console.log('API Response Success:', response.data); // Debug step 2
    return response.data.summary;
  } catch (error) {
    console.error('API Error fetching dashboard summary:', error); // Debug step 3
    return null;
  }
};
