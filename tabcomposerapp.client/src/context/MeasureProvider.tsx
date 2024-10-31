import { useState, useMemo, ReactNode } from 'react';
import { MeasureContext } from './MeasureContext';
import { IMeasure, INote } from '../models';

export const MeasureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [measure, setMeasure] = useState<IMeasure | null>(null)

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        if (measure) {
            measure.changeNoteFret(note, stringId, fret);
        }
    }

    const frets = measure?.frets;

    /*
    const value = useMemo(
        () => ({
            measure,
            setMeasure,
            changeFret
        }),
        [changeFret, measure]
    )
    */

    const value = {
        measure,
        setMeasure,
        changeFret,
        frets
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};