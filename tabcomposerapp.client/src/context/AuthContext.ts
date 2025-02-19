import { createContext } from 'react';
import { IClientAuth } from '../api';
import { AppErrors, IUser } from '../models';

interface AuthContextType {
    clientAuth: IClientAuth;
    user: IUser | null | undefined;
    errors: AppErrors;
    clearErrors: () => void;
    getToken: () => string | null;
    getTokenWithAuth: () => Promise<string | null>;
    authorize: () => Promise<boolean>;
    signUp: (email: string, username: string, password: string) => Promise<boolean>;
    signIn: (username: string, password: string, remember: boolean) => Promise<boolean>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);