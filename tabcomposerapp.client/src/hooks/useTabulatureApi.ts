import { useContext } from 'react';
import { TabulatureApiContext } from './../context/TabulatureApiContext';

export const useTabulatureApi = () => {
    const context = useContext(TabulatureApiContext);
    if (!context) {
        throw new Error('useTabulature must be used within an TabulatureProvider');
    }
    return context;
};