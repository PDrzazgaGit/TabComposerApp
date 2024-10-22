import { useContext } from 'react';
import { TabulatureContext } from './TabulatureContext'

export const useErrorContext = () => {
    const context = useContext(TabulatureContext);
    if (!context) {
        throw new Error('useErrorContext must be used within an ErrorProvider');
    }
    return context;
};