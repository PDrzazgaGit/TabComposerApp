import { createContext } from 'react';
import { IMeasure, ITabulature, NoteDuration } from '../models';
import { ITabulatureRecorder, TabulaturePlayer } from '../services/audio';
interface TabulatureContextType {

    tabulaturePlayer: TabulaturePlayer;

    tabulatureRecorder: ITabulatureRecorder;

    getMeasuresCount: () => number;

    tabulature: ITabulature;


    recordTempo: number;

    setRecordTempo: (recordTempo: number) => void;

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