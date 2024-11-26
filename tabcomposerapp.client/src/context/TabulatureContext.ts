import { createContext } from 'react';
import { ITabulature } from '../models'
interface TabulatureContextType {
    tabulature: ITabulature;
    updateTabulature: (newTabulature: ITabulature) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);