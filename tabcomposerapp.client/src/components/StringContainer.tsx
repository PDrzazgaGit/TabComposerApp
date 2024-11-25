import { useMemo } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringContainer.css';

interface StringContainerProps {
    stringId: number;
}

export const StringContainer: React.FC<StringContainerProps> = ({ stringId }) => {

    const { measureId, getStringNotes } = useMeasure();  

    const { getTabulatureTuning } = useTabulature();

    const stringLetter = useMemo(() => {
        return getTabulatureTuning().getStringSound(stringId).getName()
    }, [getTabulatureTuning, stringId])

    return (
        <>
            <div className="w-100 d-flex align-items-center" style={{ height: "1.5em" }}>

                {measureId === 0 && (
                    <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringLetter}</div>
                )}

                <div style={{ flex: "1 1 auto", position: "relative", height: "100%" }}>
          
                    <div className="string-line" />
                    <div className="position-relative ms-3 me-3">
                        {getStringNotes(stringId)
                            //.filter((note): note is INote => (note as INote).kind === NoteKind.Note) // Filtrujemy tylko INote
                            .map((note, index) => (
                                <div key={index} >
                                    <NoteView note={note} stringId={stringId} />
                                </div>
                            ))}
                    </div>
                    
                    
                </div>
            </div>
        </>
    );
}