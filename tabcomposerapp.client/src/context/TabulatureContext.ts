import { createContext } from 'react';
import { IMeasure, ITabulature, NoteDuration } from '../models'
import { TabulaturePlayer } from '../services/audio/TabulaturePlayer';
import { ITabulatureRecorder } from '../services/audio/TabulatureRecorder';
interface TabulatureContextType {

    tabulaturePlayer: TabulaturePlayer;

    tabulatureRecorder: ITabulatureRecorder;

    getMeasuresCount: () => number;

    tabulature: ITabulature;

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

    addMeasure: (tempo: number, numerator: number, denominator: number) => void;

    copyMeasure: (measureId: number) => boolean;

    deleteMeasure: (measure: IMeasure) => void;
}

export const TabulatureContext = createContext<TabulatureContextType | undefined>(undefined);