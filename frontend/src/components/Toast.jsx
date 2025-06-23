import ReactDOM from 'react-dom';
import React from 'react';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiExclamationTriangle,
} from 'react-icons/hi2';

const icons = {
  success: <HiCheckCircle className="text-white text-xl" />,
  error: <HiExclamationCircle className="text-white text-xl" />,
  info: <HiInformationCircle className="text-white text-xl" />,
  warning: <HiExclamationTriangle className="text-white text-xl" />,
};

const bgColors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-500',
};

const Toast = ({ message, show, type = 'success' }) => {
  const toast = (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-in-out transform ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${bgColors[type]} text-white font-bold px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );

  return ReactDOM.createPortal(toast, document.body);
};

export default Toast;
