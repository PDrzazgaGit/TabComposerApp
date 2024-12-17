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

    const stringMargin: number = 150;

    const notes = useMemo(() => {
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
                                    left: `calc(${calculatePosition(note.getTimeStampMs() + stringMargin, 100)}%)`
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