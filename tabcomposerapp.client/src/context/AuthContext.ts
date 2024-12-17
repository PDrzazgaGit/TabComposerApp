import { createContext } from 'react';

export interface IUser {
    readonly username: string;
    readonly email: string;
}

export class User implements IUser {
    constructor(public username: string, public email: string, public token: string) { }
}

interface AuthContextType {
    user: IUser | null;
    getToken: () => string | null;
    signUp: (email: string, username: string, password: string) => Promise<void>;
    signIn: (username: string, password: string, remember: boolean) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);