import { useMemo, useCallback, useState } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringView.css';
import { NoteEditorView } from "./NoteEditorView";
import { Button, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { Note, NoteDuration, NoteKind, Sound } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";
import { v4 as uuidv4 } from 'uuid';

interface StringEditorViewProps {
    stringId: number;
}

export const StringEditorView: React.FC<StringEditorViewProps> = ({ stringId }) => {

    const [noteDuration, setNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);

    const [pauseDuration, setPauseDuration] = useState<NoteDuration>(NoteDuration.Quarter);

    const [isHovered, setIsHovered] = useState(false);

    const { measureId, measure, addNote, addPause } = useMeasure();  

    const { tabulature } = useTabulature();

    const stringSound: Sound = tabulature.tuning.getStringSound(stringId);

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

    const handleAddItem = (kind: NoteKind) => {
        switch (kind) {
            case NoteKind.Note:
                addNote(stringId, noteDuration);
                break;
            case NoteKind.Pause:
                console.log("Hello")
                addPause(stringId, pauseDuration);
                break;
        }
    }

    const handleSetNoteDuration = (nD: NoteDuration) =>{
        if (measure.canPushNote(stringId, nD)) {
            setNoteDuration(nD)
        } else {

        }
    }

    const handleSetPauseDuration = (pD: NoteDuration) => {
        if (measure.canPushNote(stringId, pD)) {
            setPauseDuration(pD)
        } else {

        }
    }

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={`${stringId}_${uuidv4()}`} onClick={(e) => e.stopPropagation()} {...props}
            //style={{ position: "static" }}
        >
            <Popover.Header as="h3">String {`${stringSound.getName()}${stringSound.octave}`}</Popover.Header>
            <Popover.Body >
                <InputGroup className="d-flex column mb-3">
                    <Dropdown
                        as={ButtonGroup}
                        drop="end"
                       
                    >
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Note)}
                        >
                            New {`${noteRepresentationMap[noteDuration]}`}

                        </Button>
                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                      
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
                <InputGroup className="d-flex column">
                    <Dropdown
                        as={ButtonGroup}
                        drop="end"
                       
                    >
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Pause)}
                        >
                            New {`${pauseRepresentationMap[pauseDuration]}`}

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
            </Popover.Body>
        </Popover>
    )

    const handleEnter = () => {
        document.body.click();
    };
    
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
}