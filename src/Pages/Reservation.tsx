import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Showtime } from '../Interface/interfacemovie';
import SeatLayout from '../Components/CinemaLayout';

const ReservationPage: React.FC = () => {
  const { movie_id } = useParams<{ movie_id: string }>();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theaters, setTheaters] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSeatLayout, setShowSeatLayout] = useState<boolean>(false);

  console.log('%cPassed movie_id:', 'color: red;', movie_id);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch('http://localhost:3000/showtimes/get-all-showtimes');
        if (!response.ok) {
          throw new Error('Failed to fetch showtimes');
        }
        const data: Showtime[] = await response.json();

        const filteredShowtimes = data.filter((showtime) => showtime.movie_id === Number(movie_id));

        const uniqueTheaters = [...new Set(filteredShowtimes.map((s) => s.theater_name))];
        const uniqueDates = [
          ...new Set(filteredShowtimes.map((s) => new Date(s.showtime).toISOString().split('T')[0])),
        ];

        setShowtimes(filteredShowtimes);
        setTheaters(uniqueTheaters);
        setDates(uniqueDates);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie_id]);

  const handleTimeSelection = () => {
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
    setSelectedShowtimeId(null); // Reset selection states if needed
  };

  const handleTheaterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheater(e.target.value);
    setSelectedDate(''); // Reset date when changing theater
    setSelectedTime(''); // Reset time when changing theater
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reset time when changing date
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 pt-24">
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
                {theaters.map((theater, index) => (
                  <option key={index} value={theater}>
                    {theater}
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
          <SeatLayout
            showtime_id={selectedShowtimeId.toString()}
            onClose={handleCloseSeatLayout}
          />
        )}
      </main>
    </div>
  );
};

export default ReservationPage;
