import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Movie, Showtime, Theater } from '../Interface/interfacemovie';

const NowPlayingPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]); 
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [searchQuery, setSearchQuery] = useState<string>(queryParams.get('search') || '');
    const [selectedDimension, setSelectedDimension] = useState<string>('All');
    const [selectedRegion, setSelectedRegion] = useState<string>(queryParams.get('region') || '');

    const [regions, setRegions] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moviesRes, showtimesRes, theatersRes] = await Promise.all([
                    fetch('http://localhost:3000/films/movies/Tayang'),
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

                const uniqueRegions = [...new Set(theatersData.map((theater: Theater) => theater.location))];
                setRegions(uniqueRegions); 
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

    const updateUrlParams = (newSearchQuery?: string, newRegion?: string) => {
        const queryParams = new URLSearchParams(location.search);

        if (newSearchQuery !== undefined) {
            queryParams.set('search', newSearchQuery);
        }

        if (newRegion !== undefined) {
            queryParams.set('region', newRegion);
        }

        navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    };

    // Image processing function
    const processImage = (imageUrl: string): string => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context?.drawImage(img, 0, 0);
            
            // Example processing: Apply a simple sharpening or resizing
            // Adjust the width/height or apply any filters as needed
            // Example: resizing to a higher resolution or sharpen filter can go here

            // Convert the canvas content to a base64 string to display
            const processedImageUrl = canvas.toDataURL();
            return processedImageUrl;
        };

        return imageUrl; // Default to original if processing isn't done yet
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <main className="container mx-auto px-4 pt-24">
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Search Movies..."
                        className="px-4 py-2 w-1/2 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={searchQuery}
                        onChange={(e) => {
                            const newSearchQuery = e.target.value;
                            setSearchQuery(newSearchQuery);
                            updateUrlParams(newSearchQuery);
                        }}
                    />
                </div>

                <div className="flex justify-center space-x-8 mb-8">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSelectedDimension('2D')}
                            className={`px-4 py-2 rounded-full ${selectedDimension === '2D' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-500 hover:text-white transition-colors`}
                        >
                            2D
                        </button>
                        <button
                            onClick={() => setSelectedDimension('3D')}
                            className={`px-4 py-2 rounded-full ${selectedDimension === '3D' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-500 hover:text-white transition-colors`}
                        >
                            3D
                        </button>
                        <button
                            onClick={() => setSelectedDimension('All')}
                            className={`px-4 py-2 rounded-full ${selectedDimension === 'All' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-500 hover:text-white transition-colors`}
                        >
                            All
                        </button>
                    </div>

                    <select
                        value={selectedRegion}
                        onChange={(e) => {
                            const newRegion = e.target.value;
                            setSelectedRegion(newRegion);
                            updateUrlParams(undefined, newRegion);
                        }}
                        className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-green-400 outline-none"
                    >
                        {regions.length === 0 ? (
                            <option value="">Loading regions...</option>
                        ) : (
                            regions.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {loading && <p className="text-center text-gray-300">Loading movies...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {filteredMovies.length === 0 && !loading && (
                    <div className="text-center text-gray-400 mt-10">
                        No movies found matching your search criteria.
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredMovies.map((movie) => (
                        <div
                            key={movie.movie_id}
                            className="bg-gray-800/50 rounded-lg overflow-hidden  transition-all flex flex-col"
                        >
                            <div
                                className="relative w-full h-[350px] bg-black cursor-pointer"
                                onClick={() => navigate(`/reservation/${movie.movie_id}`)}
                            >
                                <img
                                    src={processImage(movie.poster_link)}
                                    alt={movie.movie_name}
                                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                />
                            </div>
                            <div className="p-4 flex-grow">
                            <h3 className="text-lg font-semibold mb-2 cursor-pointer"
                                onClick={() => navigate(`/reservation/${movie.movie_id}`)}
>                               {movie.movie_name}
                            </h3>
                                <p className="text-gray-400 mb-2">Rating: {movie.age_rating}</p>
                                <p className="text-gray-400 mb-2">Duration: {movie.duration} minutes</p>
                                <p className="text-gray-400 mb-2">Dimension: {movie.dimension}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default NowPlayingPage;
