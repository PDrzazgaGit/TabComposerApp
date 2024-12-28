import { createContext } from 'react';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';

interface TabulatureApiContextType {
    tabulatureManagerApi: TabulatureManagerApi;
}

export const TabulatureApiContext = createContext<TabulatureApiContextType | undefined>(undefined);