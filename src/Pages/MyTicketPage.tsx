import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';


interface Ticket {
    ticket_id: number;
    movie_name: string;
    poster_link: string;
    theater_name: string;
    showtime: string;
    seat_number: string;
    ticket_price: number;
}

const UserTickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserTickets = async (): Promise<void> => {
        try {
            const response = await fetchWithToken('http://localhost:3000/tickets/user', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }

            const data = await response.json();
            setTickets(data);
        } catch (error: any) {
            setError(error.toString());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserTickets();
    }, []);

    if (loading) {
        return <div className="text-center text-xl text-gray-700">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-xl text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">My Tickets</h2>
            {tickets.length === 0 ? (
                <p className="text-center text-xl text-gray-500">No tickets purchased yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => {
                        return (
                            <div key={ticket.ticket_id} className="flex bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out relative overflow-hidden">
                                <img src={ticket.poster_link} alt={ticket.movie_name} className="w-24 h-24 rounded-full mr-4 object-cover" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">{ticket.movie_name}</h3>
                                    <p className="text-white">{ticket.theater_name}</p>
                                    <p className="text-white">{ticket.showtime}</p>
                                    <p className="text-white">Seat: {ticket.seat_number}</p>
                                    <p className="font-bold text-lg text-yellow-400">Rp {ticket.ticket_price}</p>
                                </div>
                                <div className="absolute inset-0 w-px bg-white bg-opacity-50 left-28 top-3 bottom-3"></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserTickets;