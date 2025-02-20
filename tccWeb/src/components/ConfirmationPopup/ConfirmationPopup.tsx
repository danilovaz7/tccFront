// components/ConfirmationPopup.tsx
import React from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex  items-center justify-center bg-opacity-50 bg-b ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <p className="text-lg text-black mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
