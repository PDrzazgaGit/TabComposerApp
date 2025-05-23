import { useState } from "react";
import { Button, ButtonGroup, Dropdown, FormCheck, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useMeasure, useTabulature } from "../../../hooks";
import { AppErrors, Articulation, INote, IPause, NoteDuration, NoteKind } from "../../../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../../../utils";
import { NoteView } from "./";

interface NoteEditorViewProps {
    note: INote | IPause;
    stringId: number;
    stringWidthPx?: number;
    onNoteDragChange?: (moved: number) => void;
    onNoteChange?: (moved: number) => void;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, stringId, onNoteDragChange, onNoteChange , stringWidthPx }) => {

    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const [slide, setSlide] = useState(false);

    const [fret, setFret] = useState(isNote(note) ? note.fret : -1);

    const [overflow, setOverflow] = useState(true);

    const { changeFret, changeNoteDuration, deleteNote, moveNoteRight, moveNoteLeft, changeArticulation, setNodeSlide, setNodeOverflow, frets } = useMeasure();

    const { shiftOnDelete, globalNoteInterval } = useTabulature();

    const [selectedInterval, setSelectedInterval] = useState<NoteDuration>(globalNoteInterval);


    const [noteEditorErrors, setNoteEditorErrors] = useState<AppErrors>({});

    const clearNoteEditorErrors = () => setNoteEditorErrors({});

    const handleDurationChange = (duration: NoteDuration) => {
        if (changeNoteDuration(note, duration, stringId)) {
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['noteDuration']: [noteRepresentationMap[duration] + " is too long"] })
        }
    };

    const handleDeleteNote = () => {
        deleteNote(note, stringId, shiftOnDelete);
        document.body.click();
    }

    const handleMoveRight = () => {
        if (moveNoteRight(note, stringId, true, selectedInterval)) {
            if (onNoteChange) {
                onNoteChange(note.getTimeStampMs())
            }
            document.body.click();
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['moveNote']: ["Can't move right."] })
        }
    }

    const handleMoveLeft = () => {
        if (moveNoteLeft(note, stringId, true, selectedInterval)) {
            if (onNoteChange) {
                onNoteChange(note.getTimeStampMs())
            }
            document.body.click();
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['moveNote']: ["Can't move left."] })
        }
    }

    const handleChangeArticulation = (articulation: Articulation) => {
        if (!isNote(note))
            return;
        changeArticulation(note, stringId, articulation);
    }

    const handleSlide = (checkBox: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const isChecked = checkBox.target.checked;
        setSlide(isChecked);
        setNodeSlide(note, stringId, isChecked);
    }

    const handleOverflow = (checkBox: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const isChecked = checkBox.target.checked;
        setOverflow(isChecked);
        setNodeOverflow(note, stringId, isChecked);
    }

    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const newFret = event.target.valueAsNumber
        if (newFret > frets || newFret < 0)
            return;
        setFret(newFret);
        if (!isNaN(newFret)) {
            changeFret(note, stringId, newFret);
        } else {
            changeFret(note, stringId, 0);
        }
    };

    const handleFretChangeBlur = () => {
        if (isNaN(fret)) {
            setFret(0)
        }
    };

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover
            id={"popover_note"}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <Popover.Header as="h3">
                Edit {isNote(note) && `Note ${noteRepresentationMap[note.noteDuration]} = ${note.getName()}${note.octave}` || `Pause ${pauseRepresentationMap[note.noteDuration]}`}
            </Popover.Header>
            <Popover.Body className="">
                {isNote(note) && (
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Fret</InputGroup.Text>
                        <FormControl
                            type="number"
                            value={fret}
                            onChange={handleFretChange}
                            onBlur={handleFretChangeBlur}
                            min={0}
                            max={frets}
                        />
                    </InputGroup>
                )}

                <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center" >
                    <Dropdown
                        drop="down-centered"
                    >
                        <Dropdown.Toggle
                            variant="light"
                            className="border flex-grow-1"
                        >
                            {`Duration: ${NoteDuration[note.noteDuration]}`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.entries(isNote(note) ? noteRepresentationMap : pauseRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_duration"}
                                    onClick={() => handleDurationChange(key as unknown as NoteDuration)}
                                >
                                    {symbol}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
                {noteEditorErrors["noteDuration"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {noteEditorErrors["noteDuration"]}
                        </div>

                    </InputGroup>
                )}
                {isNote(note) && (
                    <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center" >
                        <Dropdown
                            drop="down-centered"
                        >
                            <Dropdown.Toggle
                                variant="light"
                                className="border flex-grow-1"
                            >
                                {`${slide ? Articulation[note.articulation] + ' & Slide' : Articulation[note.articulation]}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.keys(Articulation)
                                    .filter((key) => !isNaN(Number(key)))
                                    .map((symbol) => (
                                        <Dropdown.Item
                                            key={symbol + "_articulation"}
                                            onClick={() => handleChangeArticulation(Number(symbol))}
                                        >
                                            {Articulation[symbol as unknown as number]}
                                        </Dropdown.Item>
                                    ))}
                                <Dropdown.Item
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FormCheck
                                        onClick={(e) => e.stopPropagation()}
                                        checked={slide}
                                        type="checkbox"
                                        id={"setSlide"}
                                        label="Slide"
                                        reverse
                                        className="text-start"
                                        onChange={handleSlide}
                                    />
                                </Dropdown.Item>
                                {slide && (
                                    <Dropdown.Item
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FormCheck
                                            onClick={(e) => e.stopPropagation()}
                                            checked={overflow}
                                            type="checkbox"
                                            id={"setSlide"}
                                            label="Link"
                                            reverse
                                            className="text-start"
                                            onChange={handleOverflow}
                                        />
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                )}
                <InputGroup className="mb-3 d-flex justify-content-center align-items-center" >
                    <Dropdown
                        title={`Move: ${NoteDuration[selectedInterval]}`}
                        variant="light"
                        as={ButtonGroup}
                        drop="down-centered"
                    >
                        <Button
                            variant="light"
                            onClick={handleMoveLeft}
                            className="flex-grow-1 d-flex align-items-center jutify-content-center column"
                        >
                            <div className="flex-grow-1">
                                {isNote(note) ? noteRepresentationMap[selectedInterval] : pauseRepresentationMap[selectedInterval]}
                            </div>
                            <i className="bi bi-arrow-left flex-grow-1"></i>
                        </Button>

                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            {Object.entries(isNote(note) ? noteRepresentationMap : pauseRepresentationMap).map(([key, symbol]) => (
                                <Dropdown.Item
                                    key={key + "_interval"}
                                    onClick={() => {
                                        setSelectedInterval(key as unknown as NoteDuration)
                                    }}
                                >
                                    {symbol}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            onClick={handleMoveRight}
                            className="flex-grow-1 d-flex align-items-center jutify-content-center column"
                        >
                            <i className="bi bi-arrow-right flex-grow-1"></i>
                            <div className="flex-grow-1">
                                {isNote(note) ? noteRepresentationMap[selectedInterval] : pauseRepresentationMap[selectedInterval]}
                            </div>

                        </Button>
                    </Dropdown>
                </InputGroup>
                {noteEditorErrors["moveNote"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {noteEditorErrors["moveNote"]}
                        </div>

                    </InputGroup>
                )}
                <InputGroup className="w-100 d-flex justify-content-center align-items-center">
                    <Button
                        className="w-100"
                        variant="danger"
                        onClick={() => handleDeleteNote()}
                    >
                        Delete {isNote(note) && 'Note' || 'Pause'}
                    </Button>
                </InputGroup>
            </Popover.Body>
        </Popover>
    )

    const handleEnter = () => {
        document.body.click();
        clearNoteEditorErrors();
    }

    const [startX, setStartX] = useState<number | null>(null);
    const [step, setStep] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const calculateStep = (): number => {
        if(stringWidthPx)
            return (stringWidthPx * selectedInterval);
        else
            return (300 * selectedInterval);
    }

    const handleDragStart = (event: React.DragEvent) => {
        if (!onNoteDragChange)
            return;
        setIsDragging(true);
        setStep(calculateStep());
        setStartX(event.clientX);
        handleEnter();
    }

    const handleDragEnd = () => {
        if (!onNoteDragChange)
            return;
        setIsDragging(false);
        setStep(null);
        setStartX(null);

    }

    const handleDrag = (event: React.DragEvent) => {
        if (!onNoteDragChange)
            return;
        if (isDragging && startX != null && step != null) {
            const newX = event.clientX;
            if (newX === 0)
                return

            const value = Math.abs(newX - startX);

            if (newX > startX) {

                if (value >= step) {
                    if (moveNoteRight(note, stringId, false, selectedInterval)){
                        onNoteDragChange(newX);
                        setStartX(newX);
                    }
                    
                    
                } 

            } else if (newX < startX) {

                if (value >= step) {
                    if (moveNoteLeft(note, stringId, false ,selectedInterval)) {
                        onNoteDragChange(newX);
                        setStartX(newX);
                    }
                   
                } 
            }
        }
    }

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={renderPopover}
            rootClose
            onEnter={handleEnter}
            flip
        >
            <div
                draggable="true"

                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                onDragEnter={ (e: React.DragEvent) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
                style={{
                    height: '100%',
                    margin: '0',
                    padding: '0',
                    cursor: isDragging ? "grabbing" : "grab"
                }}
            >
                <NoteView note={note} isDragging={isDragging}></NoteView>
            </div>

        </OverlayTrigger>
    );
}