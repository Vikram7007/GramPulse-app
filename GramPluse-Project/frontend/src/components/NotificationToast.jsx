import toast from 'react-hot-toast';

const toastStyle = {
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  fontFamily: 'Inter, sans-serif',
};

export const notifySuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...toastStyle,
      background: '#10b981', // primary-500
      color: 'white',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#10b981',
    },
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...toastStyle,
      background: '#ef4444', // red-500
      color: 'white',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#ef4444',
    },
  });
};

export const notifyInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      ...toastStyle,
      background: '#3b82f6', // blue-500
      color: 'white',
    },
  });
};