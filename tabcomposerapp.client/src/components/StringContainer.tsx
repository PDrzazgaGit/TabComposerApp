import { useMemo } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { INote, IPause, NoteKind } from "../models";
import { NoteView } from "./NoteView";
import { PauseView } from "./PauseView";
import './../styles/StringContainer.css';

interface StringContainerProps {
    stringId: number;
    notes: (INote | IPause)[];
}

export const StringContainer: React.FC<StringContainerProps> = ({ stringId, notes }) => {

    const { getMeasureDurationMs, measureId } = useMeasure();  

    const { getTabulatureTuning } = useTabulature();

    const stringLetter = useMemo(() => {
        return getTabulatureTuning().getStringSound(stringId).getName()
    }, [getTabulatureTuning, stringId])

    const measureDuration = useMemo(() => getMeasureDurationMs(), [getMeasureDurationMs]);

    const calculatePosition = (timestamp: number, containerWidth: number) => {
        return (timestamp / measureDuration) * containerWidth;
    };


    return (
        <>
            <div className="w-100 d-flex align-items-center" style={{ height: "1.5em" }}>

                {measureId === 0 && (
                    <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringLetter}</div>
                )}

                <div style={{ flex: "1 1 auto", position: "relative", height: "100%" }}>
          
                    <div className="string-line" />
                    <div className="position-relative ms-3 me-3">
                        {notes
                            //.filter((note): note is INote => (note as INote).kind === NoteKind.Note) // Filtrujemy tylko INote
                            .map((note, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: "absolute",
                                        left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}% - 0.5em )`, // Pozycjonowanie nuty (nuta ma szerokoœæ 1 em dlatego przesuwam w lewo aby œrodek by³ w odpowiednim miejscu)
                                    }}
                                >
                                    <NoteView note={note} stringId={stringId} />
                                </div>
                            ))}
                    </div>
                    
                    
                </div>
            </div>
        </>
    );
}