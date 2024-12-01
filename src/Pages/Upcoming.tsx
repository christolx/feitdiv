import React, { useState, useEffect } from 'react';
import { Movie } from '../Interface/interfacemovie';

const UpcomingPage: React.FC = () => {
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:3000/films/movies');
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data: Movie[] = await response.json();
                const filteredMovies = data.filter((movie) => movie.status === 'Upcoming');
                setUpcomingMovies(filteredMovies);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <main className="container mx-auto px-4 pt-24">
                <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Upcoming Movies
                </h1>

                {loading && <p className="text-center text-gray-300">Loading movies...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                    {upcomingMovies.map((movie) => (
                        <div
                            key={movie.movie_id}
                            className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all w-[200px] sm:w-[250px] lg:w-[280px] xl:w-[300px]"
                        >
                            <div className="relative w-full h-[450px] bg-black">
                                <img
                                    src={movie.poster_link}
                                    alt={movie.movie_name}
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{movie.movie_name}</h3>
                                <p className="text-gray-400">
                                    Release Date: {new Date(movie.release_date).toLocaleDateString()}
                                </p>
                                <button className="mt-4 w-full px-4 py-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors">
                                    Set Reminder
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UpcomingPage;
