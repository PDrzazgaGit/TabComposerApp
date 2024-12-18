import { createContext } from 'react';
import { IUser } from '../models/UserModel';
import { AppErrors } from '../models/AppErrorsModel';

interface AuthContextType {
    user: IUser | null;
    errors: AppErrors;
    clearErrors: () => void;
    getToken: () => Promise<string | null>;
    authorize: () => Promise<boolean>;
    signUp: (email: string, username: string, password: string) => Promise<boolean>;
    signIn: (username: string, password: string, remember: boolean) => Promise<boolean>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);