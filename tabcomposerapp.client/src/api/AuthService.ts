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
            const serverErrors = error.response.data; // Zak³adamy, ¿e server zwraca tablicê obiektów b³êdów
            const formattedErrors: { email?: string[]; username?: string[]; password?: string[] } = {};

            // Przechodzimy przez b³êdy i organizujemy je wed³ug pól
            serverErrors.forEach((err: { code: string; description: string }) => {
                if (err.code.includes("Email")) {
                    formattedErrors.email = formattedErrors.email || [];
                    formattedErrors.email.push(err.description);
                } else if (err.code.includes("UserName")) {
                    formattedErrors.username = formattedErrors.username || [];
                    formattedErrors.username.push(err.description);
                } else if (err.code.includes("Password")) {
                    formattedErrors.password = formattedErrors.password || [];
                    formattedErrors.password.push(err.description);
                }
            });
            throw formattedErrors;
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