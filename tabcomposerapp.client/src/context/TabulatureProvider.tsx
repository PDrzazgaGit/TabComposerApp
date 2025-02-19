import { ReactNode, useMemo, useState } from 'react';
import { IMeasure, ITabulature, NoteDuration } from '../models';
import { TabulaturePlayer, TabulatureRecorder } from '../services/audio';
import { TabulatureContext } from './TabulatureContext';

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

    const [recordTempo, setRecordTempo] = useState(1);

    const tabulaturePlayer: TabulaturePlayer = useMemo(() => new TabulaturePlayer(tabulature),[tabulature])
    const tabulatureRecorder: TabulatureRecorder = useMemo(() => new TabulatureRecorder(tabulature, 20, 1500), [tabulature])

    const addMeasure = (tempo: number, numerator: number, denominator: number) => {
        tabulature.addMeasure(tempo, numerator, denominator);     
    }

    const deleteMeasure = (measure: IMeasure) => {
        tabulature.deleteMeasure(measure);
    }

    const copyMeasure = (measureId: number): boolean => {

        const measureToCopy = tabulature.getMeasure(measureId);
        if (!measureToCopy) {
            return false;
        }
        const deepClonedMeasure = measureToCopy.deepClone();
        tabulature.addMeasureObject(deepClonedMeasure);
        return true;
    }

    const getMeasuresCount = () => {
        return tabulature.getLength() || 0;
    }

    const value = {
        tabulatureRecorder,
        tabulaturePlayer,
        setTabulature,
        tabulature,
        addMeasure,
        deleteMeasure,

        measuresPerRow,
        setMeasuresPerRow,

        recordTempo,
        setRecordTempo,

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