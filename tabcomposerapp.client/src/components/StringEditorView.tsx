import { useMemo, useCallback, useState } from "react";
import { useMeasure } from "../hooks/useMeasure";
import { useTabulature } from "../hooks/useTabulature";
import { NoteView } from "./NoteView";
import './../styles/StringView.css';
import { NoteEditorView } from "./NoteEditorView";
import { Button, ButtonGroup, Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { Note, NoteDuration, NoteKind, Sound } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";

interface StringEditorViewProps {
    stringId: number;
}

export const StringEditorView: React.FC<StringEditorViewProps> = ({ stringId }) => {

    const [noteKind, setNoteKind] = useState<NoteKind>(NoteKind.Note);

    const [noteDuration, setNoteDuration] = useState<NoteDuration>(NoteDuration.Quarter);

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
                addPause(stringId, noteDuration);
                break;
        }
    }

    const handleEnter = () => {
        document.body.click();
    }

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover {...props}>
            <Popover.Header as="h3">String {`${stringSound.getName()}${stringSound.octave}`}</Popover.Header>
            <Popover.Body >
                <InputGroup className="d-flex column">
                    <Dropdown as={ButtonGroup}>
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Note)}
                        >
                            Add {`${noteRepresentationMap[noteDuration]}`}

                        </Button>
                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            {Object.entries(noteRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_duration"}
                                    onClick={() => setNoteDuration(key as unknown as NoteDuration)}
                                >
                                    {symbol}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>

                    </Dropdown>
                </InputGroup>
                <InputGroup className="d-flex column">
                    <Dropdown as={ButtonGroup}>
                        <Button
                            variant="light"
                            onClick={() => handleAddItem(NoteKind.Pause)}
                        >
                            Add {`${pauseRepresentationMap[noteDuration]}`}

                        </Button>
                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            {Object.entries(pauseRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_duration"}
                                    onClick={() => setNoteDuration(key as unknown as NoteDuration)}
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

    /*
    <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center" >
                    <DropdownButton
                        title={`Add ${NoteKind[noteKind]}`}
                        variant="light"
                    >
                        <Dropdown.Item className="w-50" onClick={() => setNoteKind(NoteKind.Note)}/>
                        <Dropdown.Item ></Dropdown.Item>
                        
                    </DropdownButton>
                </InputGroup>
    */
    
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
                style={{ height: "1.5em" }}>

                {measureId === 0 && (
                    <div style={{ flex: "0 0 auto", minWidth: "1em" }}>{stringSound.getName()}</div>
                )}

                <div style={{ flex: "1 1 auto", position: "relative", height: "100%" }}>
          
                    <div className="string-line" />
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