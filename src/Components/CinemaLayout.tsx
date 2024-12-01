import React, { useEffect, useState } from 'react';
import { SeatReservation } from '../Interface/interfacemovie';
import { fetchWithToken } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import TicketModal from './TicketModal';

interface SeatLayoutProps {
    showtime_id: string;
    onClose: () => void;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ showtime_id, onClose }) => {
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
    const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [groupTicketId, setGroupTicketId] = useState<number | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        if (reservedSeats.has(seat)) return;

        const updatedSeats = new Set(selectedSeats);
        if (updatedSeats.has(seat)) {
            updatedSeats.delete(seat);
        } else {
            updatedSeats.add(seat);
        }
        setSelectedSeats(updatedSeats);
    };

    const handleConfirmSelection = async () => {
      if (selectedSeats.size === 0) return;
  
      setIsSubmitting(true);
      let groupTicketId: number | null = null;
  
      try {
          const seatArray = Array.from(selectedSeats);
          const reservationPayload = seatArray.map((seat) => ({
              
              showtime_id: parseInt(showtime_id),
              seat_number: seat,
              reservation_status: 'Reserved',
          }));
  
          const reservationPromises = reservationPayload.map((data) =>
              fetchWithToken('http://localhost:3000/seats/add-seat-reservation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
              })
          );
  
          const reservationResponses = await Promise.all(reservationPromises);
  
          if (!reservationResponses.every((response) => response.ok)) {
              throw new Error('Failed to reserve some seats. Please try again.');
          }
  
          const ticketPayload = seatArray.map((seat) => ({
             
              showtime_id: parseInt(showtime_id),
              seat_number: seat,
              ticket_price: 45000,
              status: 'Booked',
          }));
  
          const ticketPromises = ticketPayload.map((data) =>
              fetchWithToken('http://localhost:3000/tickets/add-ticket', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
              })
          );
  
          const ticketResponses = await Promise.all(ticketPromises);
  
          const resolvedTicketIds = await Promise.all(
              ticketResponses.map(async (response) => {
                  if (response.ok) {
                      const data = await response.json();
                      return data.ticket_id;
                  }
                  return null;
              })
          );
  
          const validTicketIds = resolvedTicketIds.filter((id) => id !== null);
  
          const groupTicketResponse = await fetchWithToken(
              'http://localhost:3000/TicketGroup/add-group-ticket',
              {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ticket_id: validTicketIds }),
              }
          );
  
          if (!groupTicketResponse.ok) {
              throw new Error('Failed to add group ticket. Please try again.');
          }
  
          const groupTicketData = await groupTicketResponse.json();
          groupTicketId = groupTicketData.data.group_ticket_id;
          
          setGroupTicketId(groupTicketId); 
            setIsModalOpen(true); 


          setSelectedSeats(new Set());
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

                
  
            {isModalOpen && groupTicketId && (
                <TicketModal
                    ticketId={groupTicketId.toString()}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            </div>
        </div>
    );
};

export default SeatLayout;
