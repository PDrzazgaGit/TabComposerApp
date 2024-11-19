import React, { useState } from 'react';
import { INote, NoteDuration, NoteKind, IPause } from './../models';
import { useMeasure } from './../hooks/useMeasure';
import { v4 as uuidv4 } from 'uuid';
import './../styles/NoteView.css'
import  Dropdown  from 'react-bootstrap/Dropdown';
//import { InputGroup, FormControl } from 'react-bootstrap';

interface NoteViewProps {
    note: INote | IPause;
    stringId: number;
}

export const NoteView: React.FC<NoteViewProps> = ({ note, stringId }) => {

    const isNote = (note: INote | IPause): note is INote => {
        return note.kind === NoteKind.Note;
    };

    const [fret, setFret] = useState(isNote(note) ? note.fret.toString() : "");

    const [isEditing, setIsEditing] = useState(false); 
    const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(note.noteDuration);

    //const stringId = stringId;
    const { changeFret, getMaxFrets, changeNoteDuration } = useMeasure();

    const maxFrets: number = getMaxFrets();

    const inputId = `fret-${uuidv4()}`;

    // Funkcja do obs³ugi zmiany wartoœci fret
    const handleFretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFret = event.target.value;
        // Akceptuj pusty string (do usuniêcia wartoœci) lub liczby w zakresie 1-99
       
        if (!isNaN(Number(newFret)) && Number(newFret) >= 0 && Number(newFret) <= maxFrets) {
            setFret(newFret);
        } 
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Bezpoœrednia konwersja z stringa na NoteDuration
        const duration = e.target.value as unknown as NoteDuration;
        if (changeNoteDuration(note, duration, stringId)) {
            setSelectedDuration(duration); // Przekszta³cenie na odpowiedni¹ wartoœæ z enum
        }
    };

    // Funkcja do obs³ugi zmiany nuty po naciœniêciu Enter
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') { 
            handleSave();
        }
    };

    const handleSave = () => {
        if (!isNote(note))
            return;
        if (fret === '') {
            setFret('0'); // Ustaw fret na '0', gdy pole jest puste
            changeFret(note, stringId, 0);
        } else {
            const fretValue = Math.min(Math.max(Number(fret), 0), maxFrets); // Ogranicz do 1-99
            changeFret(note, stringId, fretValue);
        }
        setIsEditing(false)
    }

    // Funkcja do w³¹czenia trybu edycji
    const handleInputClick = () => {
        setIsEditing(true); // W³¹cz tryb edycji
        document.getElementById(inputId)?.focus(); // Skup na polu
    };

    // Kolor t³a kwadratu w zale¿noœci od stanu edycji
    const squareColor = isEditing ?  '#EEEEEE' : '#FFFFFF' ; // Ciemniejszy kolor podczas edycji

    return (
        <div className="note-container">
            {/* Kwadrat przedstawiaj¹cy nutê */}
            <div
                className="note-square"
                style={{ backgroundColor: squareColor }} // Ustaw kolor t³a
                onClick={handleInputClick} // Skup na polu po klikniêciu
            >
                {note.kind === NoteKind.Note && (
                    <input
                        id={inputId} // Unikalny identyfikator dla inputu
                        type="text" // U¿ywamy pola tekstowego
                        value={fret}
                        onChange={handleFretChange}
                        onKeyDown={handleKeyDown}
                        className="note-input" // U¿yj klasy CSS dla inputu
                        onBlur={handleSave} // Wy³¹cz tryb edycji po opuszczeniu pola 
                    />
                ) || (
                    <select
                        value={selectedDuration}
                        onChange={handleSelectChange}
                        onBlur={() => setIsEditing(false)} // Zakoñcz tryb edycji po opuszczeniu pola
                        className="pause-select"
                    >

                        <option value={NoteDuration.Whole}>{String.fromCodePoint(0x1D13B)}</option>
                        <option value={NoteDuration.Half}>{String.fromCodePoint(0x1D13C)}</option>
                        <option value={NoteDuration.Quarter}>{String.fromCodePoint(0x1D13D)}</option>
                        <option value={NoteDuration.Eighth}>{String.fromCodePoint(0x1D13E)}</option>
                        <option value={NoteDuration.Sixteenth}>{String.fromCodePoint(0x1D13F)}</option>
                        <option value={NoteDuration.Thirtytwo}>{String.fromCodePoint(0x1D140)}</option>
                    </select >
                )}
              
            </div>
        </div>
    );
};

/*

<input
                    id={inputId} // Unikalny identyfikator dla inputu
                    type="text" // U¿ywamy pola tekstowego
                    value={fret}
                    onChange={handleFretChange}
                    onKeyDown={handleKeyDown}
                    className="note-input" // U¿yj klasy CSS dla inputu
                    onBlur={handleSave} // Wy³¹cz tryb edycji po opuszczeniu pola
                />
                

                <select
                    value={selectedDuration}
                    onChange={handleSelectChange}
                    onBlur={() => setIsEditing(false)} // Zakoñcz tryb edycji po opuszczeniu pola
                    className="pause-select"
                >
                   
                 <option value={NoteDuration.Whole}>{String.fromCodePoint(0x1D15D)}</option> 
                    <option value={NoteDuration.Half}>{String.fromCodePoint(0x1D15E)}</option> 
                    <option value={NoteDuration.Quarter}>{String.fromCodePoint(0x1D15F)}</option> 
                    <option value={NoteDuration.Eighth}>{String.fromCodePoint(0x1D160)}</option> 
                    <option value={NoteDuration.Sixteenth}>{String.fromCodePoint(0x1D161)}</option> 
                    <option value={NoteDuration.Thirtytwo}>{String.fromCodePoint(0x1D162)}</option> 
                </select >

*/