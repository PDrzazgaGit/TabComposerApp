import { createContext } from 'react';
interface ErrorContextType {
    formErrors: { [key: string]: string[] };
    setFormErrors: (newErrors: { [key: string]: string[] }) => void;
    clearFormErrors: () => void;

    stringEditorErrors: { [key: string]: string[] };
    setStringEditorErrors: (newErrors: { [key: string]: string[] }) => void;
    clearStringEditorErrors: () => void;

    noteEditorErrors: { [key: string]: string[] };
    setNoteEditorErrors: (newErrors: { [key: string]: string[] }) => void;
    clearNoteEditorErrors: () => void;

    measureEditorErrors: { [key: string]: string[] };
    setMeasureEditorErrors: (newErrors: { [key: string]: string[] }) => void;
    clearMeasureEditorErrors: () => void;

    createTabulatureErrors: { [key: string]: string[] };
    setCreateTabulatureErrors: (newErrors: { [key: string]: string[] }) => void;
    clearCreateTabulatureErrors: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);