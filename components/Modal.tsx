import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-11/12 rounded-lg bg-white p-6 shadow-lg md:w-1/2 lg:w-1/3">
        <button
          className="absolute right-2 top-2 p-2 text-2xl text-gray-600 hover:text-gray-900"
          onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
