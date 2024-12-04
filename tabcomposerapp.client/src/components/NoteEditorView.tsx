import React, { useState } from 'react';
import { INote, NoteDuration, NoteKind, IPause } from '../models';
import { useMeasure } from '../hooks/useMeasure';
import { FormControl, InputGroup, OverlayTrigger, Popover, Button, ButtonGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { pauseRepresentationMap, noteRepresentationMap } from "../utils/noteUtils";
import './../styles/NoteView.css';
import { NoteView } from './NoteView';
import { useError } from '../hooks/useError';
interface NoteEditorViewProps {
    note: INote | IPause;
    stringId: number;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, stringId }) => {

    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };
     
    const [noteId, setNoteId] = useState<string | null>(null);

   // const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(note.noteDuration);

    const [selectedInterval, setSelectedInterval] = useState<NoteDuration>(note.noteDuration);

    const { changeFret, changeNoteDuration, deleteNote, moveNoteRight, moveNoteLeft, getMaxFrets } = useMeasure();

    const { noteEditorErrors, setNoteEditorErrors, clearNoteEditorErrors } = useError();

    const maxFrets: number = getMaxFrets();

   // useEffect(() => setSelectedDuration(note.noteDuration), [note, measure]);

    const handleGenerateId = (id: string) => {
        setNoteId(id);
    };

    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const newFret = event.target.value
        saveChanges(Number(newFret))
    };

    const handleDurationChange = (duration: NoteDuration) => {
        if (changeNoteDuration(note, duration, stringId)) {
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['noteDuration']: [noteRepresentationMap[duration] + " is too long"] })
        }
    };

    const handleDeleteNote = () => {  
        deleteNote(note, stringId);
        document.body.click();
    }

    const handleMoveRight = () => {     
        if (moveNoteRight(note, stringId, selectedInterval)) {
            document.body.click();
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['moveNote']: ["Can't move right."] })
        }
            

    }

    const handleMoveLeft = () => {
        if (moveNoteLeft(note, stringId, selectedInterval)) {
            document.body.click();
            clearNoteEditorErrors();
        } else {
            setNoteEditorErrors({ ['moveNote']: ["Can't move left."] })
        }
            
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
                            value={note.fret}
                            onChange={handleFretChange}
                            min={0}
                            max={maxFrets}
                        />
                    </InputGroup>
                )}

                <InputGroup className="mb-3 w-100 d-flex justify-content-center align-items-center" >
                    <DropdownButton
                        title={`Duration: ${NoteDuration[note.noteDuration]}`}
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
                {noteEditorErrors["noteDuration"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {noteEditorErrors["noteDuration"]}
                        </div>

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
        clearNoteEditorErrors();
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
                /> 
            </div>
            
        </OverlayTrigger>
    );
};