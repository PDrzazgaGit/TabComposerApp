import React, { useState, useEffect } from 'react';
import { INote, NoteDuration, NoteKind, IPause } from './../models';
import { useMeasure } from './../hooks/useMeasure';
import { v4 as uuidv4 } from 'uuid';
import './../styles/NoteView.css';
import { Dropdown, DropdownButton, FormControl, InputGroup, OverlayTrigger, Popover } from 'react-bootstrap';

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

    const { changeFret, getMaxFrets, changeNoteDuration, getMeasureDurationMs } = useMeasure();

    const measureDuration = getMeasureDurationMs();

    const maxFrets: number = getMaxFrets();

    const noteId = `fret-${uuidv4()}`;

    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFret = event.target.value;
        setNoteValue(newFret);
    };

    const handleDurationChange = (duration: NoteDuration) => {
        if (changeNoteDuration(note, duration, stringId)) {
            setSelectedDuration(duration); 
            if (!isNote(note)) {
                setNoteValue(pauseRepresentationMap[duration]);
            }
        }
    };

    const saveChanges = () => {
        console.log("heheh");
        if (!isNote(note))
            return;
        if (noteValue === '') {
            setNoteValue('0'); // Ustaw fret na '0', gdy pole jest puste
            changeFret(note, stringId, 0);
        } else {
            const fretValue = Number(noteValue);
            if (note.fret === fretValue)
                return;
            changeFret(note, stringId, fretValue);
        }
    }

    const calculatePosition = (timestamp: number, containerWidth: number) => {
        return (timestamp / measureDuration) * containerWidth;
    };

    return (
        <div
            style={{
                position: "absolute",
                left: `calc(${calculatePosition(note.getTimeStampMs(), 100)}% - 0.5em )`
            }}
        >
            <div className="note-container">
                <div className="note-square">
                    <OverlayTrigger trigger="click" placement="bottom" overlay={
                        <Popover id={noteId}>
                            <Popover.Header as="h3">Edit {isNote(note) && "Note" || "Pause" }</Popover.Header>
                            <Popover.Body>
                                {isNote(note) && (
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Fret</InputGroup.Text>
                                        <FormControl
                                            type="number"
                                            value={noteValue}
                                            onChange={handleFretChange}
                                            min={0}
                                            max={maxFrets}
                                            onBlur={saveChanges}
                                        />
                                    </InputGroup>
                                )}
                                <DropdownButton
                                    title={`Duration: ${NoteDuration[selectedDuration]}`}
                                    variant="secondary"
                                >
                                    <Dropdown.Item></Dropdown.Item>
                                    {Object.entries(isNote(note) ? noteRepresentationMap : pauseRepresentationMap).map(([key, symbol]) => (
                                        <Dropdown.Item
                                            key={key}
                                            onClick={() => handleDurationChange(key as unknown as NoteDuration)}
                                        >
                                            {symbol}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Popover.Body>
                        </Popover>
                    } rootClose>
                        <button className="note-input-button">
                            {noteValue}
                        </button>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    );
};