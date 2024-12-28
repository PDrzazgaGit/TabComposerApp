import { useState, ReactNode } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { IMeasure, ITabulature, NoteDuration } from '../models';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { TabulaturePlayer } from '../services/audio/TabulaturePlayer';

interface TabulatureProviderProps {
    children: ReactNode;
    initialtabulature: ITabulature;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children, initialtabulature }) => {

    const [tabulature, setTabulature] = useState<ITabulature>(initialtabulature);

    const [globalTempo, setGlobalTempo] = useState(100);
    const [globalNumerator, setGlobalNumerator] = useState(4);
    const [globalDenominator, setGlobalDenominator] = useState(4);
    const [globalNoteDuration, setGlobalNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);
    const [globalNoteInterval, setGlobalNoteInterval] = useState(NoteDuration.Quarter);
    const [shiftOnDelete, setShiftOnDelete] = useState(true);
    const [measuresPerRow, setMeasuresPerRow] = useState(3);

    const tabulaturePlayer: TabulaturePlayer = new TabulaturePlayer(tabulature);

    const addMeasure = (tempo: number, numerator: number, denominator: number, token: string) => {
        tabulature.addMeasure(tempo, numerator, denominator);
        TabulatureManagerApi.updateTabulature(token);
       
    }

    const deleteMeasure = (measure: IMeasure, token: string) => {
        tabulature.deleteMeasure(measure);
        TabulatureManagerApi.updateTabulature(token);
    }
    const copyMeasure = (measureId: number, token: string): boolean => {

        const measureToCopy = tabulature.getMeasure(measureId);
        if (!measureToCopy) {
            return false;
        }
        const deepClonedMeasure = measureToCopy.deepClone();
        tabulature.addMeasureObject(deepClonedMeasure);
        TabulatureManagerApi.updateTabulature(token);
        return true;
    }

    const getMeasuresCount = () => {
        return tabulature.getLength() || 0;
    }

    const value = {
        tabulaturePlayer,
        setTabulature,
        tabulature,
        addMeasure,
        deleteMeasure,

        measuresPerRow,
        setMeasuresPerRow,

        globalTempo,
        setGlobalTempo,

        globalNumerator,
        setGlobalNumerator,

        globalDenominator,
        setGlobalDenominator,

        globalNoteDuration,
        setGlobalNoteDuration,

        globalNoteInterval,
        setGlobalNoteInterval,

        shiftOnDelete,
        setShiftOnDelete,

        getMeasuresCount,
        copyMeasure
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};