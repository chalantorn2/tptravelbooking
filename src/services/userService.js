import api from './api';

export const fetchUsers = async () => {
  const { data, error } = await api.get('/users/index.php');
  if (error) return { success: false, error };
  return { success: true, users: data || [] };
};

export const createUser = async (userData) => {
  const { data, error } = await api.post('/users/index.php', userData);
  if (error) return { success: false, error };
  return { success: true, user: data };
};

export const updateUser = async (userData) => {
  const { data, error } = await api.put('/users/index.php', userData);
  if (error) return { success: false, error };
  return { success: true };
};

export const deleteUser = async (id) => {
  const { data, error } = await api.delete(`/users/index.php?id=${id}`);
  if (error) return { success: false, error };
  return { success: true };
};
