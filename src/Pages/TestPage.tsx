import React, { useState } from 'react';
import TicketModal from '../Components/TicketModal';

const Testing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleOpenModal = (id: string) => {
    setTicketId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-black">
      <h1 className="text-4xl text-center font-bold py-4 text-white">Ticket Details</h1>

      {/* Input untuk memasukkan ticket_id */}
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="Enter Ticket ID"
        className="mb-4 p-2 rounded"
      />

      <button
        onClick={() => handleOpenModal(ticketId)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
      >
        View Ticket Detail
      </button>

      {/* Modal */}
      {isModalOpen && <TicketModal ticketId={ticketId} onClose={handleCloseModal} />}
    </div>
  );
};

export default Testing;