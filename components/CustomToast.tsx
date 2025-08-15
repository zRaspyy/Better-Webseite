import React from 'react';

type CustomToastProps = {
  message: string;
  onClose: () => void;
};

const CustomToast = ({ message, onClose }: CustomToastProps) => (
  <div className="bg-[#23232a] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
    <span>{message}</span>
    <button
      className="ml-4 text-red-400 hover:text-red-600 font-bold"
      onClick={onClose}
      aria-label="Toast schließen"
    >
      ×
    </button>
  </div>
);

export default CustomToast;
