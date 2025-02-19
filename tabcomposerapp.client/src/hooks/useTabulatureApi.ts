import { useContext } from 'react';
import { TabulatureApiContext } from './../context/TabulatureApiContext';

export const useTabulatureApi = () => {
    const context = useContext(TabulatureApiContext);
    if (!context) {
        throw new Error('useTabulatureApi must be used within an TabulatureApiProvider');
    }
    return context;
};