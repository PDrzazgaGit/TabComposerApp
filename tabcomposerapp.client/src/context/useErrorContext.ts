import { useContext } from 'react';
import { ErrorContext } from './ErrorContext'

export const useErrorContext = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useErrorContext must be used within an ErrorProvider');
    }
    return context;
};