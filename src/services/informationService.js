import api from './api';

export const fetchInformationByCategory = async (category) => {
  const { data, error } = await api.get(`/information/index.php?category=${category}`);
  if (error) return { data: [], error };
  return { data: data || [], error: null };
};

export const fetchAllInformation = async () => {
  const { data, error } = await api.get('/information/index.php');
  if (error) return { data: [], error };
  return { data: data || [], error: null };
};

export const addInformation = async (infoData) => {
  const { data, error } = await api.post('/information/index.php', infoData);
  if (error) return { data: null, error };
  return { data, error: null };
};

export const updateInformation = async (id, infoData) => {
  const { data, error } = await api.put('/information/index.php', { id, ...infoData });
  if (error) return { success: false, error };
  return { success: true, error: null };
};

export const deleteInformation = async (id) => {
  const { data, error } = await api.delete(`/information/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true, error: null };
};
