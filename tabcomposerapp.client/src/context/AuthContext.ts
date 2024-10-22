import { createContext } from 'react';

export interface User {
    username: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    signUp: (email: string, username: string, password: string) => Promise<void>;
    signIn: (username: string, password: string, remember: boolean) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);