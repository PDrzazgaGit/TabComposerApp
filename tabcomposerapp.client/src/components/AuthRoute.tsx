import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SessionExpired } from './SessionExpired';

export const AuthRoute: React.FC = () => {

    const { authorize } = useAuth();

    const [authorized, setAuthorized] = useState<boolean | undefined>();

    const [rendered, setRendered] = useState<boolean>(false);

    useEffect(() => {
        const fetchAuthorized = async () => {
            const success = await authorize();
            setAuthorized(success);
            setRendered(true);
        }
        fetchAuthorized();
        
    }, [authorize])

    //return authorized === undefined && <Outlet />;

    return rendered && (authorized && <Outlet /> || (<SessionExpired/>));
};