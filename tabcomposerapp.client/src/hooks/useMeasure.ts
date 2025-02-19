import { useContext } from 'react';
import { MeasureContext } from './../context/MeasureContext'

export const useMeasure = () => {
    const context = useContext(MeasureContext);
    if (!context) {
        throw new Error('useMeasureContext must be used within an MeasureProvider');
    }
    return context;
};