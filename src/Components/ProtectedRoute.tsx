import React from 'react';
import {Navigate} from 'react-router-dom';
import {ProtectedRouteProps} from '../Interface/interface';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return <Navigate to="/login"/>;
    }
    return children;
};

export default ProtectedRoute;