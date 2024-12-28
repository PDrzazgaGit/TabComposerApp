import { forwardRef, useState } from "react";
import { INote, IPause, NoteKind } from "../../../models";
import { pauseRepresentationMap } from "../../../utils/noteUtils";
import "../../../styles/NoteView.css"
import { observer } from "mobx-react-lite";

interface NoteViewProps {
    note: INote | IPause;
    onClick?: () => void; 
}

export const NoteView = observer(forwardRef<HTMLDivElement, NoteViewProps>(({ note, onClick }, ref) => {
    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const [isHovered, setIsHovered] = useState(false);

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
                    className="note-input-button"
                    style={{
                        color: isHovered || note.playing ? '#007bff' : 'black'
                    }}
                >
                    {isNote(note) ?
                        (note.fret.toString() === 'NaN' ? ''
                            : note.fret.toString())
                        : pauseRepresentationMap[note.noteDuration]
                    }
                </button>
            </div>
        </div>
    );
}))