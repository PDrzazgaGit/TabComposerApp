import { useContext } from 'react';
import { ErrorContext } from '../context/ErrorContext';

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useErrorContext must be used within an ErrorProvider');
    }
    return context;
};