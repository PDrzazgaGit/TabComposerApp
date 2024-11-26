import { createContext } from 'react';
import { IMeasure, INote, IPause, NoteDuration } from '../models/'
interface MeasureContextType {
    measure: IMeasure;
    measureId: number;
    setMeasureId: (newId: number) => void;
    getMaxFrets: () => number;
    getMeasureDurationMs: () => number;
    getStringNotes: (stringId: number) => INote[];
    changeFret: (note: INote, stringId: number, fret: number) => void;
    changeNoteDuration: (note: INote | IPause, newDuration: NoteDuration, stringId: number) => boolean;
    deleteNote: (note: INote | IPause, stringId: number) => void;
    moveNoteRight: (note: INote | IPause, stringId: number, interval?: NoteDuration) => boolean;
    moveNoteLeft: (note: INote | IPause, stringId: number, interval?: NoteDuration) => boolean;
    addNote: (stringId: number, noteDuration?: NoteDuration) => boolean;
    addPause: (stringId: number, noteDuration?: NoteDuration) => boolean;
}

export const MeasureContext = createContext<MeasureContextType | undefined>(undefined);