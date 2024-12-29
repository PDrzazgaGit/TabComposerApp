import { createContext } from 'react';
import { IUser } from '../models/UserModel';
import { AppErrors } from '../models/AppErrorsModel';
import { IClientApi } from '../api/clientApi';

interface AuthContextType {
    clientApi: IClientApi;
    user: IUser | null;
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