import { useState, ReactNode, useEffect } from 'react';
import { MeasureContext } from './MeasureContext';
import { Articulation, IMeasure, INote, IPause, NoteDuration } from '../models';
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

    useEffect(() => {
        setMeasure(initialMeasure)
    }, [tabulature, initialMeasure])

    const getMaxFrets = (): number => {
        return measure.frets;
    }
    const getMeasureDurationMs = (): number => {
        return measure.measureDurationMs;
    }

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        const updatedMeasure: IMeasure = measure.clone();
        updatedMeasure.changeNoteFret(note, stringId, fret);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    const changeNoteDuration = (note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (updatedMeasure.changeNoteDuration(note, newDuration, stringId)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const getStringNotes = (stringId: number): INote[] => {
        const notes: INote[] = measure.getNotes(stringId);
        if (!notes)
            throw new Error("Measure do not have such string: " + stringId + ".");
        return notes;
    }

    const deleteNote = (note: INote | IPause, stringId: number) => {
        const updatedMeasure: IMeasure = measure.clone();
        measure.deleteNote(note, stringId);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    const moveNoteRight = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteRight(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    const moveNoteLeft = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteLeft(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    const addPause = (stringId: number, noteDuration?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushPause(stringId, noteDuration ? noteDuration : NoteDuration.Quarter)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const addNote = (stringId: number, noteDuration?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushNote(0, stringId, noteDuration)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    const changeSignature = (numerator: number, denominator: number): boolean => {
        if (measure.changeSignature(numerator, denominator)) {
            const updatedMeasure: IMeasure = measure.clone();
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        } else {
            return false;
        }
    }

    const changeTempo = (tempo: number) => {
        measure.changeTempo(tempo);
        const updatedMeasure: IMeasure = measure.clone();
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    const changeArticulation = (note: INote, stringId: number, articulation: Articulation, step: number = 1): boolean => {
        if (measure.changeArticulation(note, stringId, articulation, step)) {
            const updatedMeasure: IMeasure = measure.clone();
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        } else {
            return false;
        }
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
        changeTempo,
        changeArticulation
    }
    
    return (
        <MeasureContext.Provider value={ value }>
            {children}
        </MeasureContext.Provider>
    );
};