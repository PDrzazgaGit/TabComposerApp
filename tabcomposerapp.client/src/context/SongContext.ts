import { createContext } from 'react';
import { Song } from '../models/SongModel'
interface SongContextType {
    song: Song | null;
    setSong: (tabulature: Song | null) => void;
}

export const SongContext = createContext<SongContextType | undefined>(undefined);