import { FC } from "react"
import { useMeasure } from "../../../hooks/useMeasure";
import { useTabulature } from "../../../hooks/useTabulature";
import { Sound } from "../../../models";
import { NoteView } from "../notes/NoteView";
import "../../../styles/StringView.css"
import { observer } from "mobx-react-lite";

interface StringViewProps {
    stringId: number;
    isHovered?: boolean;
}

export const StringView: FC<StringViewProps> = observer(({
    stringId,
    isHovered = false
}) => {

    const { measureId, measure } = useMeasure();

    const { tabulature } = useTabulature();

    const stringSound: Sound = tabulature!.tuning.getStringSound(stringId);

    const stringMargin: number = 150;

    const calculatePosition = (timestamp: number, containerWidth: number): number => {
        return (timestamp / measure.measureDurationMs) * containerWidth;
    }

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
                <div
                    className="position-relative"
                    style={{
                        marginRight: `${calculatePosition(stringMargin * 2, 100)}%`
                    }}
                >
                    {measure.getNotes(stringId)
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
})