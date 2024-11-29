import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Theater } from '../Interface/interfacemovie';

const NowPlayingPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]); // Corrected typing
  const [theaters, setTheaters] = useState<Theater[]>([]); // Corrected typing
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDimension, setSelectedDimension] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('Alsut');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showtimesRes, theatersRes] = await Promise.all([
          fetch('http://localhost:3000/films/movies/Tayang'), // Fetching only "Tayang" movies
          fetch('http://localhost:3000/showtimes/get-all-showtimes'),
          fetch('http://localhost:3000/theaters/get-theaters'),
        ]);

        if (!moviesRes.ok || !showtimesRes.ok || !theatersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const moviesData = await moviesRes.json();
        const showtimesData = await showtimesRes.json();
        const theatersData = await theatersRes.json();

        setMovies(moviesData);
        setShowtimes(showtimesData);
        setTheaters(theatersData);
        setFilteredMovies(moviesData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDimension !== 'All') {
      filtered = filtered.filter((movie) => movie.dimension === selectedDimension);
    }

    if (selectedRegion) {
      const regionTheaters = theaters.filter((theater) => theater.location === selectedRegion);

      const regionTheaterIds = regionTheaters.map((theater) => theater.theater_id);

      const regionShowtimes = showtimes.filter((showtime) =>
        regionTheaterIds.includes(showtime.theater_id)
      );
      const regionMovieIds = regionShowtimes.map((showtime) => showtime.movie_id);

      filtered = filtered.filter((movie) => regionMovieIds.includes(movie.movie_id));
    }

    setFilteredMovies(filtered);
  }, [searchQuery, selectedDimension, selectedRegion, movies, theaters, showtimes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search Movies..."
            className="px-4 py-2 w-1/2 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dimension and Region Selection */}
        <div className="flex justify-center space-x-8 mb-8">
          {/* Dimension Selection */}
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedDimension('2D')}
              className={`px-4 py-2 rounded-full ${
                selectedDimension === '2D'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300'
              } hover:bg-green-500 hover:text-white transition-colors`}
            >
              2D
            </button>
            <button
              onClick={() => setSelectedDimension('3D')}
              className={`px-4 py-2 rounded-full ${
                selectedDimension === '3D'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300'
              } hover:bg-green-500 hover:text-white transition-colors`}
            >
              3D
            </button>
          </div>

          {/* Region Selection */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-green-400 outline-none"
          >
            <option value="Alsut">Alsut</option>
            <option value="Kemanggisan">Kemanggisan</option>
            <option value="Malang">Malang</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-center text-gray-300">Loading movies...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Movie List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.movie_id}
              className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all flex flex-col"
            >
              <div className="relative w-full h-[250px] bg-black">
                <img
                  src={movie.poster_link || 'https://via.placeholder.com/300x450'} // Add fallback image
                  alt={movie.movie_name}
                  className="absolute inset-0 w-full h-full object-cover" // Ensures image covers the container area
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2">{movie.movie_name}</h3>
                <p className="text-gray-400 mb-2">Rating: {movie.age_rating}</p>
                <p className="text-gray-400 mb-2">Duration: {movie.duration} minutes</p>
                <p className="text-gray-400 mb-2">Dimension: {movie.dimension}</p>
              </div>

              <button
                onClick={() => window.location.href = `/reservation/${movie.movie_id}`} 
                className="mt-4  py-4  bg-green-500 text-white w-auto hover:bg-green-600 transition-colors"
              >
                Reserve
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NowPlayingPage;
