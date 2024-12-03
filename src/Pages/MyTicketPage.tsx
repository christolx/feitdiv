import React, {useEffect, useState} from 'react';
import {fetchWithToken} from '../utils/api';
import { Ticket } from '../Interface/interfacemovie';
import { useNavigate } from 'react-router-dom';

const UserTickets: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            setError('Failed to fetch tickets');  
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


    if (error || tickets.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center text-xl text-white">
                    No tickets are purchased
                    <div className="mt-4">
                        <p className="text-sm text-gray-400">Haven't paid yet?</p>
                        <button
                            onClick={() => navigate('/paymenthistory')}
                            className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-500 transition"
                        >
                            View Payment History
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mx-auto p-6 bg-gradient-to-b from-gray-900 to-black">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-white">My Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => {
                    return (
                        <div key={ticket.ticket_id}
                             className="flex bg-gradient-to-r from-gray-700 via-gray-900 to-yellow-800 p-4 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out relative overflow-hidden">
                            <img src={ticket.poster_link} alt={ticket.movie_name}
                                 className="w-24 h-24 rounded-full mr-4 object-cover"/>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{ticket.movie_name}</h3>
                                <p className="text-white">{ticket.theater_name}</p>
                                <p className="text-white">{ticket.showtime}</p>
                                <p className="text-white">Seat: {ticket.seat_number}</p>
                                <p className="font-bold text-lg text-yellow-400">Rp {ticket.ticket_price}</p>
                            </div>
                           
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserTickets;