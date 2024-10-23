import { ISound } from "./../models/SoundModel";
import { Notation } from "./../models/NotationModel";

export class MusicScale {

    private static A4_FREQUENCY = 440;
    private static A4_OCTAVE = 4;
    private static SEMITONES_IN_OCTAVE = 12;

    private static SEMITONES_FROM_A4 = {
        [Notation.C]: -9,
        [Notation.Csharp]: -8,
        [Notation.D]: -7,
        [Notation.Dsharp]: -6,
        [Notation.E]: -5,
        [Notation.F]: -4,
        [Notation.Fsharp]: -3,
        [Notation.G]: -2,
        [Notation.Gsharp]: -1,
        [Notation.A]: 0,
        [Notation.Asharp]: 1,
        [Notation.B]: 2
    };

    public static getSound(notation: Notation, octave: number): ISound {
        const frequency = MusicScale.calculateFrequency(notation, octave);
        const sound: ISound = { frequency, notation, octave };
        return sound;
    }

    private static calculateFrequency(notation: Notation, octave: number): number {
        const semitoneDifference = this.SEMITONES_FROM_A4[notation] + (octave - this.A4_OCTAVE) * this.SEMITONES_IN_OCTAVE;
        return this.A4_FREQUENCY * Math.pow(2, semitoneDifference / this.SEMITONES_IN_OCTAVE);
    }
}