import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { MovieDetailsProps } from '../Interface/interfacemovie';

const MovieDetails: React.FC = () => {
    const location = useLocation();
    const { movie_id } = useParams<{ movie_id: string }>();
    const navigate = useNavigate();
    
    // Destructure location state, with a fallback to undefined values if location.state is null
    const { movie, selectedRegion } = location.state as {
        movie: Partial<MovieDetailsProps>;
        selectedRegion: string;
    } || {};

    const [apiMovieDetails, setApiMovieDetails] = useState<MovieDetailsProps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movie_id) {
                setError("Movie ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/films/movie-details/${movie_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }

                const data = await response.json();
                
                const mappedData: MovieDetailsProps = {
                    title: data.movie_name || movie?.title || 'Untitled',
                    posterUrl: data.poster_link || movie?.posterUrl || 'default-poster-url.jpg', 
                    genre: data.genre?.length ? data.genre : movie?.genre || ['No genre available'],
                    producer: data.producer || movie?.producer || 'Unknown',
                    director: data.director || movie?.director || 'Unknown',
                    youtubeEmbedLink: data.trailer_link || movie?.youtubeEmbedLink || '',
                    synopsis: data.synopsis || movie?.synopsis || 'No synopsis available.',
                };

                setApiMovieDetails(mappedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movie_id, movie]);

    const handleBookNow = () => {
        if (selectedRegion) {
            navigate(`/reservation/${movie_id}?region=${selectedRegion}`);
        }
    };

    return (
        <div className="min-h-screen mx-auto p-6 bg-gradient-to-b from-gray-900 to-black pb-20">
            {loading && <p className="text-center text-gray-300">Loading movie details...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && apiMovieDetails && (
                <>
                    <div className="w-full h-[600px] mb-4 pb-5">
                        {apiMovieDetails.youtubeEmbedLink ? (
                            <iframe
                                src={apiMovieDetails.youtubeEmbedLink}
                                title={`${apiMovieDetails.title} Trailer`}
                                className="w-full h-full rounded-lg"
                                allow="autoplay; encrypted-media;"
                                allowFullScreen
                            />
                        ) : (
                            <div className="text-center text-gray-300">No trailer available</div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row bg-gradient-to-b from-gray-900 to-black shadow-lg rounded-lg">
                        <div className="md:w-1/4 p-4">
                            <img
                                src={apiMovieDetails.posterUrl}
                                alt={apiMovieDetails.title}
                                className="w-full h-auto rounded-lg shadow-md object-cover"
                            />
                        </div>
                        <div className="md:w-3/4 p-6 space-y-4 bg-gradient-to-b from-gray-900 to-black">
                            <h1 className="text-3xl font-bold text-white">{apiMovieDetails.title}</h1>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2 text-white">Region:</span>
                                    <span className="text-gray-300">{selectedRegion || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2 text-white">Genre:</span>
                                    <div className="flex space-x-2">
                                        {apiMovieDetails.genre.map((genre, index) => (
                                            <span
                                                key={index}
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2 text-white">Producer:</span>
                                    <span className="text-gray-300">{apiMovieDetails.producer}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2 text-white">Director:</span>
                                    <span className="text-gray-300">{apiMovieDetails.director}</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-white">Synopsis</h2>
                                <p className="text-gray-300 leading-relaxed">{apiMovieDetails.synopsis}</p>
                            </div>
                            {location.state && selectedRegion && (
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={handleBookNow}
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-400 transition"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MovieDetails;
