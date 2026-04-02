import api from '../services/api';

export const generateBookingID = async (agentName = 'TP') => {
  const { data, error } = await api.get(`/reference-id/index.php?type=booking&agent_name=${encodeURIComponent(agentName)}`);
  if (error || !data?.reference_id) {
    throw new Error('Failed to generate booking reference ID');
  }
  return data.reference_id;
};

export const generateSubBookingID = async (type) => {
  const apiType = type === 'tour' ? 'tour' : 'transfer';
  const { data, error } = await api.get(`/reference-id/index.php?type=${apiType}`);
  if (error || !data?.reference_id) {
    throw new Error(`Failed to generate ${type} reference ID`);
  }
  return data.reference_id;
};
