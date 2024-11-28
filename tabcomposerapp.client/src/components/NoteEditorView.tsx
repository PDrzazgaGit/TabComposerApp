import React, { useState, useEffect } from 'react';
import { INote, NoteDuration, NoteKind, IPause } from '../models';
import { useMeasure } from '../hooks/useMeasure';
import { FormControl, InputGroup, OverlayTrigger, Popover, Button, ButtonGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { pauseRepresentationMap, noteRepresentationMap } from "../utils/noteUtils";
import './../styles/NoteView.css';
import { NoteView } from './NoteView';
interface NoteEditorViewProps {
    note: INote | IPause;
    stringId: number;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, stringId }) => {

    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };
     
    const [noteId, setNoteId] = useState<string | null>(null);

    const [noteValue, setNoteValue] = useState<string>("");

    const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(note.noteDuration);

    const [selectedInterval, setSelectedInterval] = useState<NoteDuration>(note.noteDuration);

    const { changeFret, getMaxFrets, changeNoteDuration, deleteNote, moveNoteRight, moveNoteLeft } = useMeasure();

    const maxFrets: number = getMaxFrets();

    useEffect(() => {
        setSelectedDuration(note.noteDuration);
    }, [note, noteValue, selectedInterval])

    const handleGenerateId = (id: string) => {
        setNoteId(id);
    };

    const handleNoteValue = (value: string) => {
        setNoteValue(value);
    };

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
        else {
            if (note.fret === newFret)
                return;
            changeFret(note, stringId, newFret);
        }
    };

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={"popover_" + noteId} {...props} onClick={ (e) => e.stopPropagation()}>
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
                        variant="light"
                        drop="down-centered"
                    >
                       
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
                            className="flex-grow-1"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                        
                        <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
                        <Dropdown.Menu>
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
                        </Dropdown.Menu>
                        <Button
                            variant="light"
                            onClick={handleMoveRight}
                            className="flex-grow-1"
                        >
                            <i className="bi bi-arrow-right"></i>
                        </Button>
                    </Dropdown>
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

    const handleEnter = () => {
        document.body.click();
    }

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={renderPopover}
            rootClose 
            onEnter={handleEnter }
            >
            <div
                onClick={(e) => e.stopPropagation()}
                
            >
                <NoteView
                    note={note}
                    onGenerateId={handleGenerateId}
                    onNoteValue={handleNoteValue}
                /> 
            </div>
            
        </OverlayTrigger>
    );
};

/*



  <div className="note-container">
                <div className="note-square">
                    <button id={noteId} className="note-input-button">
                        {noteValue}
                    </button>

                </div>
            </div>   
*/