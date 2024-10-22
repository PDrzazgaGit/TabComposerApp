import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './../context/useAuthContext';

export const AuthRoute: React.FC = () => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};