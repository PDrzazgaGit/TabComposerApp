import { useState, ReactNode, useEffect } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { IMeasure, ITabulature, NoteDuration } from '../models';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';

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

    useEffect(() => {

    }, [tabulature])

    const addMeasure = (tempo: number, numerator: number, denominator: number, token: string) => {
        if (!tabulature)
            return
      //  console.log("heheh")
        const tabulatureNew = TabulatureManagerApi.cloneTabulature();
        if (!tabulatureNew) {
            return;
        }

        tabulatureNew.addMeasure(tempo, numerator, denominator);
        setTabulature(tabulatureNew);
        TabulatureManagerApi.updateTabulature(token);
       
    }

    const deleteMeasure = (measure: IMeasure, token: string) => {
        if (!tabulature)
            return
        const tabulatureNew = TabulatureManagerApi.cloneTabulature();
        if (!tabulatureNew) {
            return;
        }

        tabulatureNew.deleteMeasure(measure);
        setTabulature(tabulatureNew);
        TabulatureManagerApi.updateTabulature(token);
    }
    const copyMeasure = (measureId: number): boolean => {
        if (!tabulature)
            return false;
        const tabulatureNew = TabulatureManagerApi.cloneTabulature();
        if (!tabulatureNew) {
            return false;
        }
        const measureToCopy = tabulatureNew.getMeasure(measureId);
        if (!measureToCopy) {
            return false;
        }
        const deepClonedMeasure = measureToCopy.deepClone();
        tabulatureNew.addMeasureObject(deepClonedMeasure);
        setTabulature(tabulatureNew);
        return true;
    }

    const getMeasuresCount = () => {
        return tabulature?.getLength() || 0;
    }

    const value = {
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