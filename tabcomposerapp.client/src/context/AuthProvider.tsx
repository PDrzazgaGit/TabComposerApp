import { useState, useEffect, ReactNode } from 'react';
import { signUpApi, signInApi } from '../api/AuthService';
import { getUserProfileApi } from '../api/UserService';
import { User, AuthContext } from './AuthContext';
import { useError } from './../hooks/useError';
import { apiErrorFormatter } from '../api/ApiErrorFormatter';

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

        } catch (error) {
            const errors = apiErrorFormatter(error, {
                message: "message"
            })
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
            await signUpApi(email, username, password)
        } catch (error) {
            const errors = apiErrorFormatter(error, {
                email: "Email",
                username: "UserName",
                password: "Password",
            })
            setFormErrors(errors);
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem("userToken")
        sessionStorage.removeItem("userToken")
    };

    useEffect(() => {

        const getToken = () => {
            return localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
        }

        const token = getToken();
        if (token) {

            const fetchUserProfile = async () => {
                try {

                    const profileData = await getUserProfileApi(token);
                    console.log(profileData);

                    const storedUser: User = {
                        email: profileData.email,
                        username: profileData.userName,
                        token: token,
                    };

                    setUser(storedUser);
                } catch (error) {
                    console.error('B³¹d przy pobieraniu profilu u¿ytkownika:', error);

                }
            };

            fetchUserProfile();
        }

    }, []);

    const value = {
        user,
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