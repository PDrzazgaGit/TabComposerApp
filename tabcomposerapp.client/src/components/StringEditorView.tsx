import { useMemo, useCallback, useState, useEffect } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringView.css';
import { NoteEditorView } from "./NoteEditorView";
import { Button, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { Articulation, INote, IPause, NoteDuration, NoteKind, Sound } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';
import { useError } from "../hooks/useError";

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

    const renderSlide = (prevNote: INote, currentNote: INote, containerWidth: number) => {
        const startX = calculatePosition(prevNote.getTimeStampMs(), containerWidth); // pocz¹tek prawej nuty
        const endX = calculatePosition(currentNote.getTimeStampMs(), containerWidth); // koniec lewej nuty

        const startY = -2.25; // górny pocz¹tek prawej nuty
        const endY = 0.75;     // dolny koniec lewej nuty

        const dx = endX - startX; // ró¿nica na osi X
        const dy = startY - endY; // ró¿nica na osi Y (zale¿na od pozycji nutek)

        const length = Math.sqrt(dx * dx + dy * dy); // d³ugoœæ odcinka
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // k¹t obrotu

        return (
            <div
                style={{
                    position: 'absolute',
                    left: `calc(${startX}% + 0.25em)`, // Przesuniêcie wzglêdem prawej nuty
                    top: `${endY}em`, // Ustawienie na osi Y na poziomie prawej nuty
                    width: `calc(${length}% - 0.75em)`, // Skrócenie z obu stron
                    height: "1px", // Gruboœæ kreski
                    backgroundColor: "black",
                    transform: `rotate(${angle}deg)`, // Obrót zgodnie z obliczonym k¹tem
                    transformOrigin: "center", // Obrót wzglêdem œrodka
                }}
            />
        );
    };

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
                    
                    <div className="position-relative ms-3 me-3">
                        {notes.map((note, index) => {
                            const prevNote = index > 0 ? notes[index - 1] : null;
                            const isSlide = note.articulation === Articulation.Slide;

                            return (
                                <>
                                    {prevNote && isSlide && renderSlide(prevNote, note, 100)}
                                    <div
                                        key={index}
                                        style={{
                                            position: "absolute",
                                            height: "1.5em",
                                            left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}% - 0.5em)`,
                                        }}
                                    >

                                        <NoteEditorView note={note} stringId={stringId} />
                                    </div>
                                </>
                                
                            );
                        })}
                    </div>
                    
                </div>
            </div>
            
        </OverlayTrigger>
    );

}
// d³ugoœæ kreski slide albo bendów w zale¿noœci od noteDurationMs <3

/*

<div className="position-relative ms-3 me-3">
    {notes.map((note, index) => {
        const prevNote = index > 0 ? notes[index - 1] : null;

        // Pozycja aktualnej nuty
        const currentNotePos = calculatePosition(note.getTimeStampMs(), 100);

        // Pozycja poprzedniej nuty (jeœli istnieje)
        const prevNotePos = prevNote
            ? calculatePosition(prevNote.getEndTimeStampMs(), 100)
            : currentNotePos - 5; // D³ugoœæ domyœlna dla pierwszej nuty

        return (
            <div
                key={index}
                style={{
                    position: "absolute",
                    height: "1.5em",
                    left: `calc(${currentNotePos}% - 0.5em)`,
                }}
            >
                {note.articulation === Articulation.Slide && (
                    <div
                        className="slide-line"
                        style={{
                            position: "absolute",
                            width: `calc(${currentNotePos - prevNotePos}%)`,
                            height: "2px",
                            backgroundColor: "black",
                            left: `calc(-${currentNotePos - prevNotePos}% + 0.5em)`,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    />
                )}
                <NoteEditorView note={note} stringId={stringId} />
            </div>
        );
    })}
</div>

*/