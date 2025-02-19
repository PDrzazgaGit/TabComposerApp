import { computed, makeObservable, observable, runInAction } from "mobx";
import { ITabulature, TabulatureDataModel } from "../models"
import { SerializationService } from "../services";
import { ClientApi, IClientApi } from "./";
import { config } from "./../config";
export interface ITabulatureUpToDate {
    get upToDate(): boolean
}
export class TabulatureManagerApi implements ITabulatureUpToDate {

    public tabulatureId: number | undefined;

    public tabulature: ITabulature | null;

    public previousUpdateTablature: string | null;

    private clientApi: IClientApi;

    public constructor() {
        this.clientApi = ClientApi.getInstance();
        this.tabulature = null;
        this.previousUpdateTablature = null;
        makeObservable(this, {
            tabulature: observable,
            previousUpdateTablature: observable,
            upToDate: computed
        });
    }

    public async getUserTabulaturesInfo(token: string): Promise<Record<number, TabulatureDataModel> | null> {
        try {
            const response = await this.clientApi.use().get(config.tablature.userListEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            return response.data;
        } catch {
            return null;
        }
        
    }

    public async downloadTabulature(id: number): Promise<ITabulature | null> {
        try {
            const response = await this.clientApi.use().get(`${config.tablature.getEndpoint}/${id}`);
            const tabulatureData: string = response.data.tablature as string; 
            runInAction(() => this.tabulature = SerializationService.deserializeTabulature(tabulatureData))
            runInAction(() => this.previousUpdateTablature = SerializationService.serializeTabulature(this.tabulature!))
            this.tabulatureId = id;
            return this.tabulature;
        } catch {
            return null;
        }
    }

    public async addTabulature(token: string, tabulature: ITabulature): Promise<boolean> {
        try {
            const tabulatureData: string = SerializationService.serializeTabulature(tabulature);
            const response = await this.clientApi.use().post(
                config.tablature.addEndpoint,
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
            runInAction(() => this.tabulature = tabulature);
            runInAction(() => this.previousUpdateTablature = SerializationService.serializeTabulature(this.tabulature!));
            return true;
        } catch {
            return false
        }
    }

    public async deleteTabulature(token: string, id: number): Promise<boolean> {
        try {
            await this.clientApi.use().post(`${config.tablature.deleteEndpoint}/${id}`, null ,{
                headers: {
                    Authorization: `Bearer ${token}` // Dodajemy token JWT do nag³ówka
                }
            });
            if (id === this.tabulatureId) {
                this.tabulatureId = undefined;
                runInAction(() => this.tabulature = null);
                runInAction(() => this.previousUpdateTablature = null);
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
            await this.clientApi.use().post(
                `${config.tablature.updateEndpoint}/${this.tabulatureId}`,
                tabulatureData,  
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json',  
                    },
                }
            );
            runInAction(() => this.previousUpdateTablature = SerializationService.serializeTabulature(this.tabulature!));
            return true;
        } catch {
            return false
        }
    }

    public getTabulature(): ITabulature | null {
        return this.tabulature;
    }

    public get upToDate(): boolean {
        if (!this.tabulature || !this.previousUpdateTablature) {
            return false;
        }
        const currentTabulatureData = SerializationService.serializeTabulature(this.tabulature);
        return this.previousUpdateTablature == currentTabulatureData;
    }
    
}