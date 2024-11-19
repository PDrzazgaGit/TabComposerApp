import { createContext } from 'react';
import { IMeasure, INote, IPause, NoteDuration } from '../models/'
interface MeasureContextType {
    measureId: number;
    setMeasureId: (newId: number) => void;
    getMaxFrets: () => number;
    getMeasureDurationMs: () => number;
    getMeasure: () => IMeasure;
    changeFret: (note: INote, stringId: number, fret: number) => void;
    changeNoteDuration: (note: INote | IPause, newDuration: NoteDuration, stringId: number) => boolean;
}

export const MeasureContext = createContext<MeasureContextType | undefined>(undefined);