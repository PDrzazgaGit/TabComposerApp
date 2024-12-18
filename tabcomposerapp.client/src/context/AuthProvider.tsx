import { useState, ReactNode, useEffect } from 'react';
//import { signUpApi, signInApi } from '../api/AuthService';
//import { getUserProfileApi } from '../api/UserService';
import { AuthContext } from './AuthContext';
import { IUser } from '../models/UserModel';
import { UserManagerApi } from '../api/UserManagerApi';
import { AppErrors } from '../models/AppErrorsModel';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [errors, setErrors] = useState<AppErrors>({});

    const [user, setUser] = useState<IUser | null>(null);

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
        
        const success = await UserManagerApi.signIn(username, password, remember);
        if (success) {
            setUser(UserManagerApi.getUser());
            return true;
        } else {
            setErrors(UserManagerApi.getErrors() ?? {});
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
        const success = await UserManagerApi.signUp(email, username, password);
        if (success) {
            return true;
        } else {
            setErrors(UserManagerApi.getErrors() ?? {});
            return false;
        }
        
    };

    const signOut = () => {
        UserManagerApi.signOut();
        setUser(null);
        console.log("debug user is null reference changed")
    };

    const getToken = async (): Promise<string | null> => {
        const token = await UserManagerApi.getUserToken();
        if (!token) {
            signOut();
        }
        return token;
    }

    const authorize = async (): Promise<boolean> => {
        const success = await UserManagerApi.authorize();
        if (!success) {
            signOut();
        }
        return success;
    }

    const clearErrors = () => {
        setErrors({});
    }

    useEffect(() => {
       
        const fetchUser = async () => {
            const token = await getToken();
            if (token) {
                setUser(await UserManagerApi.downloadUser());
            }
        }
        if (!user) {
            fetchUser();
        }
    })

    const value = {
        user,
        errors,
        clearErrors,
        getToken,
        signUp,
        signIn,
        signOut,
        authorize
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
