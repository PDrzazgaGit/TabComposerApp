import { createContext } from 'react';
import { AppErrors } from '../models/AppErrorsModel';
interface ErrorContextType {
    formErrors: AppErrors;
    setFormErrors: (newErrors: AppErrors) => void;
    clearFormErrors: () => void;

    stringEditorErrors: AppErrors;
    setStringEditorErrors: (newErrors: AppErrors) => void;
    clearStringEditorErrors: () => void;

    noteEditorErrors: AppErrors;
    setNoteEditorErrors: (newErrors: AppErrors) => void;
    clearNoteEditorErrors: () => void;

    measureEditorErrors: AppErrors;
    setMeasureEditorErrors: (newErrors: AppErrors) => void;
    clearMeasureEditorErrors: () => void;

    createTabulatureErrors: AppErrors;
    setCreateTabulatureErrors: (newErrors: AppErrors) => void;
    clearCreateTabulatureErrors: () => void;

    playerErrors: AppErrors;
    setPlayerErrors: (newErrors: AppErrors) => void;
    clearPlayerErrors: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);