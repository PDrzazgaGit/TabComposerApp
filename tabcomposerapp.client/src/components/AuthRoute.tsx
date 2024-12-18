import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthRoute: React.FC = () => {

    const { authorize, user } = useAuth();


    useEffect(() => {
        const fetchAuthorized = async () => {
            await authorize();
        }
        fetchAuthorized();
    }, [authorize])

    return user && <Outlet /> || (<Navigate to="/login" replace />);
};