import { FC, useCallback, useMemo } from "react"
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { Sound } from "../models";
import { NoteView } from "./NoteView";

interface StringViewProps {
    stringId: number;
    isHovered?: boolean;
}

export const StringView: FC<StringViewProps> = ({
    stringId,
    isHovered = false
}) => {

    //const [isHovered, setIsHovered] = useState(false);

    const { measureId, measure } = useMeasure();

    const { tabulature } = useTabulature();

    const stringSound: Sound = tabulature!.tuning.getStringSound(stringId);

    const leftMargin: number = 150;

    const notes = useMemo(() => {
        console.log(stringId);
        if (measure) {
            return measure.getNotes(stringId);
        }
        return [];
    }, [measure, stringId]);


    const calculatePosition = useCallback(
        (timestamp: number, containerWidth: number): number => {
            return (timestamp / measure.measureDurationMs) * containerWidth;
        },
        [measure]
    );


    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-100 d-flex align-items-center"
            style={{ height: "1.5em" }}
        >
            {measureId === 0 && (
                <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringSound.getName()}</div>
            )}

            <div
                style={{
                    flex: "1 1 auto",
                    position: "relative",
                    height: "100%",
                }}
            >

                <div
                    className="string-line"
                    style={{
                        borderColor: isHovered ? '#17a2b8' : 'black'
                    }}
                />
                <div className="position-relative me-3">
                    {notes
                        .map((note, index) => (
                            <div key={index}
                                style={{
                                    height: "1.5em",
                                    position: "absolute",
                                    left: `calc(${calculatePosition(note.getTimeStampMs(), 100) + leftMargin}%)`
                                }}
                            >
                                <NoteView note={note}></NoteView>
                            </div>
                        ))}
                </div>
            </div>
        </div>
        
    )
}


/*


return (
        <OverlayTrigger
            trigger="click"
            placement="bottom-start"
            overlay={renderPopover}
            onEnter={handleEnter}
            rootClose
        >
            
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-100 d-flex align-items-center"     
                style={{ height: "1.5em" } }
            >


                {measureId === 0 && (
                    <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringSound.getName()}</div>
                )}

                <div
                    style={{
                        flex: "1 1 auto",
                        position: "relative",
                        height: "100%",
                    }}
                    
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
          
                    <div
                        className="string-line"
                        style={{
                            borderColor: isHovered ? '#17a2b8' : 'black'
                        }}
                    />
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
        </OverlayTrigger>
    );


*/