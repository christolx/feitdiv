import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer'; // Import Footer
import HomePage from './Pages/Home';
import FAQPage from './Pages/FAQ';
import TheatersPage from './Pages/Theaters';
import UpcomingPage from './Pages/Upcoming';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import NowPlayingPage from './Pages/NowPlaying';
import ReservationPage from './Pages/Reservation';
import ShowtimesPage from './Pages/Showtimes';
import PaymentHistory from './Pages/PaymentHistory.tsx';
import TestPage from './Pages/TestPage.tsx';
import MyTicketPage from './Pages/MyTicketPage.tsx';

const App: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

    return (
        <Router>
            <Header userName={userName} setUserName={setUserName} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/theaters" element={<TheatersPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={<LoginPage setUserName={setUserName} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/nowplaying" element={<NowPlayingPage />} />
                <Route path="/reservation/:movie_id" element={<ReservationPage />} />
                <Route path="/showtime/:theater_id" element={<ShowtimesPage />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/MyTicket" element={<MyTicketPage />} />
            </Routes>
            <Footer /> 
        </Router>
    );
};

export default App;
