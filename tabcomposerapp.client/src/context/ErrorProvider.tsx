import { useState, ReactNode, useMemo } from 'react';
import {  ErrorContext } from './ErrorContext';
import { AppErrors } from '../models/AppErrorsModel';

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formErrors, setFormErrors] = useState<AppErrors>({});

    const [stringEditorErrors, setStringEditorErrors] = useState<AppErrors>({});

    const [noteEditorErrors, setNoteEditorErrors] = useState<AppErrors>({}); 

    const [measureEditorErrors, setMeasureEditorErrors] = useState<AppErrors>({}); 

    const [createTabulatureErrors, setCreateTabulatureErrors] = useState<AppErrors>({}); //measureEditorErrors

    const [playerErrors, setPlayerErrors] = useState<AppErrors>({}); //measureEditorErrors

    const [userTabsErrors, setUserTabsErrors] = useState<AppErrors>({}); //measureEditorErrors

    const clearFormErrors = () => setFormErrors({});
    const clearStringEditorErrors = () => setStringEditorErrors({});
    const clearNoteEditorErrors = () => setNoteEditorErrors({});
    const clearMeasureEditorErrors = () => setMeasureEditorErrors({});
    const clearCreateTabulatureErrors = () => setCreateTabulatureErrors({});
    const clearPlayerErrors = () => setPlayerErrors({});
    const clearUserTabsErrors = () => setUserTabsErrors({});

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
            clearCreateTabulatureErrors,

            playerErrors,
            setPlayerErrors,
            clearPlayerErrors,

            userTabsErrors,
            setUserTabsErrors,
            clearUserTabsErrors

        }),
        [formErrors, stringEditorErrors, noteEditorErrors, measureEditorErrors, createTabulatureErrors, playerErrors, userTabsErrors]
    )

    return (
        <ErrorContext.Provider value={ value }>
            {children}
        </ErrorContext.Provider>
    );
};