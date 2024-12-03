import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
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
import MovieDetails from './Pages/MovieDetails.tsx';
import MyTicketPage from './Pages/MyTicketPage.tsx';
import ProtectedRoute from './Components/ProtectedRoute';

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
        <Route path="/paymenthistory" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
        <Route path="/mytickets" element={<ProtectedRoute><MyTicketPage /></ProtectedRoute>} />
        <Route path="/moviedetails" element={<MovieDetails />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
