import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const VARIANTS = {
  success: {
    icon: CheckCircleIcon,
    bg: 'bg-gradient-success',
    text: 'text-white',
  },
  error: {
    icon: XCircleIcon,
    bg: 'bg-gradient-danger',
    text: 'text-white',
  },
  warning: {
    icon: ExclamationCircleIcon,
    bg: 'bg-gradient-warning',
    text: 'text-white',
  },
  info: {
    icon: InformationCircleIcon,
    bg: 'bg-gradient-primary',
    text: 'text-white',
  },
};

const Toast = ({ message, variant = 'info', onClose, autoClose = 5000 }) => {
  const { icon: Icon, bg, text } = VARIANTS[variant] || VARIANTS.info;

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return createPortal(
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 ${bg} ${text} rounded-lg p-4 shadow-lg animate-toast-in`}
      role="alert"
    >
      <Icon className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 rounded-full p-1 hover:bg-white/20 transition-colors"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>,
    document.body
  );
};

export default Toast; 