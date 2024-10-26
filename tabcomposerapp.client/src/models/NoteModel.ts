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

Œwietnie! Teraz wyt³umaczê CI jak dzia³a moja klasa Fretboard i co jest do poprawki. Przechowuje ona nuty w tablicy podzielonej na 32 kawa³ki (zak³adam, ¿e najmniejsza jednostka nutowa to 1/32). Tablica zawiera wartoœci Note | boolean. Przyk³ad (dla tablicy podzielonej na 16 kawa³ków, dla 32 bêdzie analogicznie): takt.kontener[n-ta struna] = note (ósemka), false, true, true, note (czwórka), false, false, false, note (ósemka), false, true, true, note(czwórka), false, false, false. O co chodzi? Note to dŸwiêk, nuta, która posiada swoj¹ d³ugoœæ w milisekundach oraz zapis muzyczny (Whole = 1, Half = 1/2, Quarter = 1/4 itd..). Pole true w tablicy to takie, gdzie mo¿na wstawiæ nutê. Pole false to takie gdzie nie mo¿na wstawiæ nuty (byæ mo¿e inny dŸwiêk jest odgrywany). Zauwa¿, ¿e w przyk³adzie który ci da³em, ka¿da nuta wskakuje na "swoje miejsce", tj. 

*/
