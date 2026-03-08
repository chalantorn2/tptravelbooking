import api from './api';

// ===== Bookings (parent) =====
export const fetchAllBookings = async (startDate = null, endDate = null, search = null) => {
  let endpoint = '/bookings/index.php?';
  const params = [];
  if (startDate) params.push(`start_date=${startDate}`);
  if (endDate) params.push(`end_date=${endDate}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  endpoint += params.join('&');

  const { data, error } = await api.get(endpoint);
  if (error) return { bookings: [], error };
  return { bookings: data.bookings || [], error: null };
};

export const fetchBookingById = async (id) => {
  const { data, error } = await api.get(`/bookings/index.php?id=${id}`);
  if (error) return { booking: null, error };
  return { booking: data, error: null };
};

export const createBooking = async (bookingData) => {
  const { data, error } = await api.post('/bookings/index.php', bookingData);
  if (error) return { data: null, error };
  return { data, error: null };
};

export const updateBooking = async (id, bookingData) => {
  const { data, error } = await api.put('/bookings/index.php', { id, ...bookingData });
  if (error) return { success: false, error };
  return { success: true, error: null };
};

export const deleteBooking = async (id) => {
  const { data, error } = await api.delete(`/bookings/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true, error: null };
};

// ===== Tour Bookings =====
export const fetchTourBookingsByDate = async (date) => {
  const { data, error } = await api.get(`/tour-bookings/index.php?date=${date}`);
  if (error) return { tourBookings: [], error };
  return { tourBookings: data || [], error: null };
};

export const fetchTourDatesInRange = async (startDate, endDate) => {
  const { data, error } = await api.get(`/tour-bookings/index.php?start_date=${startDate}&end_date=${endDate}`);
  if (error) return [];
  return (data || []).map(d => d.tour_date);
};

export const createTourBooking = async (bookingData) => {
  const { data, error } = await api.post('/tour-bookings/index.php', bookingData);
  if (error) return { data: null, error };
  return { data, error: null };
};

export const updateTourBooking = async (id, bookingData) => {
  const { data, error } = await api.put('/tour-bookings/index.php', { id, ...bookingData });
  if (error) return { success: false, error };
  return { success: true, error: null };
};

export const deleteTourBooking = async (id) => {
  const { data, error } = await api.delete(`/tour-bookings/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true, error: null };
};

// ===== Transfer Bookings =====
export const fetchTransferBookingsByDate = async (date) => {
  const { data, error } = await api.get(`/transfer-bookings/index.php?date=${date}`);
  if (error) return { transferBookings: [], error };
  return { transferBookings: data || [], error: null };
};

export const fetchTransferDatesInRange = async (startDate, endDate) => {
  const { data, error } = await api.get(`/transfer-bookings/index.php?start_date=${startDate}&end_date=${endDate}`);
  if (error) return [];
  return (data || []).map(d => d.transfer_date);
};

export const createTransferBooking = async (bookingData) => {
  const { data, error } = await api.post('/transfer-bookings/index.php', bookingData);
  if (error) return { data: null, error };
  return { data, error: null };
};

export const updateTransferBooking = async (id, bookingData) => {
  const { data, error } = await api.put('/transfer-bookings/index.php', { id, ...bookingData });
  if (error) return { success: false, error };
  return { success: true, error: null };
};

export const deleteTransferBooking = async (id) => {
  const { data, error } = await api.delete(`/transfer-bookings/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true, error: null };
};

// ===== Booking Finances =====
export const fetchBookingFinances = async (bookingType, bookingItemId) => {
  const { data, error } = await api.get(`/booking-finances/index.php?booking_type=${bookingType}&booking_item_id=${bookingItemId}`);
  if (error) return { finances: [], error };
  return { finances: data || [], error: null };
};

export const createBookingFinance = async (financeData) => {
  const { data, error } = await api.post('/booking-finances/index.php', financeData);
  if (error) return { data: null, error };
  return { data, error: null };
};

export const updateBookingFinance = async (id, financeData) => {
  const { data, error } = await api.put('/booking-finances/index.php', { id, ...financeData });
  if (error) return { success: false, error };
  return { success: true, error: null };
};

export const deleteBookingFinance = async (id) => {
  const { data, error } = await api.delete(`/booking-finances/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true, error: null };
};
