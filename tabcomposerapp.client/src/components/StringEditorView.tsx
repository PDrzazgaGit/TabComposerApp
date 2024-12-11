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

    const { tabulature, globalNoteDuration } = useTabulature();

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
                    top: '-0.25em',
                    height: '2em',
                    overflow: 'visible',
                }}
                viewBox={`0 -1 ${dx} 2`} preserveAspectRatio="none"
            >
                <line
                    x1="0" y1={down ? "-0.25" : "0.25"}
                    x2={dx} y2={down ? "0.25" : "-0.25"}
                    stroke="gray"
                    strokeWidth="0.1"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    const renderLegato = (nextNoteTimeStamp: number, currentNoteTimeStamp: number, containerWidth: number) => {
        const startX = calculatePosition(currentNoteTimeStamp, containerWidth); // pocz¹tek prawej nuty
        const endX = calculatePosition(nextNoteTimeStamp, containerWidth); // koniec lewej nuty

        const topHeight = 0.75; // Wysokoœæ nad nutkami
        const length = endX - startX;
        const controlPointY = -5; // Wysokoœæ krzywizny ³uku

        return (
            <svg
                style={{
                    position: 'absolute',
                    background: 'transparent',
                    left: currentNoteTimeStamp !== 0 ? `calc(${startX}% + 0.6em)` : `${startX}%`,
                    width: currentNoteTimeStamp !== 0 ? `calc(${length}% - 0.6em)` : `${length}%`,
                    top: `calc(${topHeight}em)`,
                    height: '1.5em',
                    overflow: 'visible',
                }}
                viewBox={`0 3 ${length} 10`} preserveAspectRatio="none"
            >
                <path
                    d={`M 0,0 Q ${length / 2},${controlPointY} ${length},0`}
                    fill="transparent"
                    stroke="black"
                    strokeWidth="1"
                />
            </svg>
        );
    };

    const renderBend = (noteTimeStamp: number, noteDuration: number, containerWidth: number, full: boolean) => {
        const positionX = calculatePosition(noteTimeStamp, containerWidth);
        const endX = calculatePosition(noteTimeStamp + noteDuration, containerWidth);
        const dx = endX - positionX;

        return (
            <svg
                style={{
                    position: 'absolute',
                    left: `calc(${positionX}% + 0.5em)`,
                    top: '-1em',
                    width: '2em',
                    height: '2em',
                    overflow: 'visible',
                }}
                viewBox="0 0 20 20" preserveAspectRatio="none"
            >
                <path
                    d={`M 0 18 L ${dx / 2} -5 L ${dx} 18`}
                    fill="transparent"
                    stroke="black"
                    strokeWidth="1.5"
                />
                <text
                    x={dx / 2}
                    y="-7"
                    textAnchor="middle"
                    fontSize="6"
                    fill="black"
                >
                    {full ? 'full' : '1/2'}
                </text>
            </svg>
        );
    };






    const calculateLegatoOverflow = (): number => {
        const nexMeasure: IMeasure | undefined = tabulature.getMeasure(measureId + 1);
        if (!nexMeasure) {
            throw new Error("Cannot add legato.")    
        }
        const notes = nexMeasure.getNotes(stringId);

        if (notes.length === 0) {
            throw new Error("Cannot add legato.") 
        }

        const nextNote: INote = notes[0];
        if (nextNote.kind === NoteKind.Pause) {
            throw new Error("Cannot add legato.") 
        }

        return measure.measureDurationMs + 3 * stringMargin + nextNote.getTimeStampMs();
        
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

                            return (
                                <div key={ index}>
                                    {isSlide &&
                                        renderSlide(prevNote ? prevNote.getTimeStampMs() + stringMargin : 0, note.getTimeStampMs() + stringMargin, 100, prevNote ? prevNote.fret > note.fret : false)                 
                                    }
                                    {isLegato && renderLegato(nextNote ? nextNote.getTimeStampMs() + stringMargin : calculateLegatoOverflow(), note.getTimeStampMs() + stringMargin, 100)}
                                    {isBendFull && renderBend(note.getTimeStampMs() + stringMargin, note.getDurationMs(), 100, true)}
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