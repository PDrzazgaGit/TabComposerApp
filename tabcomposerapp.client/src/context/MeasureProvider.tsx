import { useState, ReactNode } from 'react';
import { MeasureContext } from './MeasureContext';
import { IMeasure, INote, IPause, Note, NoteDuration } from '../models';
import { useTabulature } from '../hooks/useTabulature';


interface MeasureProviderProps {
    children: ReactNode;
    initialMeasure: IMeasure;
    initialMeasureId: number;
}

export const MeasureProvider: React.FC<MeasureProviderProps> = ({ children, initialMeasure, initialMeasureId }) => {

    const [measure, setMeasure] = useState<IMeasure>(initialMeasure);

    const [measureId, setMeasureId] = useState<number>(initialMeasureId);

    const { tabulature } = useTabulature();

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
        const updatedMeasure: IMeasure = measure.clone();
        updatedMeasure.changeNoteFret(note, stringId, fret);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    const changeNoteDuration = (note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean => {
        if (!measure) {
            throw new Error("Measure has not been initialized.");
        }
        const updatedMeasure: IMeasure = measure.clone();
        if (updatedMeasure.changeNoteDuration(note, newDuration, stringId)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const getStringNotes = (stringId: number): INote[] => {
        if (!measure)  
            throw new Error("Measure has not been initialized.");
        const notes: INote[] = measure.getNotes(stringId);
        if (!notes)
            throw new Error("Measure do not have such string: " + stringId + ".");
        return notes;
    }

    const deleteNote = (note: INote | IPause, stringId: number) => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        const updatedMeasure: IMeasure = measure.clone();
        measure.deleteNote(note, stringId);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    const moveNoteRight = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteRight(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    const moveNoteLeft = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteLeft(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    const addPause = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushPause(stringId, noteDuration ? noteDuration : NoteDuration.Quarter)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const addNote = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushNote(0, stringId, noteDuration)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const changeSignature = (numerator: number, denominator: number): boolean => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        if (measure.changeSignature(numerator, denominator)) {
            const updatedMeasure: IMeasure = measure.clone();
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            console.log("Tak");
            return true;
        } else {
            console.log("Nie");
            return false;
        }
    }

    const changeTempo = (tempo: number) => {
        if (!measure)
            throw new Error("Measure has not been initialized.")
        measure.changeTempo(tempo);
        const updatedMeasure: IMeasure = measure.clone();
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }


    const value = {
        measure,
        measureId,
        setMeasureId,
        getMaxFrets,
        getMeasureDurationMs,
        changeFret,
        changeNoteDuration,
        getStringNotes,
        deleteNote,
        moveNoteRight,
        moveNoteLeft,
        addPause,
        addNote,
        changeSignature,
        changeTempo
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};