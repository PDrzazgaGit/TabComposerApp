import React, { useState, useEffect } from 'react';
import { INote, NoteDuration, NoteKind, IPause } from './../models';
import { useMeasure } from './../hooks/useMeasure';
import { v4 as uuidv4 } from 'uuid';
import './../styles/NoteView.css';
import { FormControl, InputGroup, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

interface NoteViewProps {
    note: INote | IPause;
    stringId: number;
}

export const NoteView: React.FC<NoteViewProps> = ({ note, stringId }) => {


    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };



    const pauseRepresentationMap: Record<NoteDuration, string> = {
        [NoteDuration.Whole]: String.fromCodePoint(0x1D13B),
        [NoteDuration.Half]: String.fromCodePoint(0x1D13C),
        [NoteDuration.Quarter]: String.fromCodePoint(0x1D13D),
        [NoteDuration.Eighth]: String.fromCodePoint(0x1D13E), 
        [NoteDuration.Sixteenth]: String.fromCodePoint(0x1D13F),
        [NoteDuration.Thirtytwo]: String.fromCodePoint(0x1D140),
    };

    const noteRepresentationMap: Record<NoteDuration, string> = {
        [NoteDuration.Whole]: String.fromCodePoint(0x1D15D),
        [NoteDuration.Half]: String.fromCodePoint(0x1D15E),
        [NoteDuration.Quarter]: String.fromCodePoint(0x1D15F),
        [NoteDuration.Eighth]: String.fromCodePoint(0x1D160),
        [NoteDuration.Sixteenth]: String.fromCodePoint(0x1D161),
        [NoteDuration.Thirtytwo]: String.fromCodePoint(0x1D162),
    };
     
    const [noteValue, setNoteValue] = useState(isNote(note) ? note.fret.toString() : pauseRepresentationMap[note.noteDuration]);

    const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(note.noteDuration);

    const [selectedInterval, setSelectedInterval] = useState<NoteDuration>(note.noteDuration);

    const { changeFret, getMaxFrets, changeNoteDuration, deleteNote, moveNoteRight, moveNoteLeft } = useMeasure();

    const maxFrets: number = getMaxFrets();

    const noteId = `fret-${uuidv4()}`;

    useEffect(() => {
        setNoteValue(isNote(note) ? note.fret.toString() : pauseRepresentationMap[note.noteDuration])
        setSelectedDuration(note.noteDuration);
    }, [note, pauseRepresentationMap, noteValue, selectedInterval])
    

    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const newFret = event.target.value
        saveChanges(Number(newFret))
    };

    const handleDurationChange = (duration: NoteDuration) => {
        if (changeNoteDuration(note, duration, stringId)) {
            setSelectedInterval(note.noteDuration);
        }
    };

    const handleDeleteNote = () => {  
        deleteNote(note, stringId);
        document.body.click();
    }

    const handleMoveRight = () => {     
        if (moveNoteRight(note, stringId, selectedInterval))
            document.body.click();

    }

    const handleMoveLeft = () => {
        if (moveNoteLeft(note, stringId, selectedInterval))
            document.body.click();
    }

    const saveChanges = (newFret: number) => {
        if (!isNote(note))
            return;
        if (noteValue === '') {
            setNoteValue('0'); // Ustaw fret na '0', gdy pole jest puste
            changeFret(note, stringId, 0);
        } else {
            if (note.fret === newFret)
                return;
            changeFret(note, stringId, newFret);
        }
    };

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={"popover_" + noteId} {...props}>
            <Popover.Header as="h3">Edit {isNote(note) && `Note ${noteRepresentationMap[note.noteDuration]}` || `Pause ${pauseRepresentationMap[note.noteDuration]}`}</Popover.Header>
            <Popover.Body className="">
                {isNote(note) && (
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Fret</InputGroup.Text>
                        <FormControl
                            type="number"
                            value={noteValue}
                            onChange={handleFretChange}
                            min={0}
                            max={maxFrets}
                        />
                    </InputGroup>
                )}

                <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center" >
                    <DropdownButton
                        title={`Duration: ${NoteDuration[selectedDuration]}`}
                        variant="secondary"
                    >
                        <Dropdown.Item ></Dropdown.Item>
                        {Object.entries(isNote(note) ? noteRepresentationMap : pauseRepresentationMap).map(([key, symbol]) => (
                            <Dropdown.Item
                                key={key + "_duration"}
                                onClick={() => handleDurationChange(key as unknown as NoteDuration)}
                            >
                                {symbol}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </InputGroup>

                <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center gap-1 ">
                    <Button
                        className="flex-grow-1"
                        variant="outline-success"
                        onClick={handleMoveLeft}
                    >
                        <i className="bi bi-arrow-left fs-5"></i>
                    </Button>

                    <Button
                        className="flex-grow-1"
                        variant="outline-danger"
                        onClick={handleMoveRight}
                    >
                        <i className="bi bi-arrow-right fs-5"></i>
                    </Button>
                </InputGroup>

                <InputGroup className="mb-3 d-flex justify-content-center align-items-center" >
                    <DropdownButton
                        title={`Move: ${NoteDuration[selectedInterval]}`}
                        variant="secondary"
                    >
                        <Dropdown.Item ></Dropdown.Item>
                        {Object.entries(isNote(note) ? noteRepresentationMap : pauseRepresentationMap).map(([key, symbol]) => (
                            <Dropdown.Item
                                key={key + "_interval"}
                                onClick={() => {
                                    console.log(key as unknown as NoteDuration)
                                    setSelectedInterval(key as unknown as NoteDuration)
                                }}
                            >
                                {symbol}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </InputGroup>

                <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center">
                    <Button
                        className="w-100"
                        variant="danger"
                        onClick={()=> handleDeleteNote()}
                    >
                        Delete { isNote(note) && 'Note' || 'Pause' }
                    </Button>
                </InputGroup>
            </Popover.Body>
        </Popover>
    )

    return (
        <div className="note-container">
            <div className="note-square">
                <OverlayTrigger trigger="click" placement="bottom" overlay={renderPopover} rootClose>
                    <button id={noteId} className="note-input-button">
                        {noteValue}
                    </button>
                </OverlayTrigger>
            </div>
        </div>
        
    );
};