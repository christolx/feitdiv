import React, { useState, useEffect } from 'react';
import { Movie } from '../Interface/interfacemovie';

const UpcomingPage: React.FC = () => {
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:3000/films/movies/Upcoming');
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data: Movie[] = await response.json();
                setUpcomingMovies(data);
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
            <main className="container mx-auto px-4 pt-10 pb-20">
                <h1 className="text-center text-4xl font-bold mb-8 text-white">
                    Upcoming Movies
                </h1>

                {loading && <p className="text-center text-gray-300">Loading movies...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-10">
                    {upcomingMovies.map((movie) => (
                        <div
                            key={movie.movie_id}
                            className="bg-gray-800/50 rounded-lg overflow-hidden transition-all flex flex-col"
                        >
                          
                            <div className="relative w-full cursor-pointer" style={{ paddingBottom: '150%' }}>
                                <img
                                    src={movie.poster_link}
                                    alt={movie.movie_name}
                                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                />

                               
                                <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-sm px-4 py-2 rounded-md">
                                    Rating: {movie.age_rating}
                                </div>

                               
                                <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-sm px-4 py-2 rounded-md">
                                    {movie.dimension || 'N/A'}
                                </div>
                            </div>

                        
                            <div className="p-4 text-center">
                                <h3
                                    className="text-lg font-semibold cursor-pointer text-gray-200 hover:text-white"
                                >
                                    {movie.movie_name}
                                </h3>

                           
                                <p className="text-gray-400 mt-2">
                                    {new Date(movie.release_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default UpcomingPage;
