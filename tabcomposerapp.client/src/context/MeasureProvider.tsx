import { useState, ReactNode } from 'react';
import { MeasureContext } from './MeasureContext';
import { IMeasure, INote } from '../models';

export const MeasureProvider: React.FC<{ children: ReactNode; initialMeasure: IMeasure }> = ({ children, initialMeasure }) => {

    const [measure] = useState<IMeasure | null>(initialMeasure);

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        if (measure) {
            measure.changeNoteFret(note, stringId, fret);
        }
    }

    const frets = measure?.frets;

    const getMeasure = () => {
        if(measure)
            return measure;
        throw new Error("Measure has not been initialized.");
    }

    const value = {
        getMeasure,
        changeFret,
        frets
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};