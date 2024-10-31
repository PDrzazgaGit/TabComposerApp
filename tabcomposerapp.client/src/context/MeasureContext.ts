import { createContext } from 'react';
import { IMeasure, INote } from '../models/'
interface MeasureContextType {
    measure: IMeasure | null;
    frets: number | undefined;
    setMeasure: (measure: IMeasure | null) => void;
    changeFret: (note: INote, stringId: number, fret: number) => void;
}

export const MeasureContext = createContext<MeasureContextType | undefined>(undefined);