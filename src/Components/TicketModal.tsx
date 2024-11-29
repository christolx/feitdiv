import React, { useState, useEffect } from 'react';
import { fetchWithToken } from '../utils/api'; // Fungsi fetch yang sudah Anda buat
import PaymentModal from './PaymentModal';

interface TicketModalProps {
  ticketId: string; // ID tiket yang diterima dari parent component
  onClose: () => void; // Fungsi untuk menutup modal

}

const TicketModal: React.FC<TicketModalProps> = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [paymentVaNumber, setPaymentVaNumber] = useState<string | null>(null);

  useEffect(() => {
    console.log('TicketModal useEffect triggered with ticketId:', ticketId);

    if (ticketId) {
      setLoading(true);
      setError(null);
      console.log('Fetching ticket data from API...');

      // Mengambil data tiket berdasarkan ticket_id
      fetchWithToken(`http://localhost:3000/tickets/get-ticket/${ticketId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Ticket data received:', data);
          if (data.message) {
            setError(data.message); // Menangani error jika tiket tidak ditemukan
            setTicket(null);
          } else {
            setTicket(data); // Menyimpan data tiket yang ditemukan
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching ticket:', err);
          setError('Failed to fetch ticket');
          setLoading(false);
        });
    }
  }, [ticketId]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mengirim permintaan untuk membuat transaksi
      const response = await fetchWithToken('http://localhost:3000/transaction/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          gross_amount: ticket.ticket_price, // Sesuaikan dengan harga tiket
          bank: 'bca', // Misal, jika memilih bank BCA (harus dinamis berdasarkan input pengguna)
        }),
      });
  
      const data = await response.json();
      console.log('Transaction response from backend:', data);
  
      // Jika transaksi berhasil, kita akan mendapatkan VA number untuk pembayaran bank transfer
      if (data.transaction?.va_numbers) {
        const vaNumbers = data.transaction.va_numbers;
        // Tampilkan nomor virtual account untuk pembayaran bank transfer
        const vaNumber = vaNumbers.length > 0 ? vaNumbers[0].va_number : null;
  
        if (vaNumber) {
          console.log('Received VA Number:', vaNumber);
          setPaymentVaNumber(vaNumber);
          setShowPaymentModal(true);
      
          // Tampilkan nomor VA kepada pengguna
        } else {
          setError('Bank transfer details not available');
        }
      } else if (data.transaction?.token) {
        // Jika ada token (misalnya pembayaran menggunakan Snap)
        const snapToken = data.transaction.token;
        console.log('Received Snap Token:', snapToken);
  
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            console.log('Payment successful', result);
            alert('Payment successful!');
          },
          onPending: function (result: any) {
            console.log('Payment pending', result);
            alert('Payment pending');
          },
          onError: function (result: any) {
            console.log('Payment error', result);
            alert('Payment error');
          },
          onClose: function () {
            console.log('Payment popup closed');
            alert('Payment popup closed');
          },
        });
      } else {
        setError('Transaction failed: No valid response from backend');
      }
    } catch (error) {
      setError('Error processing transaction: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center text-black">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      {/* Modal Container */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-3xl text-black animate__animated animate__fadeIn animate__faster">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
        >
          {/* Icon Close (X) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {ticket ? (
          <div className="space-y-6">
            {/* Movie Title */}
            <h2 className="text-3xl font-semibold text-center text-gray-800">
              {ticket.movie_name}
            </h2>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-semibold">Theater:</span>
                <span>{ticket.theater_name}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-semibold">Showtime:</span>
                <span>{ticket.showtime}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-semibold">Seat Number:</span>
                <span>{ticket.seat_number}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-semibold">Ticket Price:</span>
                <span className="text-green-600 font-semibold">${ticket.ticket_price}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-semibold">Status:</span>
                <span
                  className={`font-semibold ${ticket.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Pay Now Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handlePayment}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Pay Now
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">No ticket details available</p>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && paymentVaNumber && (
        <PaymentModal
          vaNumber={paymentVaNumber}
          onClose={() => setShowPaymentModal(false)}
          isOpen={showPaymentModal}
        />
      )}
    </div>
  );
};

export default TicketModal;