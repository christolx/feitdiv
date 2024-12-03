import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Choose Your Region');
  const [regions, setRegions] = useState<string[]>([]); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await fetch('http://localhost:3000/theaters/get-theaters');
        if (!response.ok) {
          throw new Error('Failed to fetch theaters');
        }

        const data = await response.json();
        const uniqueRegions = Array.from(new Set(data.map((theater: { location: string }) => theater.location)));
        setRegions(uniqueRegions);
      } catch (err) {
        console.error('Error fetching theaters:', err);
      }
    };

    fetchTheaters();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      search: searchTerm,
      region: selectedRegion,
    });

    navigate(`/nowplaying?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
          <h1
            className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent
                        whitespace-nowrap overflow-hidden animate-typing"
            style={{ width: '25ch' }}
            >
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
                className="w-full px-6 py-4 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 focus:border-green-400 outline-none transition-all"
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
                  <span>{selectedRegion}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-colors"
                      >
                        {region}
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
