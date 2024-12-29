import { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { IUser } from '../models/UserModel';
import { UserManagerApi } from '../api/UserManagerApi';
import { AppErrors } from '../models/AppErrorsModel';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [errors, setErrors] = useState<AppErrors>({});

    const [user, setUser] = useState<IUser | null>(null);

    const clientApi = useMemo(() => new UserManagerApi(), []);

    const signIn = async (username: string, password: string, remember: boolean = false): Promise<boolean> => { 
        clearErrors();
        const preErrors: AppErrors = {};
        if (!username) {
            preErrors.username = ['Username is required.'];
        }
        if (!password) {
            preErrors.password = ['Password is required.'];
        }
        if (Object.keys(preErrors).length > 0) {
            setErrors(preErrors);
            return false;
        }
        
        const success = await clientApi.signIn(username, password, remember);
        if (success) {
            setUser(clientApi.getUser());
            return true;
        } else {
            setErrors(clientApi.getErrors() ?? {});
            return false;
        }
    };

    const signUp = async (email: string, username: string, password: string): Promise<boolean> => {
        clearErrors();
        const preErrors: AppErrors = {};
        if (!email) {
            preErrors.email = ['Email is required.'];
        }
        if (!username) {
            preErrors.username = ['Username is required.'];
        }
        if (!password) {
            preErrors.password = ['Password is required.'];
        }
        if (Object.keys(preErrors).length > 0) {
            setErrors(preErrors);
            return false;
        }
        const success = await clientApi.signUp(email, username, password);
        if (success) {
            return true;
        } else {
            setErrors(clientApi.getErrors() ?? {});
            return false;
        }
        
    };

    const signOut = useCallback(() => {
        clientApi.signOut();
        setUser(null);
    }, [clientApi]);

    const getToken = (): string | null => {
        return clientApi.getUserToken();
    }

    const getTokenWithAuth = async (): Promise<string | null> => {
        const token = await clientApi.getUserTokenWithAuth();
        if (!token) {
            signOut();
        }
        return token;
    }

    const authorize = async (): Promise<boolean> => {
        const success = await clientApi.authorize();
        if (!success) {
            signOut();
        }
        return success;
    }

    const clearErrors = () => {
        setErrors({});
    }

    
    useEffect(() => {
        console.log("wywo³anie autoryzacji w auth provider")
        const fetchUser = async () => {
            const userData = await clientApi.downloadUser();
            if (!userData) {
                signOut();
            } else {
                setUser(userData);
            }
        }
        fetchUser();
    }, [signOut, clientApi])
    

    const value = {
        clientApi,
        user,
        errors,
        clearErrors,
        getTokenWithAuth,
        signUp,
        signIn,
        signOut,
        authorize,
        getToken
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
