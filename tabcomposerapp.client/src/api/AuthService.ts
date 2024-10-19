import axios from "axios";

export const signUp = async (email: string, username: string, password: string) => {
    const response = await axios.post('https://localhost:44366/api/auth/signup', {
        email,
        username,
        password
    });

    return response.data; // Zwraca odpowiedŸ z API (np. komunikat o sukcesie)
};

export const signIn = async (username: string, password: string) => {
    const response = await axios.post('https://localhost:44366/api/auth/signin', {
        username,
        password
    });

    return response.data.token;
};