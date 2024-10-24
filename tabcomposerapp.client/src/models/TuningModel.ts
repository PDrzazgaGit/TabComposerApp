import { Sound } from "./";
import { Dictionary } from "./../structures";

export interface ITuning {
    //readonly strings: Sound[];
    getName(): string;
    getSounds(): Sound[];
    getStrings(): number[];
    getStringSound(stringNumber: number): Sound;
    readonly stringCount: number;
}
export class Tuning implements ITuning {

    private name: string = "";
    public readonly stringCount: number;

    public constructor(public readonly strings: Dictionary<number, Sound>) {
        this.stringCount = strings.keysLength();
        if (this.stringCount !== 0) {
            strings.values().reverse().forEach(sound => {
                this.name += sound.getName();
            })
        } else {
            throw new Error("Tuning must contain at least one sound.");
        }
    }

    public getName(): string {
        return this.name;
    }

    public getStringSound(stringNumber: number): Sound {
        const sound: Sound | undefined = this.strings?.get(stringNumber);

        if (sound) {
            return sound;
        }
        throw new Error("There is no string with number " + stringNumber + ".");
    }

    public getStrings(): number[] {
        return this.strings.keys();
    }

    public getSounds(): Sound[] {
        return this.strings.values();
    }
}