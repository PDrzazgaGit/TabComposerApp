import { createContext } from 'react';
import { ITabulature } from '../models';
import { TabulatureDataModel } from '../models/TabulatureDataModel';
import { IClientApi } from '../api/clientApi';

interface TabulatureApiContextType {

    clientApi: IClientApi;

    updateTabulature: (token: string) => Promise<boolean>;

    addTabulature: (token: string, tabulature: ITabulature) => Promise<boolean> 

    deleteTabulature: (token: string, id: number) => Promise<boolean> 

    downloadTabulature: (id: number) => Promise<ITabulature | null> 

    getTabulature: () => ITabulature | null;

    getUserTabulatureInfo: (token: string) => Promise<Record<number, TabulatureDataModel> | null> 

}

export const TabulatureApiContext = createContext<TabulatureApiContextType | undefined>(undefined);