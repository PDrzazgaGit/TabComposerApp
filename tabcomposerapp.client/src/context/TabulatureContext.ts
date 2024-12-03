import { createContext } from 'react';
import { IMeasure, ITabulature } from '../models'
interface TabulatureContextType {
    tabulature: ITabulature;
    addMeasure: (tempo: number, numerator: number, denominator: number) => void;
    deleteMeasure: (measure: IMeasure) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);