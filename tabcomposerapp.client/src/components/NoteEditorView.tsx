import React, { useEffect, useState } from 'react';
import { INote, NoteDuration, NoteKind, IPause, Articulation } from '../models';
import { useMeasure } from '../hooks/useMeasure';
import { FormControl, InputGroup, OverlayTrigger, Popover, Button, ButtonGroup, FormCheck } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

import { pauseRepresentationMap, noteRepresentationMap } from "../utils/noteUtils";
import './../styles/NoteView.css';
import { NoteView } from './NoteView';
import { useError } from '../hooks/useError';
import { useTabulature } from '../hooks/useTabulature';
import { NotePlayer } from '../services/audio/NotePlayer';
//import { NotePlayer } from '../services/NotePlayer';
interface NoteEditorViewProps {
    note: INote | IPause;
    stringId: number;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, stringId }) => {

    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };
     
    const [noteId, setNoteId] = useState<string | null>(null);

    const [selectedInterval, setSelectedInterval] = useState<NoteDuration>(note.noteDuration);

    const [slide, setSlide] = useState(false);
    const [overflow, setOverflow] = useState(true);

    const { changeFret, changeNoteDuration, deleteNote, moveNoteRight, moveNoteLeft, getMaxFrets, changeArticulation, setNodeSlide, setNodeOverflow } = useMeasure();

    const { shiftOnDelete } = useTabulature();

    const { noteEditorErrors, setNoteEditorErrors, clearNoteEditorErrors } = useError();

    const maxFrets: number = getMaxFrets();

    const handleGenerateId = (id: string) => {
        setNoteId(id);
    };

    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNote(note))
            return;
        const newFret = event.target.valueAsNumber
        if (newFret > maxFrets || newFret < 0)
            return;
        saveChanges(newFret)
    };

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
        <Popover
            id={"popover_" + noteId} 
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <Popover.Header as="h3">Edit {isNote(note) && `Note ${noteRepresentationMap[note.noteDuration]} = ${note.getName()}${note.octave}` || `Pause ${pauseRepresentationMap[note.noteDuration]}`}</Popover.Header>
            <Popover.Body className="">
                {isNote(note) && (
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Fret</InputGroup.Text>
                        <FormControl
                            type="number"
                            value={note.fret}
                            onChange={handleFretChange}
                            onBlur={handleHide}
                            min={0}
                            max={maxFrets}
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

    const handleHide = () => {
        if (!isNote(note))
            return false;
        if (!note.fret)
            saveChanges(0);
        return true;
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
                onClick={(e) => e.stopPropagation()}
                style={{
                    height: '100%',
                    margin: '0',
                    padding: '0'
                }}
            >
                <NoteView note={note} onGenerateId={ handleGenerateId }></NoteView>
            </div>
            
        </OverlayTrigger>
    );
};