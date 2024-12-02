import { createContext } from 'react';
import { ITabulature } from '../models'
interface TabulatureContextType {
    tabulature: ITabulature;
    addMeasure: (tempo: number, numerator: number, denominator: number) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);