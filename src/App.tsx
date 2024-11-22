import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';

interface Region {
    name : string;
}

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [region, setRegion] = useState<Region>({ name: 'Jakarta' });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    const handleRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
    };

    return (
        <main className="py-10 h-screen space-y-5">
            <header>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/">Now Playing</Link>
                        </li>
                        <li>
                            <Link to="/upcoming">Upcoming</Link>
                        </li>
                        <li>
                            <Link to="/theaters">Theaters</Link>
                        </li>
                        <li>
                            <Link to="/faq">FAQ</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <section>
                <h1 className="font-bold text-3xl text-center">CineWave</h1>
                <form onSubmit={handleSearch} className="max-w-lg mx-auto bg-slate-100 rounded-md p-5 space-y-6">
                    <input
                        type="text"
                        placeholder="Search Movies or Theaters"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Search
                    </button>
                </form>
            </section>

            <section>
                <h2 className="font-bold text-2xl">Region</h2>
                <p>{region.name}</p>
                <button
                    onClick={() => handleRegionChange({ name: 'New Region' })}
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Change Region
                </button>
            </section>
        </main>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upcoming" element={<div>Upcoming Page</div>} />
                <Route path="/theaters" element={<div>Theaters Page</div>} />
                <Route path="/faq" element={<div>FAQ Page</div>} />
            </Routes>
        </Router>
    );
};

export default App;