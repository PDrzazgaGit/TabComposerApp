import { Notation } from './NotationModel'

export class Sound {
    public constructor(
        public frequency: number,
        public notation: Notation,
        public octave: number,
        protected durationMs: number = 500
    ) { }

    public getName(): string {
        if(this.notation)
            return Notation[this.notation];
        return String(undefined);
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

