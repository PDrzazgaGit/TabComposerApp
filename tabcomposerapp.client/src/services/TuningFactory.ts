import { Dictionary } from '../structures';
import { Tuning, ITuning, Notation, Sound } from './../models';
import { MusicScale } from './MusicScale';


export class TuningFactory {
    public static EStandardTuning(): ITuning {
        const sounds: Dictionary<number, Sound> = new Dictionary<number, Sound>({
            6: MusicScale.getSound(Notation.E, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        });
        return new Tuning(sounds);
    }

    public static DDropTuning(): ITuning {
        const sounds: Dictionary<number, Sound> = new Dictionary<number, Sound>({
            6: MusicScale.getSound(Notation.D, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        });
        return new Tuning(sounds);
    }

    public static BStandard(): ITuning {
        const sounds: Dictionary<number, Sound> = new Dictionary<number, Sound>({
            7: MusicScale.getSound(Notation.B, 2),
            6: MusicScale.getSound(Notation.E, 2),
            5: MusicScale.getSound(Notation.A, 2),
            4: MusicScale.getSound(Notation.D, 3),
            3: MusicScale.getSound(Notation.G, 3),
            2: MusicScale.getSound(Notation.B, 3),
            1: MusicScale.getSound(Notation.E, 4)
        });
        return new Tuning(sounds);
    }

    public static CustomTuning(sounds: Dictionary<number, Sound>): ITuning {

        return new Tuning(sounds);
    }
}