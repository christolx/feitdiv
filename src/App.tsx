import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header'; // Import the Header component
import HomePage from "./Pages/Home";
import FAQPage from "./Pages/FAQ";
import TheatersPage from "./Pages/Theaters";
import UpcomingPage from './Pages/Upcoming';
import LoginPage from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import RegisterPage from './Pages/Register';
import NowPlayingPage from './Pages/NowPlaying';

const App: React.FC = () => {
    return (
        <Router>
            <Header /> 
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/theaters" element={<TheatersPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/nowplaying" element={<NowPlayingPage/>} />
            </Routes>
        </Router>
    );
};

export default App;
