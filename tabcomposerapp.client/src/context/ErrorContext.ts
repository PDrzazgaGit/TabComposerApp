import { createContext } from 'react';
interface ErrorContextType {
    formErrors: { [key: string]: string[] };
    setFormErrors: (newErrors: { [key: string]: string[] }) => void;
    clearFormErrors: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);