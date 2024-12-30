import { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { IUser } from '../models/UserModel';
import { UserManagerApi } from '../api/UserManagerApi';
import { AppErrors } from '../models/AppErrorsModel';
import { IClientAuth } from '../api/ClientApi';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [errors, setErrors] = useState<AppErrors>({});

    const [user, setUser] = useState<IUser | undefined | null>();

    const userManagerApi = useMemo(() => new UserManagerApi(), []);

    const clientAuth: IClientAuth = useMemo(() => userManagerApi.getAuth(), [userManagerApi]);

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
        
        const success = await userManagerApi.signIn(username, password, remember);
        if (success) {
            setUser(userManagerApi.getUser());
            return true;
        } else {
            setErrors(userManagerApi.getErrors() ?? {});
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
        const success = await userManagerApi.signUp(email, username, password);
        if (success) {
            return true;
        } else {
            setErrors(userManagerApi.getErrors() ?? {});
            return false;
        }
        
    };

    const signOut = useCallback(() => {
        userManagerApi.signOut();
        setUser(null);
    }, [userManagerApi]);

    const getToken = (): string | null => {
        return userManagerApi.getUserToken();
    }

    const getTokenWithAuth = async (): Promise<string | null> => {
        const token = await userManagerApi.getUserTokenWithAuth();
        if (!token) {
            signOut();
        }
        return token;
    }

    const authorize = async (): Promise<boolean> => {
        const success = await userManagerApi.authorize();
        if (!success) {
            signOut();
        }
        return success;
    }

    const clearErrors = () => {
        setErrors({});
    }

    useEffect(() => {
        const user = userManagerApi.getUser();
        if (!user) {
            signOut();
        } else {
            setUser(user);
        }
    }, [signOut, userManagerApi])

    /*
    useEffect(() => {
        console.log("wywo³anie autoryzacji w auth provider")
        const fetchUser = async () => {
            const userData = await userManagerApi.downloadUser();
            if (!userData) {
                signOut();
            } else {
                setUser(userData);
            }
        }
        //fetchUser();
    }, [signOut, userManagerApi])
    */

    const value = {
        clientAuth,
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
