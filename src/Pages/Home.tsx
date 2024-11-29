import React, { useState } from 'react';
import { Region } from "../Interface/interface";

const HomePage: React.FC = () => {
    const [region, setRegion] = useState<Region>({ name: "Jakarta" });
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const regions = [
        { id: 1, name: "Jakarta" },
        { id: 2, name: "Bali" },
        { id: 3, name: "Surabaya" },
        { id: 4, name: "Bandung" },
    ];

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                            >
                                Search
                            </button>
                        </form>

                    
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
                                        className={`w-4 h-4 transition-transform ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
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
