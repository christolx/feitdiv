import React from 'react';
import { Link } from 'react-router-dom';

const UpcomingPage: React.FC = () => {
  const upcomingMovies = [
    { id: 1, title: "Dune: Part Two", releaseDate: "2024-03-01", image: "/api/placeholder/300/450" },
    { id: 2, title: "Ghostbusters: Frozen Empire", releaseDate: "2024-03-22", image: "/api/placeholder/300/450" },
    { id: 3, title: "Kingdom of the Planet of the Apes", releaseDate: "2024-05-10", image: "/api/placeholder/300/450" },
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
          Upcoming Movies
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all">
              <img src={movie.image} alt={movie.title} className="w-full h-96 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                <p className="text-gray-400">Release Date: {movie.releaseDate}</p>
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