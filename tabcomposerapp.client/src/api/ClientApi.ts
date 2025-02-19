import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { action, makeObservable, observable, runInAction } from "mobx";
import { config } from "./../config";

export interface IClientAuth {
    readonly authorized: boolean;
}

export interface IClientApi extends IClientAuth {
    use(): AxiosInstance; 
    setAuthorize(value: boolean): void;
}

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
            baseURL: config.apiBaseUrl,
        })
        this.authorized = false;

       
        this.client.interceptors.response.use(

            (response: AxiosResponse) => {
                 //check later
                const authHeader = response.config.headers?.['Authorization'];
                if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                    this.setAuthorize(true);
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

        makeObservable(this, {
            authorized: observable,
            setAuthorize: action
        }); 

    }
}