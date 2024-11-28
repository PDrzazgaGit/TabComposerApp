import { useState, useEffect, forwardRef } from 'react';
import { INote, NoteKind, IPause } from '../models';
import { pauseRepresentationMap } from "../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';
import './../styles/NoteView.css';

interface NoteViewProps {
    note: INote | IPause;
    onNoteValue?: (value: string) => void;
    onGenerateId?: (id: string) => void;
    onClick?: () => void; 
}

export const NoteView = forwardRef<HTMLDivElement, NoteViewProps>(({ note, onNoteValue, onGenerateId, onClick }, ref) => {
    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const [isHovered, setIsHovered] = useState(false);

    const [noteId] = useState<string>(`note-${uuidv4()}`);

    const [noteValue, setNoteValue] = useState<string>(
        isNote(note) ? note.fret.toString() : pauseRepresentationMap[note.noteDuration]
    );



    useEffect(() => {
        setNoteValue(isNote(note) ? note.fret.toString() : pauseRepresentationMap[note.noteDuration]);
        if (onNoteValue) {
            onNoteValue(noteValue);
        }
    }, [note, noteValue, onNoteValue]);

    
    useEffect(() => {
        if (onGenerateId) {
            onGenerateId(noteId);
        }
    }, [noteId, onGenerateId]);
    
    return (
        <div
            ref={ref}
            className="note-container"
            onClick={onClick} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: 'white',//isHovered ? '#28a745' : 'white', // Dla lepszego efektu wizualnego
                borderRadius: '2em', // Zaokr¹glenie naro¿ników
            }}
        >
            <div className="note-square">
                <button
                    id={noteId}
                    className="note-input-button"
                    style={{
                        color: isHovered ? '#17a2b8' : 'black',
                    }}
                >
                    {noteValue}
                </button>
            </div>
        </div>
    );
});
