import { Notation } from './NotationModel'

export class Sound {
    public constructor(
        public readonly frequency: number,
        public readonly notation: Notation,
        public readonly octave: number,
        public readonly durationMs: number = 500
    ) { }

    public getName(): string {
        return Notation[this.notation];
    }
}

