import { createContext } from 'react';
import { ITabulatureUpToDate } from '../api';
import { ITabulature, TabulatureDataModel } from '../models';

interface TabulatureApiContextType {

    tabulatureManagerApi: ITabulatureUpToDate;

    updateTabulature: (token: string) => Promise<boolean>;

    addTabulature: (token: string, tabulature: ITabulature) => Promise<boolean> 

    deleteTabulature: (token: string, id: number) => Promise<boolean> 

    downloadTabulature: (id: number) => Promise<ITabulature | null> 

    getTabulature: () => ITabulature | null;

    getUserTabulatureInfo: (token: string) => Promise<Record<number, TabulatureDataModel> | null> 

}

export const TabulatureApiContext = createContext<TabulatureApiContextType | undefined>(undefined);