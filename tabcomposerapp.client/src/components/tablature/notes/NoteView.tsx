import { observer } from "mobx-react-lite";
import { forwardRef, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { INote, IPause, NoteKind } from "../../../models";
import "../../../styles/NoteView.css";
import { noteRepresentationMap, pauseRepresentationMap } from "../../../utils/";

interface NoteViewProps {
    note: INote | IPause;
    onClick?: () => void; 
    isDragging?: boolean | undefined;
    showTip?: boolean;
}

export const NoteView = observer(forwardRef<HTMLDivElement, NoteViewProps>(({ note, onClick, isDragging, showTip = false }, ref) => {
    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const hoverDiv = useRef<HTMLButtonElement>(null);

    const renderTooltip = (props: React.HTMLAttributes<HTMLDivElement>) => {
        if (!showTip) return (<></>);
        return (
            <Tooltip {...props}>
                {isNote(note) && `Note ${noteRepresentationMap[note.noteDuration]} = ${note.getName()}${note.octave}` || `Pause ${pauseRepresentationMap[note.noteDuration]}`}
            </Tooltip>
        )
    }

    const handleOnMouseEnter = () => {
        if (hoverDiv.current && !isDragging) {
            hoverDiv.current.style.color = '#007bff';
        }
    }

    const handleOnMouseLeave = () => {
        if (hoverDiv.current && !isDragging) {
            hoverDiv.current.style.color = "black";
        }
    }

    return (
        <div
            draggable='false'
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => handleOnMouseEnter()}
            onMouseLeave={() => handleOnMouseLeave()}
            style={{
                display: 'flex',
                height: '100%',
                padding: "0",
                margin: '0',
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip}
                flip
            >
                <div
                    className="note-square"
                    ref={ref}
                >
                    <button
                        draggable='false'
                        className="note-input-button"
                        ref={hoverDiv}
                        style={{
                            color: note.playing && !isDragging ? '#007bff' : (isDragging ? "green" : 'black'),
                            cursor: isDragging === undefined ? "auto" : isDragging ? "grabbing" : "grab"
                        }}
                    >
                        {isNote(note) ?
                            (note.fret.toString() === 'NaN' ? ''
                                : note.fret.toString())
                            : pauseRepresentationMap[note.noteDuration]
                        }
                    </button>
                </div>
            </OverlayTrigger>    
            
        </div>
    );
}))
