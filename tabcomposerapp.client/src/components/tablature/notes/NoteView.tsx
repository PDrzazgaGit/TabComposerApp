import { forwardRef, useState, useEffect } from "react";
import { INote, IPause, NoteKind } from "../../../models";
import { pauseRepresentationMap } from "../../../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';
import "../../../styles/NoteView.css"

interface NoteViewProps {
    note: INote | IPause;
    onGenerateId?: (id: string) => void;
    onClick?: () => void; 
}

export const NoteView = forwardRef<HTMLDivElement, NoteViewProps>(({ note, onGenerateId, onClick }, ref) => {
    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const [isHovered, setIsHovered] = useState(false);

    const [noteId] = useState<string>(`note-${uuidv4()}`);

    useEffect(() => {
        if (onGenerateId) {
            onGenerateId(noteId);
        }
    }, [noteId, onGenerateId]);
    
    return (
        <div
            ref={ref}
            onClick={onClick} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                height: '100%',
                padding: "0",
                margin: '0',
                justifyContent: "center",
                alignItems: "center"
            }}
        >
        
            <div
                className="note-square"
            >
                <button
                    id={noteId}
                    className="note-input-button"
                    style={{
                        color: isHovered ? '#007bff' : 'black',
                    }}
                >
                    {isNote(note) ? (note.fret.toString() === 'NaN' ? '' : note.fret.toString()) : pauseRepresentationMap[note.noteDuration]}
                </button>
            </div>
        </div>
    );
});
