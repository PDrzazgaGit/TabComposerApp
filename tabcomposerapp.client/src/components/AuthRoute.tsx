import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthRoute: React.FC = () => {

    return sessionStorage.getItem('logged') === "true" && <Outlet /> || (<Navigate to="/login" replace />);

};