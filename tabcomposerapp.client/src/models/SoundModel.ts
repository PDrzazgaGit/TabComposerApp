import { makeObservable, observable, action, runInAction } from 'mobx';
import { Notation } from './NotationModel'

export class Sound {
    public constructor(
        public frequency: number,
        public notation: Notation,
        public octave: number,
        protected durationMs: number = 500
       
    ) {
        //makeAutoObservable(this);
        makeObservable(this, {
            frequency: observable, // Obserwowalna w³aœciwoœæ
            notation: observable,  // Obserwowalna w³aœciwoœæ
            octave: observable,    // Obserwowalna w³aœciwoœæ
            //durationMs: observable, // Chroniona, ale nadal obserwowalna

           // getName: action,     // Getter jako computed
            getDurationMs: action, // Getter jako computed

            setDurationMs: action, // Akcja
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

