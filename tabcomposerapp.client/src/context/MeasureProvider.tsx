import { useState, ReactNode } from 'react';
import { MeasureContext } from './MeasureContext';
import { IMeasure, INote, IPause, NoteDuration } from '../models';

interface MeasureProviderProps {
    children: ReactNode;
    initialMeasure: IMeasure;
    initialMeasureId: number;
}

export const MeasureProvider: React.FC<MeasureProviderProps> = ({ children, initialMeasure, initialMeasureId }) => {

    const [measure] = useState<IMeasure | null>(initialMeasure);

    const [measureId, setMeasureId] = useState<number>(initialMeasureId);

    const getMaxFrets = (): number => {
        if (measure) {
            return measure.frets;
        }
        throw new Error("Measure has not been initialized.");
    }
    const getMeasureDurationMs = (): number => {
        if (measure) {
            return measure.measureDurationMs;
        }
        throw new Error("Measure has not been initialized.");
    }

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        if (!measure) {
            throw new Error("Measure has not been initialized.");
        }
        measure.changeNoteFret(note, stringId, fret);
    }

    const changeNoteDuration = (note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean => {
        if (!measure) {
            throw new Error("Measure has not been initialized.");
        }
        return measure.changeNoteDuration(note, newDuration, stringId);
    }

    const getMeasure = (): IMeasure => {
        if(measure)
            return measure;
        throw new Error("Measure has not been initialized.");
    }

    const value = {
        measureId,
        setMeasureId,
        getMaxFrets,
        getMeasureDurationMs,
        changeFret,
        getMeasure,
        changeNoteDuration
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};