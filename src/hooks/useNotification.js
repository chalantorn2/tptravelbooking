import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }, []);

  const showSuccess = useCallback((msg) => show(msg, 'success'), [show]);
  const showError = useCallback((msg) => show(msg, 'error', 5000), [show]);
  const showInfo = useCallback((msg) => show(msg, 'info'), [show]);

  return { notification, showSuccess, showError, showInfo, setNotification };
};
