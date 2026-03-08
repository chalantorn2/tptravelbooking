import api from './api';

export const loginUser = async (username, password) => {
  const { data, error } = await api.post('/auth/login.php', { username, password });
  if (error) return { success: false, error };
  return { success: true, user: data.user };
};

export const verifyUser = async (userId) => {
  const { data, error } = await api.post('/auth/verify.php', { user_id: userId });
  if (error) return { success: false, error };
  return { success: true, user: data.user };
};
