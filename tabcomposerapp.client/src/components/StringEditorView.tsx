import { useMemo, useCallback, useState, useEffect } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringView.css';
import { NoteEditorView } from "./NoteEditorView";
import { Button, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { Articulation, IMeasure, INote, IPause, NoteDuration, NoteKind, Sound } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';
import { useError } from "../hooks/useError";
import { render } from "react-dom";

interface StringEditorViewProps {
    stringId: number;
}

export const StringEditorView: React.FC<StringEditorViewProps> = ({ stringId }) => {

    const { tabulature, globalNoteDuration, measuresPerRow } = useTabulature();

    const [noteDuration, setNoteDuration] = useState<NoteDuration>(globalNoteDuration);

    const [pauseDuration, setPauseDuration] = useState<NoteDuration>(globalNoteDuration);

    const [isHovered, setIsHovered] = useState(false);
    
    const { measureId, measure, addNote, addPause } = useMeasure();  

    const { stringEditorErrors, setStringEditorErrors, clearStringEditorErrors } = useError();

    const stringSound: Sound = tabulature.tuning.getStringSound(stringId);

    const stringMargin: number = 150;

   // const [notes, setNotes] = useState<(INote | IPause)[]>(measure.getNotes(stringId));
  
    const notes = useMemo(() => {
        if (measure) {
            return measure.getNotes(stringId);
        }
        return [];
    }, [measure, stringId]); 
     
    useEffect(() => {
        setNoteDuration(globalNoteDuration);
    }, [globalNoteDuration])
    

    const calculatePosition = useCallback(
        (timestamp: number, containerWidth: number): number => {
            return (timestamp / measure.measureDurationMs) * containerWidth;
        },
        [measure]
    );

    const handleAddItem = (kind: NoteKind) => {
        switch (kind) {
            case NoteKind.Note:
                if (!addNote(stringId, noteDuration)) {
                    setStringEditorErrors({ ['noteDuration']: ["Cannot add note"] });
                } else {
                    clearStringEditorErrors();
                }
                break;
            case NoteKind.Pause:
                if (!addPause(stringId, pauseDuration)) {
                    setStringEditorErrors({ ['pauseDuration']: ["Cannot add pause"] });
                } else {
                    clearStringEditorErrors();
                }
                break;
        }
    }

    const handleSetNoteDuration = (nD: NoteDuration) => {
        if (measure.canPushNote(stringId, nD)) {
            setNoteDuration(nD)
            clearStringEditorErrors();
        } else {
            setStringEditorErrors({ ['noteDuration']: [noteRepresentationMap[nD] + " is too long"] });
        }
    }

    const handleSetPauseDuration = (pD: NoteDuration) => {  
        if (measure.canPushNote(stringId, pD)) {
            setPauseDuration(pD)
            clearStringEditorErrors();
        } else {
            setStringEditorErrors({ ['pauseDuration']: [pauseRepresentationMap[pD] + " is too long"] });
        }
    }

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={`${stringId}_${uuidv4()}`} onClick={(e) => e.stopPropagation()} {...props}
            //style={{ position: "static" }}
        >
            <Popover.Header as="h3">String {`${stringSound.getName()}${stringSound.octave}`}</Popover.Header>
            <Popover.Body >
                <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                    <Dropdown
                        as={ButtonGroup}
                        drop="end"
                       
                    >
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Note)}
                            className="flex-grow-1"
                        >
                            {`New note ${noteRepresentationMap[noteDuration]}`}

                        </Button>
                        <Dropdown.Toggle className="flex-grow-1" split variant="light" id="dropdown-split-basic" />
                      
                        <Dropdown.Menu>
                            {Object.entries(noteRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_note_duration"}
                                    onClick={() => handleSetNoteDuration(key as unknown as NoteDuration)}
                                >
                                    {symbol}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>

                    </Dropdown>
                </InputGroup>
                {stringEditorErrors["noteDuration"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {stringEditorErrors["noteDuration"]}
                        </div>
                    </InputGroup>
                )}
                
                <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                    <Dropdown
                        as={ButtonGroup}
                        drop="end"
                       
                    >
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Pause)}
                            className="flex-grow-1"
                        >
                            {`New pause ${pauseRepresentationMap[pauseDuration]}`}

                        </Button>
                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            {Object.entries(pauseRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_pause_duration"}
                                    onClick={() => handleSetPauseDuration(key as unknown as NoteDuration)}
                                >
                                    {symbol}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>                    
                </InputGroup>
                {stringEditorErrors["pauseDuration"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {stringEditorErrors["pauseDuration"]}
                        </div>
                        
                    </InputGroup>
                )}
            </Popover.Body>
        </Popover>
    )

    const handleEnter = () => {
        document.body.click();
        clearStringEditorErrors();
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
                    left: currentNoteTimeStamp !== 0 ? `calc(${startX}% + 0.6em)` : `${startX}%`,
                    width: currentNoteTimeStamp !== 0 ? `calc(${length}% - 0.6em)` : `${length}%`,
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
        const nextMeasure: IMeasure | undefined = tabulature.getMeasure(measureId + 1);
        if (!nextMeasure) {
            return 0;  
        }
        const notes = nextMeasure.getNotes(stringId);

        if (notes.length === 0) {
            return 0;
        }

        const nextNote: INote = notes[0];

        if (measureId % measuresPerRow === 2) {
            return measure.measureDurationMs + 2* stringMargin;
        }

        return measure.measureDurationMs + 3 * stringMargin + nextNote.getTimeStampMs();
        
    }

    const calculateSlideOverFlow = (): number => {
        if (measureId === 0)
            return 0;

        const prevMeasure: IMeasure | undefined = tabulature.getMeasure(measureId - 1);
        if (!prevMeasure) {
            return 0;
        }
        const notes = prevMeasure.getNotes(stringId);

        if (notes.length === 0) {
            return 0;
        }

        const prevNote: INote = notes[notes.length-1];

        if (measureId % measuresPerRow === 0) {
            return 0;
        }

        return - 1 * stringMargin - prevNote.getDurationMs();
    }

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom-start"
            overlay={renderPopover}
            onEnter={handleEnter}
            rootClose
            flip
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
                        className='string-line'
                        style={{
                            borderColor: isHovered ? '#007bff' : 'black'
                        }}
                    />
                    
                    <div className="position-relative"
                        style={{
                            marginRight: `${calculatePosition(stringMargin*2,100)}%`
                        }}
                    >
                        {notes.map((note, index) => {
                            const prevNote = index > 0 ? notes[index - 1] : null;
                            const nextNote = index < notes.length - 1 ? notes[index + 1] : null;
                            const isSlide = note.articulation === Articulation.Slide;
                            const isLegato = note.articulation === Articulation.Legato;
                            const isBendFull = note.articulation === Articulation.BendFull;
                            const isBendHalf = note.articulation === Articulation.BendHalf;
                            const isBendFullReturn = note.articulation === Articulation.BendFullReturn;
                            const isBendHalfReturn = note.articulation === Articulation.BendHalfReturn;

                            return (
                                <div key={ index}>
                                    {isSlide &&
                                        renderSlide(prevNote ? prevNote.getTimeStampMs() + stringMargin : calculateSlideOverFlow(), note.getTimeStampMs() + stringMargin, 100, prevNote ? prevNote.fret > note.fret : false)                 
                                    }
                                    {isLegato && renderLegato(nextNote ? nextNote.getTimeStampMs() + stringMargin : calculateLegatoOverflow(), note.getTimeStampMs() + stringMargin, 100)}
                                    {isBendFull && renderBend(note.getTimeStampMs() + stringMargin, note.getDurationMs(), 100, true)}
                                    {isBendHalf && renderBend(note.getTimeStampMs() + stringMargin, note.getDurationMs(), 100, false)}
                                    {isBendFullReturn && renderBendReturn(note.getTimeStampMs() + stringMargin, note.getDurationMs(), 100, true)}
                                    {isBendHalfReturn && renderBendReturn(note.getTimeStampMs() + stringMargin, note.getDurationMs(), 100, false)}
                                    <div
                                        style={{
                                            position: "absolute",
                                            height: "1.5em",
                                            left: `calc(${calculatePosition(note.getTimeStampMs() + stringMargin, 100)}%)`,
                                        }}
                                    >

                                        <NoteEditorView note={note} stringId={stringId} />
                                    </div>
                                </div>
                                
                            );
                        })}
                    </div>
                    
                </div>
            </div>
            
        </OverlayTrigger>
    );
}