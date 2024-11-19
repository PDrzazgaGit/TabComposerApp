import { useState } from 'react';
import { IPause, NoteDuration } from '../models';
import './../styles/NoteView.css';
import { useMeasure } from '../hooks/useMeasure';

export const PauseView: React.FC<{ pause: IPause, stringId: number }> = ({ pause, stringId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<NoteDuration>(pause.noteDuration);
    const { changeNoteDuration } = useMeasure();

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Bezpoœrednia konwersja z stringa na NoteDuration
        const duration = e.target.value as unknown as NoteDuration;
        if (changeNoteDuration(pause, duration, stringId)) {
            setSelectedDuration(duration); // Przekszta³cenie na odpowiedni¹ wartoœæ z enum
        }
    };

    const squareColor = isEditing ? '#EEEEEE' : '#FFFFFF';

    return (
        <div className="note-container">
            <div
                className="note-square"
                style={{ backgroundColor: squareColor }}
                onClick={() => setIsEditing(true)}
            >
                <select
                    value={selectedDuration}
                    onChange={handleSelectChange}
                    onBlur={() => setIsEditing(false)} // Zakoñcz tryb edycji po opuszczeniu pola
                    className="pause-select"
                >
                    {/* Opcje musz¹ mieæ wartoœæ, która odpowiada wartoœciom z enum NoteDuration */}
                    <option value={NoteDuration.Whole}>{String.fromCodePoint(0x1D13B)}</option>
                    <option value={NoteDuration.Half}>{String.fromCodePoint(0x1D13C)}</option>
                    <option value={NoteDuration.Quarter}>{String.fromCodePoint(0x1D13D)}</option>
                    <option value={NoteDuration.Eighth}>{String.fromCodePoint(0x1D13E)}</option>
                    <option value={NoteDuration.Sixteenth}>{String.fromCodePoint(0x1D13F)}</option>
                    <option value={NoteDuration.Thirtytwo}>{String.fromCodePoint(0x1D140)}</option>
                </select>
            </div>
        </div>
    );
};