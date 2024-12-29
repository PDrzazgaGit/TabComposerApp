import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { makeObservable, observable, runInAction } from "mobx";

export interface IClientApi {
    readonly authorized: boolean;
    use(): AxiosInstance;
    setAuthorize(value: boolean): void;
}

/*

Porobiæ interface do usermangerapi i tabulaturemanagerapi, zaktualizowaæ tabulaturemanagerapi do obs³ugi (nie dziedziczenia) singletonu

*/

export class ClientApi implements IClientApi {
    protected client: AxiosInstance;

    private static instance: ClientApi;

    public authorized: boolean;

    public static getInstance(): IClientApi {
        if (!ClientApi.instance) {
            ClientApi.instance = new ClientApi();
        }
        return ClientApi.instance;
    }

    public use(): AxiosInstance {
        return this.client;
    }

    public setAuthorize(value: boolean) {
        runInAction(() => this.authorized = value);
    }

    private constructor() {
        this.client = axios.create({
            baseURL: 'https://localhost:44366/api',
        })
        this.authorized = false;

        makeObservable(this, {
            authorized: observable
        }); 

        this.client.interceptors.response.use(

            (response: AxiosResponse) => {
                 //check later
                const authHeader = response.config.headers?.['Authorization'];
                if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                    this.setAuthorize(true);
                    console.log("autoryzowane")
                }  
                return response
            },
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    this.setAuthorize(false);
                    console.log("401")
                }
                return Promise.reject(error);
            }
        );
    }
}