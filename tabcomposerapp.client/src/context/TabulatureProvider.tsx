import { useState, ReactNode } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { ITabulature, ITuning } from '../models';

interface TabulatureProviderProps {
    children: ReactNode;
    initialTabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialTabulature }) => {

    const [tabulature] = useState<ITabulature | null>(initialTabulature);

    const [lastTempo, setLastTempo] = useState<number>(0);

    const getTabulature = () => {
        if (!tabulature)
            throw new Error("Tabulature has not been initialized");
        return tabulature;
    }

    const getTabulatureTuning = (): ITuning => {
        if (!tabulature)
            throw new Error("Tabulature has not been initialized");
        return tabulature.tuning; 
    }

    const value = {
        lastTempo,
        setLastTempo,
        getTabulature,
        getTabulatureTuning
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};