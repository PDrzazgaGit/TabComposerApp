import { useState, ReactNode, useCallback } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { ITabulature, ITuning } from '../models';

interface TabulatureProviderProps {
    children: ReactNode;
    initialTabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialTabulature }) => {

    const [tabulature, setTabulature] = useState<ITabulature>(initialTabulature);

    const updateTabulature = useCallback((newTabulature: ITabulature) => {
        setTabulature(newTabulature); // Mo¿liwoœæ aktualizacji tabulatury
    }, []);

    const value = {
        tabulature,
        updateTabulature
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};