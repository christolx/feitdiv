import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Pages/Home";
import LoginPage from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import RegisterPage from './Pages/Register';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/upcoming" element={<div>Upcoming Page</div>} />
                <Route path="/theaters" element={<div>Theaters Page</div>} />
                <Route path="/faq" element={<div>FAQ Page</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;