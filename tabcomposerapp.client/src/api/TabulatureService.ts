import axios from "axios";
import { ITabulature } from "../models";
import { SerializationService } from "../services/SerializationService";

export const getUserTabulaturesInfo = async (token: string) => {
    const response = await axios.get('https://localhost:44366/api/Tablature/GetUserTablaturesInfo', {
        headers: {
            Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
        }
    });
    return response.data;
}

export const getTabulaturesInfo = async () => {
    const response = await axios.get('https://localhost:44366/api/Tablature/GetTablaturesInfo');
    return response.data;
}

export const getTabulature = async (id: number) => {
    const response = await axios.get(`https://localhost:44366/api/Tablature/GetTablature/${id}`);
    return response.data.tablature; // Zwraca dane tabulatury
}

export const addTabulature = async (token: string, tabulature: ITabulature) => {
    const data: string = SerializationService.serializeTabulature(tabulature);
    console.log(data);
    const response = await axios.post(
        'https://localhost:44366/api/Tablature/AddTablature',
         data ,  // Przekazujemy dane w ciele ¿¹dania
        {
            headers: {
                Authorization: `Bearer ${token}`,  // Token JWT w nag³ówku
                'Content-Type': 'application/json',  // Ustawiamy typ danych
            },
        }
    );
    return response.data;
}