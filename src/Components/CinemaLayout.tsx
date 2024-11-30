import React, { useEffect, useState } from 'react';
import { SeatReservation } from '../Interface/interfacemovie';
import { fetchWithToken } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface SeatLayoutProps {
  showtime_id: string;
  onClose: () => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ showtime_id, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const rows = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithToken(
          `http://localhost:3000/seats/get-seat-reservations/${showtime_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 401) {
          setError('Authentication failed. Please log in.');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reservations: SeatReservation[] = await response.json();

        const reservedSeatNumbers = new Set(
          reservations
            .filter((reservation) => reservation.reservation_status === 'Reserved')
            .map((reservation) => reservation.seat_number)
        );

        setUserId(1);

        setReservedSeats(reservedSeatNumbers);
      } catch (error) {
        console.error('Error fetching seat reservations:', error);
        setError('Unable to fetch reserved seats. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (showtime_id) {
      fetchReservations();
    }
  }, [showtime_id]);

  const handleSeatClick = (seat: string) => {
    // If the seat is reserved, do nothing
    if (reservedSeats.has(seat)) return;

    // Toggle seat selection
    const updatedSeats = new Set(selectedSeats);
    if (updatedSeats.has(seat)) {
      updatedSeats.delete(seat);
    } else {
      updatedSeats.add(seat);
    }
    setSelectedSeats(updatedSeats);
  };

  const handleConfirmSelection = async () => {
    if (!userId || selectedSeats.size === 0) return;

    setIsSubmitting(true);

    try {
      const seatArray = Array.from(selectedSeats);

      // Log selected seats
      console.log('Selected seats:', seatArray);

      // First: Create seat reservation payload
      const reservationPayload = seatArray.map((seat) => ({
        user_id: userId,               // First: user_id (integer)
        showtime_id: parseInt(showtime_id), // Second: showtime_id (integer)
        seat_number: seat,             // Third: seat_number (string)
        reservation_status: 'Reserved', // Reserved status for reservation
      }));

      // Log the reservation payload
      console.log('Reservation payload to be sent to the API:', reservationPayload);

      // Step 1: Reserve seats
      const reservationPromises = reservationPayload.map((data) =>
        fetchWithToken('http://localhost:3000/seats/add-seat-reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      );

      const reservationResponses = await Promise.all(reservationPromises);

      // Check if all seat reservations were successful
      const allReservationsSuccessful = reservationResponses.every(
        (response) => response.ok
      );

      if (!allReservationsSuccessful) {
        const failedCount = reservationResponses.filter(
          (response) => !response.ok
        ).length;
        throw new Error(`Failed to reserve ${failedCount} seat(s). Please try again.`);
      }

      // Second: Create ticket booking payload
      const ticketPayload = seatArray.map((seat) => ({
        user_id: userId,               // First: user_id (integer)
        showtime_id: parseInt(showtime_id), // Second: showtime_id (integer)
        seat_number: seat,             // Third: seat_number (string)
        ticket_price: 45000,           // Fourth: ticket_price (positive float)
        status: 'Booked',              // Fifth: status ('Booked')
      }));

      
      console.log('Ticket payload to be sent to the API:', ticketPayload);

     
      const ticketPromises = ticketPayload.map((data) =>
        fetchWithToken('http://localhost:3000/tickets/add-ticket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      );

      const ticketResponses = await Promise.all(ticketPromises);

      
      const allTicketsBooked = ticketResponses.every((response) => response.ok);

      if (allTicketsBooked) {
        alert('Seats reserved and tickets booked successfully!');
        setSelectedSeats(new Set());
        onClose();
      } else {
        const failedCount = ticketResponses.filter(
          (response) => !response.ok
        ).length;
        alert(`Failed to book ${failedCount} ticket(s). Please try again.`);
      }
    } catch (error) {
      console.error('Error confirming seat reservation and ticket booking:', error);
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSeatSection = (start: number, end: number, row: string) => {
    return Array.from({ length: end - start + 1 }, (_, seatIndex) => {
      const seatNumber = `${row}${start + seatIndex}`;
      const seatColor = reservedSeats.has(seatNumber)
        ? 'bg-red-500 cursor-not-allowed'
        : selectedSeats.has(seatNumber)
        ? 'bg-green-500'
        : 'bg-gray-700';

      return (
        <button
          key={seatNumber}
          className={`w-12 h-12 rounded-lg ${seatColor} 
            hover:bg-green-600 transition-colors flex items-center justify-center`}
          onClick={() => handleSeatClick(seatNumber)}
          disabled={reservedSeats.has(seatNumber)}
        >
          {seatNumber}
        </button>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading seat reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mb-4">{error}</p>
        {error === 'Authentication failed. Please log in.' ? (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-6">Select Your Seats</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="w-[800px] bg-gray-700 h-20 mb-8 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">Screen</span>
        </div>

        <div className="flex space-x-10 w-full max-w-4xl">
          <div className="flex-1">
            {rows.map((row) => (
              <div key={row} className="flex space-x-2 mb-2">
                {renderSeatSection(1, 6, row)}
              </div>
            ))}
          </div>
          <div className="w-16 rounded-full bg-round flex items-center justify-center">
            <div className="text-white text-sm font-semibold flex flex-col gap-5 mb-3">
              {rows.map((row) => (
                <span key={row} className="my-2">
                  {row}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1">
            {rows.map((row) => (
              <div key={row} className="flex space-x-2 mb-2">
                {renderSeatSection(7, 12, row)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleConfirmSelection}
          disabled={isSubmitting || selectedSeats.size === 0}
          className={`px-6 py-3 rounded-lg text-lg ${
            isSubmitting || selectedSeats.size === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Selection'}
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
