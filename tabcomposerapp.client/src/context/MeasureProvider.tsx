/* eslint-disable react-hooks/exhaustive-deps */
import { useState, ReactNode, useEffect } from 'react';
import { MeasureContext } from './MeasureContext';
import { Articulation, IMeasure, INote, IPause, NoteDuration } from '../models';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


interface MeasureProviderProps {
    children: ReactNode;
    measure: IMeasure;
    initialMeasureId: number;
}

export const MeasureProvider: React.FC<MeasureProviderProps> = ({ children, measure, initialMeasureId }) => {

    const [measureId, setMeasureId] = useState<number>(initialMeasureId);

    const { getToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUpdate = async () => {
            const token = await getToken();
            if (!token) {
                navigate("/login");
                return;
            }
            TabulatureManagerApi.updateTabulature(token); 
        }
        fetchUpdate();

    }, [measure])

    const update = async () => {
        const token = await getToken();
        if (!token) {
            navigate("/login");
            return;
        }
        TabulatureManagerApi.updateTabulature(token); 
    }

    const getMaxFrets = (): number => {
        return measure.frets;
    }
    const getMeasureDurationMs = (): number => {
        return measure.measureDurationMs;
    }

    const changeFret = (note: INote, stringId: number, fret: number): void => {
        measure.changeNoteFret(note, stringId, fret);
        update();
    }

    const changeNoteDuration = (note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean => {
        if (measure.changeNoteDuration(note, newDuration, stringId)) {
            update();
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

    const deleteNote = (note: INote | IPause, stringId: number, shift: boolean) => {
        measure.deleteNote(note, stringId, shift);
        update();
    }

    const moveNoteRight = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        if (measure.moveNoteRight(note, stringId, interval)) {
            update();
            return true;
        }
        return false;
    }

    const moveNoteLeft = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        if (measure.moveNoteLeft(note, stringId, interval)) {
            update();
            return true;
        }
        return false;
    }

    const addPause = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (measure.pushPause(stringId, noteDuration ? noteDuration : NoteDuration.Quarter)) {
            update();
            return true;
        }
        return false;
    }

    const addNote = (stringId: number, noteDuration?: NoteDuration): boolean => {
        if (measure.pushNote(0, stringId, noteDuration)) {
            update();
            return true;
        }
        return false;
    }


    const changeSignature = (numerator: number, denominator: number): boolean => {
        if (measure.changeSignature(numerator, denominator)) {
            update();
            return true;
        }
        return false;
    }

    const changeTempo = (tempo: number) => {
        measure.changeTempo(tempo);
        update();
    }

    const changeArticulation = (note: INote, stringId: number, articulation: Articulation) => {
        measure.changeArticulation(note, stringId, articulation)
        update();
    }

    const setNodeSlide = (note: INote, stringId: number, slide: boolean): void => {
        measure.setSlide(note, stringId, slide)
        update();
    }

    const setNodeOverflow = (note: INote, stringId: number, overflow: boolean): void => {
        measure.setOverflow(note, stringId, overflow)
        update();
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