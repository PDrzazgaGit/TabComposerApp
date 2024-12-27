import axios from "axios";
import { ITabulature } from "../models";
import { TabulatureDataModel } from "../models/TabulatureDataModel";
import { SerializationService } from "../services/SerializationService";

export class TabulatureManagerApi {

    static tabulatureId: number | undefined;

    static tabulature: ITabulature | null;

    public static async getUserTabulaturesInfo(token: string): Promise<Record<number, TabulatureDataModel> | null> {
        try {
            const response = await axios.get('https://localhost:44366/api/Tablature/GetUserTablaturesInfo', {
                headers: {
                    Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
                }
            });
            return response.data;
        } catch {
            return null;
        }
        
    }

    public static async downloadTabulature(id: number): Promise<ITabulature | null> {
        try {
            const response = await axios.get(`https://localhost:44366/api/Tablature/GetTablature/${id}`);
            const tabulatureData: string = response.data.tablature as string; 
            
            this.tabulature = SerializationService.deserializeTabulature(tabulatureData);
            
            this.tabulatureId = id;
            return this.tabulature;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    public static async addTabulature(token: string, tabulature: ITabulature): Promise<boolean> {
        try {
            const tabulatureData: string = SerializationService.serializeTabulature(tabulature);
            const response = await axios.post(
                'https://localhost:44366/api/Tablature/AddTablature',
                tabulatureData,
                {
                    
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const id = response.data.id;
            if (id === null) {
                return false;
            }
            this.tabulatureId = id;
            this.tabulature = tabulature
            return true;
        } catch {
            return false
        }
    }

    public static async deleteTabulature(token: string, id: number): Promise<boolean> {
        try {
            await axios.post(`https://localhost:44366/api/Tablature/DeleteTablature/${id}`, null ,{
                headers: {
                    Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
                }
            });
            if (id === this.tabulatureId) {
                this.tabulatureId = undefined;
                this.tabulature = null;
            }
            return true;
        } catch {
            return false
        }
    }

    public static async updateTabulature(token: string): Promise<boolean> {
        if (this.tabulatureId === undefined || this.tabulature === null) {
            return false;
        }
        try {
            const tabulatureData: string = SerializationService.serializeTabulature(this.tabulature);
            await axios.post(
                `https://localhost:44366/api/Tablature/UpdateTablature/${this.tabulatureId}`,
                tabulatureData,  
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json',  
                    },
                }
            );
            return true;
        } catch {
            return false
        }
    }

    public static cloneTabulature(): ITabulature | null {
        const clone = this.tabulature?.clone() || null;
        this.tabulature = clone;
        return clone;
    }

    public static getTabualture(): ITabulature | null {
        return this.tabulature;
    }
    
}