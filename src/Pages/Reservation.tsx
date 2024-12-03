import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Showtime, Theater } from '../Interface/interfacemovie';
import SeatLayout from '../Components/CinemaLayout';

const ReservationPage: React.FC = () => {
  const { movie_id } = useParams<{ movie_id: string }>();
  const location = useLocation();
  const navigate = useNavigate(); 
  const [region, setRegion] = useState<string>('');
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSeatLayout, setShowSeatLayout] = useState<boolean>(false);

  console.log('%cPassed movie_id:', 'color: red;', movie_id);
  console.log('%cPassed region:', 'color: blue;', region);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setRegion(queryParams.get('region') || '');

    const fetchData = async () => {
      try {
        setLoading(true);

        const [showtimesRes, theatersRes] = await Promise.all([
          fetch('http://localhost:3000/showtimes/get-all-showtimes'),
          fetch('http://localhost:3000/theaters/get-theaters'),
        ]);

        if (!showtimesRes.ok || !theatersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const showtimesData: Showtime[] = await showtimesRes.json();
        const theatersData: Theater[] = await theatersRes.json();

        const regionTheaters = theatersData.filter((theater) => theater.location === region);
        setFilteredTheaters(regionTheaters);

        const movieShowtimes = showtimesData.filter((showtime) => showtime.movie_id === Number(movie_id));
        setShowtimes(movieShowtimes);

        const uniqueDates = [
          ...new Set(movieShowtimes.map((s) => new Date(s.showtime).toISOString().split('T')[0])),
        ];
        setDates(uniqueDates);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [movie_id, location, region]);

  const handleTimeSelection = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const selectedShowtime = showtimes.find(
      (showtime) =>
        showtime.theater_name === selectedTheater &&
        new Date(showtime.showtime).toISOString().split('T')[0] === selectedDate &&
        showtime.showtime === selectedTime
    );

    if (selectedShowtime) {
      console.log(`Selected Showtime ID: ${selectedShowtime.showtime_id}`);
      setSelectedShowtimeId(selectedShowtime.showtime_id);
      setShowSeatLayout(true);
    }
  };

  const handleCloseSeatLayout = () => {
    setShowSeatLayout(false);
    setSelectedShowtimeId(null);
  };

  const handleTheaterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheater(e.target.value);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleBackClick = () => {
    navigate('/nowplaying');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 pt-24">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          Back
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-center">Movie Reservation</h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && !showSeatLayout && (
          <>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Select Theater</label>
              <select
                value={selectedTheater}
                onChange={handleTheaterChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Choose a theater</option>
                {filteredTheaters.map((theater) => (
                  <option key={theater.theater_id} value={theater.theater_name}>
                    {theater.theater_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Select Date</label>
              <select
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Choose a date</option>
                {dates.map((date, index) => (
                  <option key={index} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Choose a time</option>
                {showtimes
                  .filter(
                    (showtime) =>
                      showtime.theater_name === selectedTheater &&
                      new Date(showtime.showtime).toISOString().split('T')[0] === selectedDate
                  )
                  .map((showtime) => (
                    <option key={showtime.showtime_id} value={showtime.showtime}>
                      {new Date(showtime.showtime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold">Ticket Price: Rp 45,000</p>
            </div>

            <button
              onClick={handleTimeSelection}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
              disabled={!selectedTheater || !selectedDate || !selectedTime}
            >
              Select Seats
            </button>
          </>
        )}

        {showSeatLayout && selectedShowtimeId && (
          <SeatLayout showtime_id={selectedShowtimeId.toString()} onClose={handleCloseSeatLayout} />
        )}
      </main>
    </div>
  );
};

export default ReservationPage;
