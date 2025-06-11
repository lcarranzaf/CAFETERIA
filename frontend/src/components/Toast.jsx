import React from 'react';

const Toast = ({ message, show }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out transform ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}
    >
      <span className="text-xl"></span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
