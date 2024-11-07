import React, { useState } from 'react';
import { INote } from './../models';
import { useMeasure } from './../hooks/useMeasure';
import { v4 as uuidv4 } from 'uuid';
import './../styles/NoteView.css'
//import { InputGroup, FormControl } from 'react-bootstrap';

interface NoteViewProps {
    note: INote;
    stringId: number;
}

export const NoteView: React.FC<NoteViewProps> = ({ note, stringId }) => {

    const [fret, setFret] = useState(note.fret.toString()); // U¿yj stringa dla lepszej obs³ugi wejœcia
    const [isEditing, setIsEditing] = useState(false); // Stan do œledzenia, czy edytujemy

    //const stringId = stringId;
    const { changeFret, getMaxFrets } = useMeasure();

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

    // Funkcja do obs³ugi zmiany nuty po naciœniêciu Enter
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') { 
            handleSave();
        }
    };

    const handleSave = () => {
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
                <input
                    id={inputId} // Unikalny identyfikator dla inputu
                    type="text" // U¿ywamy pola tekstowego
                    value={fret}
                    onChange={handleFretChange}
                    onKeyDown={handleKeyDown}
                    className="note-input" // U¿yj klasy CSS dla inputu
                    onBlur={handleSave} // Wy³¹cz tryb edycji po opuszczeniu pola
                />
            </div>
        </div>
    );
};