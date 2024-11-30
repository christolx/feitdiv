import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Showtime } from '../Interface/interfacemovie';

const ShowtimesPage: React.FC = () => {
  const { theater_id } = useParams(); // Get theater_id from URL params
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!theater_id) return; // If no theater_id in the params, don't fetch

      try {
        const response = await fetch('http://localhost:3000/showtimes/get-all-showtimes');
        if (!response.ok) {
          throw new Error('Failed to fetch showtimes');
        }
        const data: Showtime[] = await response.json();
        // Filter showtimes to match the theater_id from the URL param
        const filteredShowtimes = data.filter(showtime => showtime.theater_id === Number(theater_id));
        setShowtimes(filteredShowtimes);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [theater_id]); // Re-fetch whenever the theater_id changes

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Movie Showtimes
        </h1>

        {/* Show Loading or Error */}
        {loading && <p className="text-center text-gray-300">Loading showtimes...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Showtimes List */}
        <div className="space-y-8">
          {showtimes.length > 0 ? (
            showtimes.map((showtime) => (
              <div key={showtime.showtime_id} className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{showtime.movie_name}</h3>
                    <p className="text-gray-400 mb-4">Theater: {showtime.theater_name}</p>
                    <p className="text-gray-400 mb-4">Showtime: {new Date(showtime.showtime).toLocaleString()}</p>
                    <p className="text-gray-400 mb-4">Available Seats: {showtime.available_seats}</p>
                  </div>
                  <button className="px-6 py-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors">
                    Book Ticket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No showtimes available for this theater.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShowtimesPage;
