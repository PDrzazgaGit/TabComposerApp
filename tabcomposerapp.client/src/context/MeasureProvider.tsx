import { useState, ReactNode, useEffect } from 'react';
import { MeasureContext } from './MeasureContext';
import { Articulation, IMeasure, INote, IPause, NoteDuration, NoteKind } from '../models';
import { useTabulature } from '../hooks/useTabulature';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


interface MeasureProviderProps {
    children: ReactNode;
    initialMeasure: IMeasure;
    initialMeasureId: number;
}

export const MeasureProvider: React.FC<MeasureProviderProps> = ({ children, initialMeasure, initialMeasureId }) => {

    const [measure, setMeasure] = useState<IMeasure>(initialMeasure);

    const [measureId, setMeasureId] = useState<number>(initialMeasureId);

    const { tabulature } = useTabulature();

    const { getToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        setMeasure(initialMeasure)
        
    }, [tabulature, initialMeasure])


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

    const getMaxFrets = (): number => {
        return measure.frets;
    }
    const getMeasureDurationMs = (): number => {
        return measure.measureDurationMs;
    }

    // clone here
    const changeFret = (note: INote, stringId: number, fret: number): void => {
        const updatedMeasure: IMeasure = measure.clone();
        updatedMeasure.changeNoteFret(note, stringId, fret);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    // clone here
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

    // clone here
    const deleteNote = (note: INote | IPause, stringId: number, shift: boolean) => {
        const updatedMeasure: IMeasure = measure.clone();
        measure.deleteNote(note, stringId, shift);
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    // clone here
    const moveNoteRight = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteRight(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    // clone here
    const moveNoteLeft = (note: INote | IPause, stringId: number, interval?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (!measure.moveNoteLeft(note, stringId, interval))
            return false;
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
    }

    // clone here
    const addPause = (stringId: number, noteDuration?: NoteDuration): boolean => {
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushPause(stringId, noteDuration ? noteDuration : NoteDuration.Quarter)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            return true;
        }
        return false;
    }

    // clone here
    const addNote = (stringId: number, noteDuration?: NoteDuration): boolean => {
        
        const updatedMeasure: IMeasure = measure.clone();
        if (measure.pushNote(0, stringId, noteDuration)) {
            tabulature.updateTablature(measure, updatedMeasure);
            setMeasure(updatedMeasure);
            console.log(measure);
            return true;
        }
        
        return false;
    }

    // clone here
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

    // clone here
    const changeTempo = (tempo: number) => {
        measure.changeTempo(tempo);
        const updatedMeasure: IMeasure = measure.clone();
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
    }

    // clone here
    const changeArticulation = (note: INote, stringId: number, articulation: Articulation) => {
        measure.changeArticulation(note, stringId, articulation)
        const updatedMeasure: IMeasure = measure.clone();
        tabulature.updateTablature(measure, updatedMeasure);
        setMeasure(updatedMeasure);
        return true;
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