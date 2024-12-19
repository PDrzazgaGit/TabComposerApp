import { useState, ReactNode, useEffect } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { IMeasure, ITabulature, NoteDuration } from '../models';
import { TabulatureManagerApi } from '../api/TabulatureManagerApi';
import { TabulatureView } from '../components/TabulatureView';

interface TabulatureProviderProps {
    children: ReactNode;
}

export const TabulatureProvider: React.FC<TabulatureProviderProps> = ({ children}) => {

    const [tabulature, setTabulature] = useState<ITabulature | null>();

    const [globalTempo, setGlobalTempo] = useState(100);
    const [globalNumerator, setGlobalNumerator] = useState(4);
    const [globalDenominator, setGlobalDenominator] = useState(4);
    const [globalNoteDuration, setGlobalNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);
    const [globalNoteInterval, setGlobalNoteInterval] = useState(NoteDuration.Quarter);
    const [shiftOnDelete, setShiftOnDelete] = useState(true);
    const [measuresPerRow, setMeasuresPerRow] = useState(3);

    useEffect(() => {

    }, [tabulature])

    const downloadTabulature = async (id: number): Promise<boolean> => {
        const downloadedTab = await TabulatureManagerApi.downloadTabulature(id);
        if (!downloadedTab) {
            return false
        }
        setTabulature(downloadedTab);
        return true;
    }

    const addTabulature = async (token: string, newTabulature: ITabulature): Promise<boolean> => {
        const success = await TabulatureManagerApi.addTabulature(token, newTabulature);
        console.log(success)
        if (!success) {
            return false
        }
        setTabulature(newTabulature);
        return true;
    }

    const updateTabulature = async (token: string): Promise<boolean> => {
        return await TabulatureManagerApi.updateTabulature(token);
    }

    const deleteTabulature = async (token: string, id: number): Promise<boolean> => {
        const success = await TabulatureManagerApi.deleteTabulature(token, id);
        if (success) {
            setTabulature(null);
        }
        return success;
    }

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

        downloadTabulature,
        addTabulature,
        updateTabulature,
        deleteTabulature,
        getMeasuresCount,
        copyMeasure
    }

    return (
        <TabulatureContext.Provider value={value}>
            {children}
        </TabulatureContext.Provider>
    );
};