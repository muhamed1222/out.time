import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = 'info') => {
    setToast({ message, variant });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext; 