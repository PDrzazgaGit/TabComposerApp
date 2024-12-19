import { createContext } from 'react';
import { IMeasure, ITabulature, NoteDuration } from '../models'
interface TabulatureContextType {

    getMeasuresCount: () => number;

    tabulature: ITabulature | null;
    setTabulature: (tabulature: ITabulature | null) => void;

    measuresPerRow: number;
    setMeasuresPerRow: (measures: number) => void;

    globalTempo: number;
    setGlobalTempo: (tempo: number) => void;

    globalNumerator: number;
    setGlobalNumerator: (numerator: number) => void;

    globalDenominator: number;
    setGlobalDenominator: (denominator: number) => void;

    globalNoteDuration: NoteDuration;
    setGlobalNoteDuration: (noteDuration: NoteDuration) => void;

    globalNoteInterval: NoteDuration;
    setGlobalNoteInterval: (noteInterval: NoteDuration) => void;

    shiftOnDelete: boolean;
    setShiftOnDelete: (shift: boolean) => void;

    downloadTabulature: (id: number) => Promise<boolean>

    addTabulature: (token: string, newTabulature: ITabulature) => Promise<boolean>

    updateTabulature: (token: string) => Promise<boolean> 

    deleteTabulature: (token: string, id: number) => Promise<boolean> 

    addMeasure: (tempo: number, numerator: number, denominator: number, token: string) => void;

    copyMeasure: (measureId: number) => boolean;

    deleteMeasure: (measure: IMeasure, token: string) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);