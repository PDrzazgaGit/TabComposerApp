import axios from "axios";

export const signUpApi = async (email: string, username: string, password: string) => {
    const response = await axios.post('https://localhost:44366/api/auth/signup', {
        email,
        username,
        password
    });

    return response.data;
};

export const signInApi = async (username: string, password: string) => {
    const response = await axios.post('https://localhost:44366/api/auth/signin', {
        username,
        password
    });

    return response.data.token;
};