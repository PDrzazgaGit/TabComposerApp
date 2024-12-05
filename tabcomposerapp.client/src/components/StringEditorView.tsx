import { useMemo, useCallback, useState, useEffect } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringView.css';
import { NoteEditorView } from "./NoteEditorView";
import { Button, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { INote, IPause, NoteDuration, NoteKind, Sound } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';
import { useError } from "../hooks/useError";

interface StringEditorViewProps {
    stringId: number;
}

export const StringEditorView: React.FC<StringEditorViewProps> = ({ stringId }) => {

    const [noteDuration, setNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);

    const [pauseDuration, setPauseDuration] = useState<NoteDuration>(NoteDuration.Quarter);

    const [isHovered, setIsHovered] = useState(false);
    
    const { measureId, measure, addNote, addPause } = useMeasure();  

    const { tabulature } = useTabulature();

    const { stringEditorErrors, setStringEditorErrors, clearStringEditorErrors } = useError();

    const stringSound: Sound = tabulature.tuning.getStringSound(stringId);

   // const [notes, setNotes] = useState<(INote | IPause)[]>(measure.getNotes(stringId));


    
    const notes = useMemo(() => {
        if (measure) {
            return measure.getNotes(stringId);
        }
        return [];
    }, [measure, stringId]); 
    
    /*
    useEffect(() => {
        setNotes(measure.getNotes(stringId));
        console.log(notes)
    }, [setNotes, measure, tabulature, stringId])
    */

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
                        className="string-line"
                        style={{
                            borderColor: isHovered ? '#17a2b8' : 'black'
                        }}
                    />
                    
                    <div className="position-relative ms-3 me-3">
                        {notes
                            .map((note, index) => (
                                <div key={index}
                                    style={{
                                        position: "absolute",
                                        height: "1.5em",
                                        left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}% - 0.5em)`,
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
}