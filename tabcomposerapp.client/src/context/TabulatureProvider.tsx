import { useState, ReactNode, useCallback } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { ITabulature } from '../models';

interface TabulatureProviderProps {
    children: ReactNode;
    initialTabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialTabulature }) => {

    const [tabulature, setTabulature] = useState<ITabulature>(initialTabulature);

    const addMeasure = (tempo: number, numerator: number, denominator: number) => {
        tabulature.addMeasure(tempo, numerator, denominator);
        const tabulatureNew = tabulature.clone();
        setTabulature(tabulatureNew);
    }

    const value = {
        tabulature,
        addMeasure
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};