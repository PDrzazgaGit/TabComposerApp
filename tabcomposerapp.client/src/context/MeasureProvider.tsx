import { useState, ReactNode } from 'react';
import { MeasureContext } from './MeasureContext';
import { Articulation, IMeasure, INote, IPause, NoteDuration } from '../models';

interface MeasureProviderProps {
    children: ReactNode;
    measure: IMeasure;
    initialMeasureId: number;
}

export const MeasureProvider: React.FC<MeasureProviderProps> = ({ children, measure, initialMeasureId }) => {

    const [measureId, setMeasureId] = useState<number>(initialMeasureId);

    const frets = measure.frets;

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        measure.changeNoteFret(note, stringId, fret);
    }

    const changeNoteDuration = (note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean => {
        if (measure.changeNoteDuration(note, newDuration, stringId)) {
            return true;
        }
        return false;
    }

    const deleteNote = (note: INote | IPause, stringId: number, shift: boolean) => {
        measure.deleteNote(note, stringId, shift);
    }

    const moveNoteRight = (note: INote | IPause, stringId: number, jump: boolean, interval?: NoteDuration): boolean => {
        if (measure.moveNoteRight(note, stringId, jump ,interval)) {
            return true;
        }
        return false;
    }

    const moveNoteLeft = (note: INote | IPause, stringId: number, jump: boolean, interval?: NoteDuration): boolean => {
        if (measure.moveNoteLeft(note, stringId, jump, interval)) {
            return true;
        }
        return false;
    }

    const addPause = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (measure.pushPause(stringId, noteDuration ? noteDuration : NoteDuration.Quarter)) {
            return true;
        }
        return false;
    }

    const addNote = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (measure.pushNote(0, stringId, noteDuration)) {
            return true;
        }
        return false;
    }


    const changeSignature = (numerator: number, denominator: number): boolean => {
        if (measure.changeSignature(numerator, denominator)) {
            return true;
        }
        return false;
    }

    const changeTempo = (tempo: number) => {
        measure.changeTempo(tempo);
    }

    const changeArticulation = (note: INote, stringId: number, articulation: Articulation) => {
        measure.changeArticulation(note, stringId, articulation)
    }

    const setNodeSlide = (note: INote, stringId: number, slide: boolean): void => {
        measure.setSlide(note, stringId, slide)
    }

    const setNodeOverflow = (note: INote, stringId: number, overflow: boolean): void => {
        measure.setOverflow(note, stringId, overflow)
    }

    const value = {
        frets,
        measure,
        measureId,
        setMeasureId,
        changeFret,
        changeNoteDuration,
        deleteNote,
        moveNoteRight,
        moveNoteLeft,
        addPause,
        addNote,
        changeSignature,
        changeTempo,
        changeArticulation,
        setNodeSlide,
        setNodeOverflow
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};