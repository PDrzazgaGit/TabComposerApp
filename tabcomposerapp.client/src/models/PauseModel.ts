import { action, makeObservable, observable } from "mobx";
import {Note, NoteKind, NoteDuration } from "./"
export interface IPause {
    readonly kind: NoteKind;
    readonly noteDuration: NoteDuration;
    getTimeStampMs(): number;
    getEndTimeStampMs(): number;
    getDurationMs(): number;
    getName(): string;
}

export class Pause extends Note implements IPause {
    public override readonly kind: NoteKind;
    constructor(public noteDuration: NoteDuration = NoteDuration.Quarter, noteDurationMs: number = 500) {
        super(-1, 0, -1, -1, noteDurationMs);
        this.kind = NoteKind.Pause;
        //makeAutoObservable(this);
        makeObservable(this, {
            kind: observable,
            noteDuration: observable,
            getTimeStampMs: action,
            getEndTimeStampMs: action,
            getDurationMs: action,
            getName: action
        })
    }
    public override getName(): string {
        return NoteDuration[this.noteDuration] + "-Pause";
    }
}