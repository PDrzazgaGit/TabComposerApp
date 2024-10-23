import { ISound } from "./SoundModel";

enum ETuning {
    EStandard,
    EFlat,
    DStandard,
    DFlat,
    DropD,
    CStandard,
    CFlat,
    DropC,
}

export interface ITuning {
    strings: ISound[];
}

export class Tuning implements ITuning {

    strings: ISound[];

    public static ETuning = ETuning;
    constructor(tuning: ETuning) {
        this.strings = this.getTuning(tuning);
    }

    private getTuning(tuning: ETuning): ISound[] {
        switch (tuning) {
            case ETuning.EStandard:

                break;
            default:

                break;
        }
        return [];
    }
}