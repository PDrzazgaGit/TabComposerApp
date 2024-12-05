import { useState, ReactNode } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { IMeasure, ITabulature } from '../models';

interface TabulatureProviderProps {
    children: ReactNode;
    initialTabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialTabulature }) => {

    const [tabulature, setTabulature] = useState<ITabulature>(initialTabulature);

    const [measuresPerRow, setMeasuresPerRow] = useState(3);

    const addMeasure = (tempo: number, numerator: number, denominator: number) => {
        tabulature.addMeasure(tempo, numerator, denominator);
        const tabulatureNew = tabulature.clone();
        setTabulature(tabulatureNew);
    }

    const deleteMeasure = (measure: IMeasure) => {
        const tabulatureNew = tabulature.clone();
        tabulatureNew.deleteMeasure(measure);
        
        setTabulature(tabulatureNew);
    }

    const value = {
        tabulature,
        addMeasure,
        deleteMeasure,
        measuresPerRow,
        setMeasuresPerRow
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};