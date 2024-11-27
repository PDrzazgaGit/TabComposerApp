import { useMemo, useCallback } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringContainer.css';
import { NoteEditorView } from "./NoteEditorView";

interface StringContainerProps {
    stringId: number;
}

export const StringContainer: React.FC<StringContainerProps> = ({ stringId }) => {

    const { measureId, measure, addNote } = useMeasure();  

    const { tabulature } = useTabulature();

    const notes = useMemo(() => {
        console.log(stringId);
        if (measure) {
            return measure.getNotes(stringId);
        }
        return [];
    }, [measure, stringId]); 

    const stringLetter = tabulature.tuning.getStringSound(stringId).getName();

    const calculatePosition = useCallback(
        (timestamp: number, containerWidth: number): number => {
            return (timestamp / measure.measureDurationMs) * containerWidth;
        },
        [measure]
    );

    const handleAddNote = () => {
       // console.log("eheh")
       // addNote(stringId);
    }
    
    return (
        <>
            <div onDoubleClick={handleAddNote} className="w-100 d-flex align-items-center" style={{ height: "1.5em" }}>

                {measureId === 0 && (
                    <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringLetter}</div>
                )}

                <div style={{ flex: "1 1 auto", position: "relative", height: "100%" }}>
          
                    <div className="string-line" />
                    <div className="position-relative ms-3 me-3">
                        {notes
                            //.filter((note): note is INote => (note as INote).kind === NoteKind.Note) // Filtrujemy tylko INote
                            .map((note, index) => (
                                <div key={index}
                                    style={{
                                        position: "absolute",
                                        left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}% - 0.5em)`
                                    }}
                                >
                                    <NoteEditorView note={note} stringId={stringId} />
                                </div>
                            ))}
                    </div>
                    
                    
                </div>
            </div>
        </>
    );
}