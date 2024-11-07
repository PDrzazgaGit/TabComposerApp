import { createContext } from 'react';
import { ITabulature, ITuning } from '../models'
interface TabulatureContextType {
    lastTempo: number;
    setLastTempo: (tempo: number) => void;
    getTabulature: () => ITabulature;
    getTabulatureTuning: () => ITuning;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);