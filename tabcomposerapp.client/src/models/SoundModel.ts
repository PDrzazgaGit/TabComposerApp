import { makeObservable, observable, action } from 'mobx';
import { Notation } from './'

export class Sound {
    public constructor(
        public frequency: number,
        public notation: Notation,
        public octave: number,
        protected durationMs: number = 500
       
    ) {

        makeObservable(this, {
            frequency: observable, 
            notation: observable, 
            octave: observable,  
         
            getDurationMs: action, 

            setDurationMs: action, 
        });
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

