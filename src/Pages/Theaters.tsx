import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TheatersPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  
  
  const theaters = [
    { 
      id: 1, 
      name: "CineWave Grand Indonesia", 
      location: "Jakarta",
      address: "Grand Indonesia Mall, 3rd Floor",
      rating: 4.5,
      image: "/api/placeholder/400/200"
    },
    { 
      id: 2, 
      name: "CineWave Plaza Indonesia", 
      location: "Jakarta",
      address: "Plaza Indonesia, 5th Floor",
      rating: 4.7,
      image: "/api/placeholder/400/200"
    },
    { 
      id: 3, 
      name: "CineWave Pacific Place", 
      location: "Jakarta",
      address: "Pacific Place Mall, 6th Floor",
      rating: 4.6,
      image: "/api/placeholder/400/200"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm fixed w-full z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors no-underline">
            CineWave
          </Link>
          
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
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-400 transition-colors no-underline"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Movie Theaters
        </h1>

        <div className="mb-8">
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 focus:border-green-400 outline-none"
          >
            <option value="Jakarta">Jakarta</option>
            <option value="Bali">Bali</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Bandung">Bandung</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {theaters.map((theater) => (
            <div key={theater.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
              <div className="md:flex">
                <img src={theater.image} alt={theater.name} className="w-full md:w-96 h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{theater.name}</h3>
                  <p className="text-gray-400 mb-4">{theater.address}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 mr-2">★</span>
                    <span>{theater.rating}/5.0</span>
                  </div>
                  <button className="px-6 py-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors">
                    View Showtimes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TheatersPage;