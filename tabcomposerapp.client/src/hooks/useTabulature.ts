import { useContext } from 'react';
import { TabulatureContext } from './../context/TabulatureContext';

export const useTabulature = () => {
    const context = useContext(TabulatureContext);
    if (!context) {
        throw new Error('useTabulature must be used within an TabulatureProvider');
    }
    return context;
};