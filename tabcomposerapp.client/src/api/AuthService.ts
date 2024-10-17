import axios from "axios";

export const signUp = async (email: string, username: string, password: string) => {
    try {
        const response = await axios.post('https://localhost:44366/api/auth/signup', {
            email,
            username,
            password
        });

        return response.data; // Zwraca odpowiedŸ z API (np. komunikat o sukcesie)
    } catch (error) {
        // Sprawdzanie, czy b³¹d ma odpowiedŸ z serwera
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to sign up');
        }
        throw new Error('Failed to sign up');
    }
};

export const signIn = async (username: string, password: string) => {
    try {
        const response = await axios.post('https://localhost:44366/api/auth/signin', {
            username,
            password
        });

        // Zwracanie tokena, jeœli logowanie zakoñczone sukcesem
        return response.data.token;
    } catch (error) {
        // Obs³uga b³êdu
        if (axios.isAxiosError(error) && error.response) {
            // Przechwytywanie wiadomoœci z odpowiedzi serwera
            throw new Error(error.response.data.message || 'Failed to sign in');
        }
        throw new Error('Failed to sign in');
    }
};