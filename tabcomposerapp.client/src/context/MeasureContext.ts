import { createContext } from 'react';
import { IMeasure, INote, ITuning } from '../models/'
interface MeasureContextType {
    measureId: number;
    setMeasureId: (newId: number) => void;
    getMaxFrets: () => number;
    getMeasureDurationMs: () => number;
    getMeasure: () => IMeasure;
    changeFret: (note: INote, stringId: number, fret: number) => void;
}

export const MeasureContext = createContext<MeasureContextType | undefined>(undefined);