import { useState, ReactNode, useMemo } from 'react';
import {  ErrorContext } from './ErrorContext';

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});

    const clearFormErrors = () => setFormErrors({});

    const value = useMemo(
        () => ({
            formErrors,
            setFormErrors,
            clearFormErrors
        }),
        [formErrors]
    )

    return (
        <ErrorContext.Provider value={ value }>
            {children}
        </ErrorContext.Provider>
    );
};