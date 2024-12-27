import { makeAutoObservable } from 'mobx';
import { Notation } from './NotationModel'

export class Sound {
    public constructor(
        public frequency: number,
        public notation: Notation,
        public octave: number,
        protected durationMs: number = 500
       
    ) {
        makeAutoObservable(this);
    }

    public getName(): string {
        return Notation[this.notation];
    }

    public setDurationMs(durationMs: number): void {
        if (durationMs < 0) {
            throw new Error("Sound duration must be grater than 0.");
        }
        this.durationMs = durationMs;
    }

    public getDurationMs(): number {
        return this.durationMs;
    }
}

