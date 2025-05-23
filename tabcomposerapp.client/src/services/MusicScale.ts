import { Notation, Sound } from "./../models";

export class MusicScale {

    public static getSound(notation: Notation, octave: number): Sound {
        const frequency = MusicScale.calculateFrequency(notation, octave);
        const sound: Sound = new Sound(frequency, notation, octave);
        return sound;
    }

    protected static calculateFrequency(notation: Notation, octave: number): number {
        return this.frequencies[notation][octave];
    }

    private static readonly frequencies: { [key in Notation]: { [octave: number]: number } } = {
        [Notation.C]: {
            0: 16.35, 1: 32.70, 2: 65.41, 3: 130.81, 4: 261.63, 5: 523.25, 6: 1046.50, 7: 2093.00, 8: 4186.01
        },
        [Notation.Csharp]: {
            0: 17.32, 1: 34.65, 2: 69.30, 3: 138.59, 4: 277.18, 5: 554.37, 6: 1108.73, 7: 2217.46, 8: 4434.92
        },
        [Notation.D]: {
            0: 18.35, 1: 36.71, 2: 73.42, 3: 146.83, 4: 293.66, 5: 587.33, 6: 1174.66, 7: 2349.32, 8: 4698.64
        },
        [Notation.Dsharp]: {
            0: 19.45, 1: 38.89, 2: 77.78, 3: 155.56, 4: 311.13, 5: 622.25, 6: 1244.51, 7: 2489.02, 8: 4978.03
        },
        [Notation.E]: {
            0: 20.60, 1: 41.20, 2: 82.41, 3: 164.81, 4: 329.63, 5: 659.26, 6: 1318.51, 7: 2637.02, 8: 5274.04
        },
        [Notation.F]: {
            0: 21.83, 1: 43.65, 2: 87.31, 3: 174.61, 4: 349.23, 5: 698.46, 6: 1396.91, 7: 2793.83, 8: 5587.65
        },
        [Notation.Fsharp]: {
            0: 23.12, 1: 46.25, 2: 92.50, 3: 185.00, 4: 369.99, 5: 739.99, 6: 1479.98, 7: 2959.96, 8: 5919.91
        },
        [Notation.G]: {
            0: 24.50, 1: 49.00, 2: 98.00, 3: 196.00, 4: 392.00, 5: 783.99, 6: 1567.98, 7: 3135.96, 8: 6271.93
        },
        [Notation.Gsharp]: {
            0: 25.96, 1: 51.91, 2: 103.83, 3: 207.65, 4: 415.30, 5: 830.61, 6: 1661.22, 7: 3322.44, 8: 6644.88
        },
        [Notation.A]: {
            0: 27.50, 1: 55.00, 2: 110.00, 3: 220.00, 4: 440.00, 5: 880.00, 6: 1760.00, 7: 3520.00, 8: 7040.00
        },
        [Notation.Asharp]: {
            0: 29.14, 1: 58.27, 2: 116.54, 3: 233.08, 4: 466.16, 5: 932.33, 6: 1864.66, 7: 3729.31, 8: 7458.62
        },
        [Notation.B]: {
            0: 30.87, 1: 61.74, 2: 123.47, 3: 246.94, 4: 493.88, 5: 987.77, 6: 1975.53, 7: 3951.07, 8: 7902.13
        }
    };

    public static findClosestFrequency(frequency: number): number {
        let closestFrequency = Infinity;
        let minDifference = Infinity;

        for (const notation in this.frequencies) {
            const octaves = this.frequencies[notation as unknown as Notation];
            for (const octave in octaves) {
                const freq = octaves[parseInt(octave)];
                const diff = Math.abs(freq - frequency);

                if (diff < minDifference) {
                    minDifference = diff;
                    closestFrequency = freq;
                }
            }
        }

        return closestFrequency;
    }


    public static getSoundFromFrequency(frequency: number): Sound | null {
        let closestDistance = Infinity;
        let closestNotation: Notation | null = null;
        let closestOctave: number | null = null;

        for (const notation in this.frequencies) {
            const octaves = this.frequencies[notation as unknown as Notation];

            for (const octave in octaves) {
                const currentFrequency = octaves[parseInt(octave)];
                const distance = Math.abs(currentFrequency - frequency); 

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNotation = notation as unknown as Notation;
                    closestOctave = parseInt(octave);
                } 
            }
        }
        if (closestNotation && closestOctave !== null) {
            return this.getSound(closestNotation, closestOctave);
        }

        return null;
    }

}