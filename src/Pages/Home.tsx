import React, { useEffect, useState } from 'react';
import { Region } from "../Interface/interface";
import { Link } from 'react-router-dom';
import { logout } from '../utils/api';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [region, setRegion] = useState<Region>({ name: 'Jakarta' });
    const [userName, setUserName] = useState<string | null>(null);

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
        <body className="m-0 p-0 overflow-x-hidden">
    <main
        className="h-screen w-screen bg-cover bg-center flex flex-col"
        style={{
            backgroundImage: "url('src/assets/Screenshot 2024-11-22 231149.png')",
        }}
    >
        <header className="bg-black text-white py-4">
            <nav className="w-full flex items-center px-20">
                <h1 className="text-xl font-bold font-sans">CineWave</h1>
                <ul className="flex space-x-8 text-sm">
                    <li>
                        <Link to="/" className="hover:text-green-400">
                            Now Playing
                        </Link>
                    </li>
                    <li>
                        <Link to="/upcoming" className="hover:text-green-400">
                            Upcoming
                        </Link>
                    </li>
                    <li>
                        <Link to="/theaters" className="hover:text-green-400">
                            Theaters
                        </Link>
                    </li>
                    <li>
                        <Link to="/faq" className="hover:text-green-400">
                            FAQ
                        </Link>
                    </li>
                    <li>
                        {userName ? (
                            <>
                                <span className="hover:text-green-400">{userName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="ml-4 text-red-400 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </>) : (
                            <Link to="/login" className="hover:text-green-400">
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>

        {/* Hero Section */}
        <section className="flex-grow flex flex-col items-center justify-center text-center text-white space-y-8 px-4">
            <h1 className="text-4xl font-bold">Search Movies or Theaters</h1>
            <form
                onSubmit={handleSearch}
                className="flex items-center bg-black bg-opacity-50 px-6 py-3 rounded-full w-full max-w-2xl"
            >
                <input
                    type="text"
                    placeholder="Search Movies"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-transparent text-white placeholder-gray-300 py-2 px-4 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-600"
                >
                    Search
                </button>
            </form>
        </section>

        {/* Region Selector */}
        <footer className="bg-black text-white py-3 flex justify-center items-center space-x-4">
            <span className="font-semibold">Region</span>
            <div className="bg-green-400 text-black px-6 py-1 rounded-full">
                {region.name}
            </div>
        </footer>
    </main>
</body>

    );
};

export default HomePage;