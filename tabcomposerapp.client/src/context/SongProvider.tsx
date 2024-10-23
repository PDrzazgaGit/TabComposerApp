import { useState, useMemo, ReactNode } from 'react';
import { SongContext } from './SongContext';
import { Song } from '../models/SongModel';

export const SongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [song, setSong] = useState<Song | null>(null)

    const value = useMemo(
        () => ({
            song,
            setSong
        }),
        [song]
    )
    
    return (
        <SongContext.Provider value={ value }>
            {children}
        </SongContext.Provider>
    );
};