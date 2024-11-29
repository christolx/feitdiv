import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Pages/Home";
import FAQPage from "./Pages/FAQ";
import TheatersPage from "./Pages/Theaters";
import UpcomingPage from './Pages/Upcoming';
import LoginPage from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import RegisterPage from './Pages/Register';
import TestPage from './Pages/TestPage'; 

// Import halaman baru
import PaymentHistory from './Pages/PaymentHistory';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rute yang sudah ada */}
                <Route path="/" element={<><HomePage /></>} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/theaters" element={<TheatersPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
                <Route path="/test" element={<TestPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;