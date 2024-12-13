import axios from "axios";

export const getUserTabulaturesInfo = async (token: string) => {
    const response = await axios.get('https://localhost:44366/api/Tablature/GetUserTablaturesInfo', {
        headers: {
            Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
        }
    });
    return response.data;
}