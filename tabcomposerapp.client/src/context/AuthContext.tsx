import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signUpApi, signInApi } from '../api/AuthService';

interface User {
    username: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    signUp: (email: string, username: string, password: string) => Promise<boolean>;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);

    const signIn = async (username: string, password: string) => {

        const token = await signInApi(username, password);

        const userData: User = {
            username: username,
            token: token
        }

        setUser(userData);

        localStorage.setItem("userToken", userData.token);
    };

    const signUp = async (email: string, username: string, password: string) => await signUpApi(email, username, password);

    const signOut = () => {
        setUser(null);
        localStorage.removeItem("userToken")
    };

    useEffect(() => {
        
       /*
       const token = localStorage.getItem('userToken');
        if (token) {

            //const newToken

            // Optionally, you can call an API to validate the token and get the user details
            const storedUser: User = {
                username: '', // Retrieve or set from localStorage or token decoding
                token: token,
            };
            setUser(storedUser);
        }
        */
    }, []);

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
            { children }
        </AuthContext.Provider>
    );
};