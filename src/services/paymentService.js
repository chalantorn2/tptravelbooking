import api from './api';

// Fetch all tour bookings with booking data + finance totals (for Payment page)
export const fetchAllTourBookingsInRange = async (startDate = null, endDate = null) => {
  const params = ['list=all'];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);

  const { data, error } = await api.get(`/tour-bookings/index.php?${params.join('&')}`);
  if (error) return [];
  return data || [];
};

// Fetch all transfer bookings with booking data + finance totals (for Payment page)
export const fetchAllTransferBookingsInRange = async (startDate = null, endDate = null) => {
  const params = ['list=all'];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);

  const { data, error } = await api.get(`/transfer-bookings/index.php?${params.join('&')}`);
  if (error) return [];
  return data || [];
};
