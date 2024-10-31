import { useContext } from 'react';
import { MeasureContext } from './../context/MeasureContext'

export const useMeasure = () => {
    const context = useContext(MeasureContext);
    if (!context) {
        throw new Error('useSongContext must be used within an SongProvider');
    }
    return context;
};