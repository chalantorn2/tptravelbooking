import React from 'react';

// Global notification state (simple approach without external lib)
let _setNotification = null;

export const notify = {
  success: (msg) => _setNotification?.({ message: msg, type: 'success' }),
  error: (msg) => _setNotification?.({ message: msg, type: 'error' }),
  info: (msg) => _setNotification?.({ message: msg, type: 'info' }),
};

const Notification = () => {
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    _setNotification = (n) => {
      setNotification(n);
      setTimeout(() => setNotification(null), n.type === 'error' ? 5000 : 3000);
    };
    return () => { _setNotification = null; };
  }, []);

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[notification.type] || 'bg-blue-500';

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 min-w-[280px]`}>
        <span className="flex-1 text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="text-white/80 hover:text-white text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
