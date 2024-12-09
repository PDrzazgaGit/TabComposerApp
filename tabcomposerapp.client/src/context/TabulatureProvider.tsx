import { useState, ReactNode } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { IMeasure, ITabulature, NoteDuration } from '../models';

interface TabulatureProviderProps {
    children: ReactNode;
    initialTabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialTabulature }) => {

    const [tabulature, setTabulature] = useState<ITabulature>(initialTabulature);

    const [globalTempo, setGlobalTempo] = useState(100);
    const [globalNumerator, setGlobalNumerator] = useState(4);
    const [globalDenominator, setGlobalDenominator] = useState(4);
    const [globalNoteDuration, setGlobalNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);
    const [globalNoteInterval, setGlobalNoteInterval] = useState(NoteDuration.Quarter);
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
        setMeasuresPerRow,

        globalTempo,
        setGlobalTempo,

        globalNumerator,
        setGlobalNumerator,

        globalDenominator,
        setGlobalDenominator,

        globalNoteDuration,
        setGlobalNoteDuration,

        globalNoteInterval,
        setGlobalNoteInterval
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};