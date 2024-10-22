import axios from "axios";

export const getUserProfileApi = async (token: string) => {
    const response = await axios.get('https://localhost:44366/api/Account', {
        headers: {
            Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
        }
    });
    return response.data;
}