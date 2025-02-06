import { Dictionary } from '../structures';
import { Tuning, ITuning, Notation, Sound } from './../models';
import { MusicScale } from './MusicScale';


export class TuningFactory {

    public static readonly TuningList: Record<string, Record<number, Sound>> = {
        "E-Standard": {
            6: MusicScale.getSound(Notation.E, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        },
        "Eb-Standard": {
            6: MusicScale.getSound(Notation.Dsharp, 2),
            5: MusicScale.getSound(Notation.Gsharp, 2),
            4: MusicScale.getSound(Notation.Csharp, 3),
            3: MusicScale.getSound(Notation.Fsharp, 3),
            2: MusicScale.getSound(Notation.Asharp, 3),
            1: MusicScale.getSound(Notation.Dsharp, 4)
        },
        "D-Standard": {
            6: MusicScale.getSound(Notation.D, 2),
            5: MusicScale.getSound(Notation.G, 2),
            4: MusicScale.getSound(Notation.C, 3),
            3: MusicScale.getSound(Notation.F, 3),
            2: MusicScale.getSound(Notation.A, 3),
            1: MusicScale.getSound(Notation.D, 4)
        },
        "Db-Standard": {
            6: MusicScale.getSound(Notation.Csharp, 2),
            5: MusicScale.getSound(Notation.Fsharp, 2),
            4: MusicScale.getSound(Notation.B, 2),
            3: MusicScale.getSound(Notation.E, 3),
            2: MusicScale.getSound(Notation.Gsharp, 3),
            1: MusicScale.getSound(Notation.Csharp, 4)
        },
        "C-Standard": {
            6: MusicScale.getSound(Notation.C, 2),
            5: MusicScale.getSound(Notation.F, 2),
            4: MusicScale.getSound(Notation.Asharp, 2),
            3: MusicScale.getSound(Notation.Dsharp, 3),
            2: MusicScale.getSound(Notation.G, 3),
            1: MusicScale.getSound(Notation.C, 4)
        },
        "D-Drop": {
            6: MusicScale.getSound(Notation.D, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        },
        "C-Drop": {
            6: MusicScale.getSound(Notation.C, 2),
            5: MusicScale.getSound(Notation.G, 2),
            4: MusicScale.getSound(Notation.C, 3),
            3: MusicScale.getSound(Notation.F, 3),
            2: MusicScale.getSound(Notation.A, 3),
            1: MusicScale.getSound(Notation.D, 4)
        },
        "B7-Standard": {
            7: MusicScale.getSound(Notation.B, 2),
            6: MusicScale.getSound(Notation.E, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        },
        "E-Standard Bass (4-string)": {
            4: MusicScale.getSound(Notation.E, 1),
            3: MusicScale.getSound(Notation.A, 1),
            2: MusicScale.getSound(Notation.D, 2),
            1: MusicScale.getSound(Notation.G, 2)
        },
        "E-Standard Bass (5-string)": {
            5: MusicScale.getSound(Notation.B, 0),
            4: MusicScale.getSound(Notation.E, 1),
            3: MusicScale.getSound(Notation.A, 1),
            2: MusicScale.getSound(Notation.D, 2),
            1: MusicScale.getSound(Notation.G, 2)
        },
        "D-Standard Bass (4-string)": {
            4: MusicScale.getSound(Notation.D, 1),
            3: MusicScale.getSound(Notation.G, 1),
            2: MusicScale.getSound(Notation.C, 2),
            1: MusicScale.getSound(Notation.F, 2)
        },
        "D-Standard Bass (5-string)": {
            5: MusicScale.getSound(Notation.A, 0),
            4: MusicScale.getSound(Notation.D, 1),
            3: MusicScale.getSound(Notation.G, 1),
            2: MusicScale.getSound(Notation.C, 2),
            1: MusicScale.getSound(Notation.F, 2)
        },

    }

    public static EStandardTuning(): ITuning {
        return new Tuning(new Dictionary<number, Sound>(this.TuningList["E-Standard"]));
    }

    public static DDropTuning(): ITuning {
        return new Tuning(new Dictionary<number, Sound>(this.TuningList["D-Drop"]));
    }

    public static BStandard(): ITuning {
        return new Tuning(new Dictionary<number, Sound>(this.TuningList["B-Standard"]));
    }

    public static getTuning(tuningString: string): ITuning {
        if (this.TuningList[tuningString])
            return new Tuning(new Dictionary<number, Sound>(this.TuningList[tuningString]));
        else
            throw Error(`'${tuningString}' does not exists.`)
    }

    public static deserialize(data: SerializedTuning): ITuning {
 
        const tuningData: Record<number, Sound> = {};

        Object.keys(data).forEach(key => {
            const numberKey = parseInt(key); 
            const soundData = data.tuning[numberKey];
            tuningData[numberKey] = MusicScale.getSound(soundData.notation, soundData.octave)
        });

        return this.getCustomTuning(tuningData);
    }

    public static getCustomTuning(sounds: Record<number, Sound>): ITuning {
        return new Tuning(new Dictionary<number, Sound>(sounds));
    }
}