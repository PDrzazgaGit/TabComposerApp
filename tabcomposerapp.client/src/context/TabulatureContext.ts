import { createContext } from 'react';
import { Tabulature } from './../models/TabulatureModel'
interface TabulatureContextType {
    tabulature: Tabulature | null;
    setTabulature: (tabulature: Tabulature | null) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);