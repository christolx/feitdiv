import React, { useState, useEffect } from 'react';

interface Theater {
  theater_id: number;
  theater_name: string;
  location: string;
  total_seats: number;
}

const TheatersPage: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Alsut');

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await fetch('http://localhost:3000/theaters/get-theaters');
        if (!response.ok) {
          throw new Error('Failed to fetch theaters');
        }
        const data: Theater[] = await response.json();
        setTheaters(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

 
  const filteredTheaters = theaters.filter((theater) => theater.location === selectedCity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
   
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Movie Theaters
        </h1>

      
        <div className="mb-8">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-green-400 outline-none"
          >
            <option value="Alsut">Alsut</option>
            <option value="Kemanggisan">Kemanggisan</option>
            <option value="Malang">Malang</option>
          </select>
        </div>

      
        {loading && <p className="text-center text-gray-300">Loading theaters...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

      
        <div className="space-y-8">
          {filteredTheaters.map((theater) => (
            <div key={theater.theater_id} className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{theater.theater_name}</h3>
                  <p className="text-gray-400 mb-4">Total Seats: {theater.total_seats}</p>
                </div>
                <button className="px-6 py-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors">
                  View Showtimes
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TheatersPage;
