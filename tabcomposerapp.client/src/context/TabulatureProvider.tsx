import { useState, useMemo, ReactNode } from 'react';
import { TabulatureContext } from './TabulatureContext';
import { Tabulature } from '../models/TabulatureModel';

export const TabulatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [tabulature, setTabulature] = useState<Tabulature | null>(null)

    const value = useMemo(
        () => ({
            tabulature,
            setTabulature
        }),
        [tabulature]
    )
    
    return (
        <TabulatureContext.Provider value={ value }>
            {children}
        </TabulatureContext.Provider>
    );
};