import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilm, FaCalendarAlt, FaTheaterMasks, FaHistory, FaTicketAlt, FaQuestionCircle } from 'react-icons/fa';

interface HeaderProps {
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: React.FC<HeaderProps> = ({ userName, setUserName }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userName');
            setUserName(null);
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className="bg-black backdrop-blur-sm sticky top-0 w-full z-50">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-3xl font-bold text-green-400 hover:text-green-300 transition-colors no-underline font-jaro">
                    CineWave
                </Link>
                
                <div className="flex items-center space-x-8">
                    <ul className="flex space-x-6 list-none">
                        {['Now Playing', 'Upcoming', 'Theaters', 'Payment History', 'My Tickets', 'FAQ'].map((item, index) => {
                            const icons = [
                                <FaFilm />,
                                <FaCalendarAlt />,
                                <FaTheaterMasks />,
                                <FaHistory />,
                                <FaTicketAlt />,
                                <FaQuestionCircle />,
                            ];
                            return (
                                <li key={item} className="flex items-center space-x-2">
                                    <Link
                                        to={`/${item.toLowerCase().replace(' ', '')}`}
                                        className="text-gray-300 hover:text-green-400 transition-colors no-underline px-4 py-2 rounded-full border border-transparent hover:border-green-400 flex items-center space-x-2"
                                    >
                                        {icons[index]}
                                        <span>{item}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

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
            </nav>
        </header>
    );
};

export default Header;
