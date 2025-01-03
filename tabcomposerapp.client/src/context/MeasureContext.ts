import { createContext } from 'react';
import { IMeasure, INote, IPause, NoteDuration, Articulation } from '../models/'
interface MeasureContextType {
    frets: number;
    measure: IMeasure;
    measureId: number;
    setMeasureId: (newId: number) => void;
    changeFret: (note: INote, stringId: number, fret: number) => void;
    changeNoteDuration: (note: INote | IPause, newDuration: NoteDuration, stringId: number) => boolean;
    deleteNote: (note: INote | IPause, stringId: number, shift: boolean) => void;
    moveNoteRight: (note: INote | IPause, stringId: number, jump: boolean, interval?: NoteDuration) => boolean;
    moveNoteLeft: (note: INote | IPause, stringId: number, jump: boolean, interval?: NoteDuration) => boolean;
    addNote: (stringId: number, noteDuration?: NoteDuration) => boolean;
    addPause: (stringId: number, noteDuration?: NoteDuration) => boolean;
    changeSignature: (numerator: number, denominator: number) => boolean;
    changeTempo: (tempo: number) => void;
    changeArticulation: (note: INote, stringId: number, articulation: Articulation) => void;
    setNodeSlide: (note: INote, stringId: number, slide: boolean) => void;
    setNodeOverflow: (note: INote, stringId: number, slide: boolean) => void;
}

export const MeasureContext = createContext<MeasureContextType | undefined>(undefined);