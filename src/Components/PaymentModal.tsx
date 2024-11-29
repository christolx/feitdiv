import React from 'react';

interface PaymentModalProps {
  vaNumber: string;    // VA number yang akan ditampilkan
  onClose: () => void; // Fungsi untuk menutup modal
  isOpen: boolean;     // Status modal, apakah dibuka atau ditutup
}

const PaymentModal: React.FC<PaymentModalProps> = ({ vaNumber, onClose, isOpen }) => {
  if (!isOpen) return null; // Jika modal tidak dibuka, jangan render apa-apa

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 max-w-lg text-black animate__animated animate__fadeIn animate__faster">
        {/* Header Section */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Bank Transfer Details
        </h2>

        {/* Body Section */}
        <p className="text-lg text-center text-gray-600 mt-4">
          To complete your payment, please transfer the amount to the following Virtual Account (VA) number:
        </p>
        
        <div className="text-center mt-6">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6">
            <p className="text-2xl font-semibold text-blue-600">{vaNumber}</p>
            <p className="text-sm text-gray-500">Use this number for your bank transfer.</p>
          </div>
          
          {/* Button Section */}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;