import { ITabulature } from "../models";
import { TabulatureDataModel } from "../models/TabulatureDataModel";
import { SerializationService } from "../services/SerializationService";
import { ClientApi } from "./clientApi";

export class TabulatureManagerApi extends ClientApi  {

    public tabulatureId: number | undefined;

    public tabulature: ITabulature | null;

    public constructor() {
        super();
        this.tabulature = null;
    }

    public async getUserTabulaturesInfo(token: string): Promise<Record<number, TabulatureDataModel> | null> {
        try {
            const response = await this.client.get('/Tablature/GetUserTablaturesInfo', {
                headers: {
                    Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
                }
            });
            return response.data;
        } catch {
            return null;
        }
        
    }

    public async downloadTabulature(id: number): Promise<ITabulature | null> {
        try {
            const response = await this.client.get(`/Tablature/GetTablature/${id}`);
            const tabulatureData: string = response.data.tablature as string; 
            
            this.tabulature = SerializationService.deserializeTabulature(tabulatureData);
            
            this.tabulatureId = id;
            return this.tabulature;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    public async addTabulature(token: string, tabulature: ITabulature): Promise<boolean> {
        try {
            const tabulatureData: string = SerializationService.serializeTabulature(tabulature);
            const response = await this.client.post(
                '/Tablature/AddTablature',
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

    public async deleteTabulature(token: string, id: number): Promise<boolean> {
        try {
            await this.client.post(`/Tablature/DeleteTablature/${id}`, null ,{
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

    public async updateTabulature(token: string): Promise<boolean> {
        if (this.tabulatureId === undefined || this.tabulature === null) {
            return false;
        }
        try {
            const tabulatureData: string = SerializationService.serializeTabulature(this.tabulature);
            await this.client.post(
                `/Tablature/UpdateTablature/${this.tabulatureId}`,
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

    public getTabulature(): ITabulature | null {
        return this.tabulature;
    }
    
}