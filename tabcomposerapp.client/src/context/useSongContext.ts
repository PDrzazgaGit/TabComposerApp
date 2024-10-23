import { useContext } from 'react';
import { SongContext } from './SongContext'

export const useSongContext = () => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error('useSongContext must be used within an SongProvider');
    }
    return context;
};