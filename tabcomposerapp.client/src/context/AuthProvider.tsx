import { useState, useEffect, ReactNode, useCallback } from 'react';
import { signUpApi, signInApi } from '../api/AuthService';
import { getUserProfileApi } from '../api/UserService';
import { User, AuthContext } from './AuthContext';
import { useError } from './../hooks/useError';
import { apiErrorFormatter } from '../api/ApiErrorFormatter';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { setFormErrors } = useError();

    const [user, setUser] = useState<User | null>(null);

    const signIn = async (username: string, password: string, remember: boolean = false) => {

        const errors: { username?: string[]; password?: string[] } = {};

        if (!username) {
            errors.username = ['Username is required.'];
        }
        if (!password) {
            errors.password = ['Password is required.'];
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {

            const token = await signInApi(username, password);

            const user: User = {
                username: username,
                token: token,
                email: ''
            }

            setUser(user);
            if (remember) {
                localStorage.setItem("userToken", user.token);
            } else {
                sessionStorage.setItem("userToken", user.token);
            }
            sessionStorage.setItem('logged', 'true');  // Zapisanie stanu zalogowania w sessionStorage
        } catch (error) {
            const errors = apiErrorFormatter(error, { message: "message" });
            sessionStorage.setItem('logged', 'false'); // Ustawienie na 'false' w przypadku b³êdu
            setFormErrors(errors);
        }
    };

    const signUp = async (email: string, username: string, password: string) => {

        const errors: { email?: string[]; username?: string[]; password?: string[] } = {};
        if (!email) {
            errors.email = ['Email is required.'];
        }
        if (!username) {
            errors.username = ['Username is required.'];
        }
        if (!password) {
            errors.password = ['Password is required.'];
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await signUpApi(email, username, password);
            sessionStorage.setItem('logged', 'true');  // Ustawienie na 'true' po udanym rejestracji
        } catch (error) {
            const errors = apiErrorFormatter(error, {
                email: "Email",
                username: "UserName",
                password: "Password",
            });
            sessionStorage.setItem('logged', 'false');  // Ustawienie na 'false' w przypadku b³êdu
            setFormErrors(errors);
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem("userToken");
        sessionStorage.removeItem("userToken");
        sessionStorage.setItem('logged', 'false');  // Ustawienie na 'false' podczas wylogowywania
    };

    const getToken = useCallback(() => {
        const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

        if (!token) {
            return null;
        }

        const decodeToken = (token: string) => {
            try {
                return jwtDecode<{ exp: number }>(token);
            } catch {
                return null;
            }
        };

        const decoded = decodeToken(token);
        if (!decoded || Date.now() >= decoded.exp * 1000) {
            signOut();
            return null;
        }

        return token;
    }, []);

    useEffect(() => {

        const token = getToken();

        if (token) {
            const fetchUserProfile = async () => {
                try {
                    const profileData = await getUserProfileApi(token);
                    const user: User = {
                        email: profileData.email,
                        username: profileData.userName,
                        token: profileData.token,
                    };
                    setUser(user);
                    sessionStorage.setItem('logged', 'true');  // Ustawienie na 'true' po pobraniu profilu
                } catch {
                    signOut();
                }
            };

            fetchUserProfile();
        }
    }, [getToken]);

    const value = {
        user,
        getToken,
        signUp,
        signIn,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
