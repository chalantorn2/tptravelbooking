import api from '../services/api';

export const generateBookingID = async (agentName = 'TP') => {
  const prefix = agentName.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${dateStr}-${random}`;
};

export const generateSubBookingID = async (type) => {
  const prefix = type === 'tour' ? 'T' : 'TR';
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${dateStr}-${random}`;
};
