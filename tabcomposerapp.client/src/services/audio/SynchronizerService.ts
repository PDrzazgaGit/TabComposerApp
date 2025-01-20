import * as Tone from 'tone';
import { TransportClass } from 'tone/build/esm/core/clock/Transport';
export class SynchronizedService {

    private transport: TransportClass;
    constructor() {
        this.transport = Tone.getTransport();
    }


}