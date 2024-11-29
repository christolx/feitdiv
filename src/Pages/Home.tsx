import React, { useEffect, useState } from 'react';
import { Region } from "../Interface/interface";
import { Link } from 'react-router-dom';
import { logout } from '../utils/api';
import { Navigate } from 'react-router-dom';
// const [movies, setMovies] = useState([]);
// const [loading, setLoading] = useState(true);

const HomePage: React.FC = () => {
    const [region, setRegion] = useState<Region>({ name: "Jakarta" });
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState<string | null>(null);

    // useEffect(() => {
    //     const fetchMovies = async () => {
    //       try {
    //         setLoading(true);
    //         const response = await fetch('your-api-endpoint-here');
    //         const data = await response.json();
    //         setMovies(data);
    //       } catch (error) {
    //         console.error('Error fetching movies:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
      
    //     fetchMovies();
    //   }, [region]);

    

    const regions = [
        { id: 1, name: "Jakarta" },
        { id: 2, name: "Bali" },
        { id: 3, name: "Surabaya" },
        { id: 4, name: "Bandung" },
    ];

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        setUserName(storedUserName);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUserName(null);
            <Navigate to="/login" />;
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Header */}
            <header className="bg-black/80 backdrop-blur-sm fixed w-full z-50">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
                        CineWave
                    </h1>

                    <div className="flex items-center space-x-8">
                        <ul className="flex space-x-6 list-none">
                            {['Now Playing', 'Upcoming', 'Theaters', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase().replace(' ', '')}`}
                                        className="text-gray-300 hover:text-green-400 transition-colors no-underline"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center space-x-4">
                            {userName ? (
                                <>
                                    <span className="text-green-400">{userName}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-400 transition-colors no-underline"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="pt-20">
                <div className="container mx-auto px-4">
                    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                            Search Movies or Theaters
                        </h1>

                        <form
                            onSubmit={handleSearch}
                            className="w-full max-w-2xl relative group"
                        >
                            <input
                                type="text"
                                placeholder="Search for movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full px-6 py-4 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 focus:border-green-400 outline-none transition-all ${
                                    searchTerm ? "text-white" : "text-gray-400"
                                }`}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                            >
                                Search
                            </button>
                        </form>

                        {/* Region Selection */}
                        <div className="flex items-center space-x-4">
                            <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-medium">
                                Region
                            </span>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                    className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 flex items-center space-x-2 hover:bg-gray-700 transition-colors"
                                >
                                    <span>{region.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute mt-2 w-48 rounded-lg bg-gray-800 shadow-lg py-2 z-50">
                                        {regions.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => {
                                                    setRegion(r);
                                                    setDropdownOpen(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors"
                                            >
                                                {r.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        
    );
};

export default HomePage;