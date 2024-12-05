import { useState, ReactNode, useMemo } from 'react';
import {  ErrorContext } from './ErrorContext';

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});

    const [stringEditorErrors, setStringEditorErrors] = useState<{ [key: string]: string[] }>({});

    const [noteEditorErrors, setNoteEditorErrors] = useState<{ [key: string]: string[] }>({}); 

    const [measureEditorErrors, setMeasureEditorErrors] = useState<{ [key: string]: string[] }>({}); 

    const [createTabulatureErrors, setCreateTabulatureErrors] = useState<{ [key: string]: string[] }>({}); //measureEditorErrors

    const clearFormErrors = () => setFormErrors({});
    const clearStringEditorErrors = () => setStringEditorErrors({});
    const clearNoteEditorErrors = () => setNoteEditorErrors({});
    const clearMeasureEditorErrors = () => setMeasureEditorErrors({});
    const clearCreateTabulatureErrors = () => setCreateTabulatureErrors({});

    const value = useMemo(
        () => ({
            formErrors,
            setFormErrors,
            clearFormErrors,

            stringEditorErrors,
            setStringEditorErrors,
            clearStringEditorErrors,

            noteEditorErrors,
            setNoteEditorErrors,
            clearNoteEditorErrors,

            measureEditorErrors,
            setMeasureEditorErrors,
            clearMeasureEditorErrors,

            createTabulatureErrors,
            setCreateTabulatureErrors,
            clearCreateTabulatureErrors
        }),
        [formErrors, stringEditorErrors, noteEditorErrors, measureEditorErrors, createTabulatureErrors]
    )

    return (
        <ErrorContext.Provider value={ value }>
            {children}
        </ErrorContext.Provider>
    );
};