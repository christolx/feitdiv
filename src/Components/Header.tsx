import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/api';

const Header: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        setUserName(storedUserName);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUserName(null);
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className="bg-black/80 backdrop-blur-sm fixed w-full z-50">
  <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
    <Link
      to="/"
      className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors no-underline"
    >
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

    );
};

export default Header;
