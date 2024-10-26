import { Sound, Notation } from "./";

export enum NoteDuration {
    Whole = 1,
    Half = 1 / 2,
    Quarter = 1 / 4,
    Eighth = 1 / 8,
    Sixteenth = 1 / 16,
    Thirtytwo = 1 / 32
}

export class Note extends Sound {
    public readonly fret: number;
    public readonly noteDuration: NoteDuration;
    private timeStamp: number;
    constructor(
        sound: Sound,
        fret: number,   
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
    );
    constructor(
        frequency: number,
        notation: Notation,
        octave: number,
        fret: number,  
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
    );
    constructor(
        frequencyOrSound: number | Sound,
        notationOrFret?: Notation | number,
        octave?: number,
        fret: number = 0,
        noteDurationMs: number = 500,
        noteDuration: NoteDuration = NoteDuration.Quarter,
    ) {
        if (frequencyOrSound instanceof Sound) { // Note(sound, fret)
            super(frequencyOrSound.frequency, frequencyOrSound.notation, frequencyOrSound.octave, noteDurationMs);
            this.fret = notationOrFret as number; 
            this.noteDuration = noteDuration;
            this.timeStamp = 0;
        } else {
            super(frequencyOrSound, notationOrFret as Notation, octave!, noteDurationMs);
            this.fret = fret;
            this.noteDuration = noteDuration;
            this.timeStamp = 0;
        }
    }

    public setTimeStampMs(timeStampMs: number): void {
        if (timeStampMs < 0) {
            throw new Error("Timestamp must be grater than 0.")
        }
        this.timeStamp = timeStampMs;
    }

    public getTimeStampMs(): number { return this.timeStamp; }
}

/*

�wietnie! Teraz wyt�umacz� CI jak dzia�a moja klasa Fretboard i co jest do poprawki. Przechowuje ona nuty w tablicy podzielonej na 32 kawa�ki (zak�adam, �e najmniejsza jednostka nutowa to 1/32). Tablica zawiera warto�ci Note | boolean. Przyk�ad (dla tablicy podzielonej na 16 kawa�k�w, dla 32 b�dzie analogicznie): takt.kontener[n-ta struna] = note (�semka), false, true, true, note (czw�rka), false, false, false, note (�semka), false, true, true, note(czw�rka), false, false, false. O co chodzi? Note to d�wi�k, nuta, kt�ra posiada swoj� d�ugo�� w milisekundach oraz zapis muzyczny (Whole = 1, Half = 1/2, Quarter = 1/4 itd..). Pole true w tablicy to takie, gdzie mo�na wstawi� nut�. Pole false to takie gdzie nie mo�na wstawi� nuty (by� mo�e inny d�wi�k jest odgrywany). Zauwa�, �e w przyk�adzie kt�ry ci da�em, ka�da nuta wskakuje na "swoje miejsce", tj. 

*/
