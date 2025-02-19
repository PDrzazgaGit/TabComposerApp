import { FC } from "react";
import { useMeasure, useTabulature } from "../../../hooks";
import { Articulation, IMeasure, INote, Sound } from "../../../models";
import "../../../styles/StringView.css";
import { NoteView } from "../notes";

interface StringViewProps {
    stringId: number;
}

export const StringView: FC<StringViewProps> = ({
    stringId
}) => {

    const { measureId, measure } = useMeasure();

    const { tabulature, measuresPerRow } = useTabulature();

    const stringSound: Sound = tabulature!.tuning.getStringSound(stringId);

    const calculatePosition = (timestamp: number, containerWidth: number): number => {
        return (timestamp / measure.measureDurationMs) * containerWidth;
    }


    const renderSlide = (prevNoteTimeStamp: number, currentNoteTimeStamp: number, containerWidth: number, down: boolean) => {
        const startX = calculatePosition(prevNoteTimeStamp, containerWidth); // pocz¹tek prawej nuty
        const endX = calculatePosition(currentNoteTimeStamp, containerWidth); // koniec lewej nuty

        const dx = endX - startX; // ró¿nica na osi X

        return (
            <svg
                style={{
                    position: 'absolute',
                    left: prevNoteTimeStamp !== 0 ? `calc(${startX}% + 0.6em)` : `${startX}%`,
                    width: prevNoteTimeStamp !== 0 ? `calc(${dx}% - 0.6em)` : `${dx}%`,
                    // top: '-0.25em',
                    height: '1.5em',
                    overflow: 'visible',
                }}
                viewBox={`0 -1.55555 ${dx} 3`} preserveAspectRatio="none"
            >
                <line
                    x1="0" y1={down ? "-0.5" : "0.5"}
                    x2={dx} y2={down ? "0.5" : "-0.5"}
                    stroke="gray"
                    strokeWidth="0.25"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    const renderLegato = (nextNoteTimeStamp: number, currentNoteTimeStamp: number, containerWidth: number) => {

        if (nextNoteTimeStamp === 0)
            return;

        const startX = calculatePosition(currentNoteTimeStamp, containerWidth); // pocz¹tek prawej nuty
        const endX = calculatePosition(nextNoteTimeStamp, containerWidth); // koniec lewej nuty

        const length = endX - startX;
        const controlPointY = -2.5; // Wysokoœæ krzywizny ³uku

        return (
            <svg
                style={{
                    position: 'absolute',
                    background: 'transparent',
                    left: currentNoteTimeStamp !== 0 ? `calc(${startX}% + 0.3em)` : `${startX}%`,
                    width: currentNoteTimeStamp !== 0 ? `calc(${length}% - 0.0em)` : `${length}%`,
                    top: `-0.25`,
                    height: '1.5em',
                    overflow: 'visible',
                }}
                viewBox={`0 -0.5 ${length} 3`} preserveAspectRatio="none"
            >
                <path
                    d={`M 0,0 Q ${length / 2},${controlPointY} ${length},0`}
                    fill="transparent"
                    stroke="gray"
                    strokeWidth="0.25"
                />
            </svg>
        );
    };

    const renderBend = (
        noteTimeStamp: number,
        noteDuration: number,
        containerWidth: number,
        full: boolean
    ) => {
        const startX = calculatePosition(noteTimeStamp, containerWidth);
        const endX = calculatePosition(noteTimeStamp + noteDuration, containerWidth);

        const length = endX - startX;

        const lengthRatio = length * 3 / 4;

        const text: string = full ? 'full' : '1/2'

        return (
            <svg
                style={{
                    position: 'absolute',
                    background: 'transparent',
                    left: `calc(${startX}% + 0.6em)`,
                    width: `calc(${length}% - 0.6em)`,
                    top: '-0.25em',
                    height: '1.5em',
                    overflow: 'visible',
                }}
                viewBox={`0 -2 ${length} 3`} preserveAspectRatio="none"
            >
                <path
                    d={`M 0 0 Q ${lengthRatio} 0 ${(lengthRatio)} -3.5`}
                    stroke="gray"
                    strokeWidth="0.25"
                    fill="transparent"
                    strokeLinecap="round"
                />
                <polygon
                    points={`
                    ${lengthRatio - 1},-3.5 
                    ${lengthRatio + 1},-3.5 
                    ${lengthRatio},-4.5
                `}
                    fill="gray"
                />
                <text
                    x={lengthRatio}
                    y="-4.5"
                    textAnchor="middle"
                    fontSize="1.5"
                    fontWeight="700"
                    letterSpacing="0.2em"
                    fill="gray"
                    fontFamily="Arial, sans-serif"
                >
                    {text}
                </text>

            </svg>
        );
    };

    const renderBendReturn = (
        noteTimeStamp: number,
        noteDuration: number,
        containerWidth: number,
        full: boolean
    ) => {
        const startX = calculatePosition(noteTimeStamp, containerWidth);
        const endX = calculatePosition(noteTimeStamp + noteDuration, containerWidth);

        const length = endX - startX;

        const lengthRatio = length * 0.75;

        const lengthReturn = length * 0.95;

        const text: string = full ? 'full' : '1/2'

        return (
            <svg
                style={{
                    position: 'absolute',
                    background: 'transparent',
                    left: `calc(${startX}% + 0.6em)`,
                    width: `calc(${length}% - 0.6em)`,
                    top: '-0.25em',
                    height: '1.5em',
                    overflow: 'visible',
                }}
                viewBox={`0 -2 ${length} 3`} preserveAspectRatio="none"
            >
                <path
                    d={`M 0 0 Q ${lengthRatio} 0 ${(lengthRatio)} -3.5`}
                    stroke="gray"
                    strokeWidth="0.25"
                    fill="transparent"
                    strokeLinecap="round"
                />
                <polygon
                    points={`
                    ${lengthRatio - 1},-3.5 
                    ${lengthRatio + 1},-3.5 
                    ${lengthRatio},-4.5
                `}
                    fill="gray"
                />
                <path
                    d={`M ${lengthRatio} -3.5 Q ${lengthReturn} -3.5 ${lengthReturn} 0`}
                    stroke="gray"
                    strokeWidth="0.25"
                    fill="transparent"
                    strokeLinecap="round"
                />

                <polygon
                    points={`
                    ${lengthReturn - 1},-1 
                    ${lengthReturn + 1},-1 
                    ${lengthReturn},0
                `}
                    fill="gray"
                />

                <text
                    x={lengthRatio}
                    y="-4.5"
                    textAnchor="middle"
                    fontSize="1.5"
                    fontWeight="700"
                    letterSpacing="0.2em"
                    fill="gray"
                    fontFamily="Arial, sans-serif"
                >
                    {text}
                </text>

            </svg>
        );
    };

    const calculateLegatoOverflow = (): number => {
        const nextMeasure: IMeasure | undefined = tabulature!.getMeasure(measureId + 1);
        if (!nextMeasure) {
            return 0;
        }
        const notes = nextMeasure.getNotes(stringId);

        if (notes.length === 0) {
            return 0;
        }

        const nextNote: INote = notes[0];

        if (measureId % measuresPerRow === 2) {
            return measure.measureDurationMs;
        }

        return measure.measureDurationMs + nextNote.getTimeStampMs();

    }

    const calculateSlideOverFlow = (): number => {
        if (measureId === 0)
            return 0;

        const prevMeasure: IMeasure | undefined = tabulature!.getMeasure(measureId - 1);
        if (!prevMeasure) {
            return 0;
        }
        const notes = prevMeasure.getNotes(stringId);

        if (notes.length === 0) {
            return 0;
        }

        const prevNote: INote = notes[notes.length - 1];

        if (measureId % measuresPerRow === 0) {
            return 0;
        }

        return - (prevMeasure.measureDurationMs - prevNote.getTimeStampMs());
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
                        borderColor: 'black'
                    }}
                />
                <div
                    className="position-relative"
                >
                    {measure.getNotes(stringId).map((note, index) => {
                        const prevNote = index > 0 ? measure.getNotes(stringId)[index - 1] : null;
                        const nextNote = index < measure.getNotes(stringId).length - 1 ? measure.getNotes(stringId)[index + 1] : null;
                        const isSlide = note.slide;
                        const isLegato = note.articulation === Articulation.Legato;
                        const isBendFull = note.articulation === Articulation.BendFull;
                        const isBendHalf = note.articulation === Articulation.BendHalf;
                        const isBendFullReturn = note.articulation === Articulation.BendFullReturn;
                        const isBendHalfReturn = note.articulation === Articulation.BendHalfReturn;
                        return (
                            <div key={index}>
                                {isSlide && note.overflow &&
                                    renderSlide(prevNote ? prevNote.getTimeStampMs() : calculateSlideOverFlow(), note.getTimeStampMs(), 100, prevNote ? prevNote.fret > note.fret : false)
                                    || (isSlide && !note.overflow) &&
                                    renderSlide(note.getTimeStampMs() - 50, note.getTimeStampMs(), 100, false)
                                }
                                {isLegato && renderLegato(nextNote ? nextNote.getTimeStampMs() : calculateLegatoOverflow(), note.getTimeStampMs(), 100)}
                                {isBendFull && renderBend(note.getTimeStampMs(), note.getDurationMs(), 100, true)}
                                {isBendHalf && renderBend(note.getTimeStampMs(), note.getDurationMs(), 100, false)}
                                {isBendFullReturn && renderBendReturn(note.getTimeStampMs(), note.getDurationMs(), 100, true)}
                                {isBendHalfReturn && renderBendReturn(note.getTimeStampMs(), note.getDurationMs(), 100, false)}
                                <div
                                    style={{
                                        position: "absolute",
                                        height: "1.5em",
                                        left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}%)`,
                                    }}
                                >
                                    <NoteView showTip={true} note={note}></NoteView>
                                </div>
                            </div>

                        );
                    })}
                </div>
            </div>
        </div>

    )
}