export class YIN {
    bufferSize: number;
    halfBufferSize: number;
    probability: number;
    threshold: number;
    yinBuffer: number[];
    sampleRate: number;

    constructor(sampleRate: number, bufferSize: number, threshold: number = 0.1) {
        this.bufferSize = bufferSize;
        this.halfBufferSize = bufferSize / 2;
        this.probability = 0.0;
        this.threshold = threshold;
        this.yinBuffer = new Array(this.halfBufferSize).fill(0);
        this.sampleRate = sampleRate;
    }

    private difference(buffer: Float32Array): void {
        for (let tau = 0; tau < this.halfBufferSize; tau++) {
            for (let i = 0; i < this.halfBufferSize; i++) {
                const delta = buffer[i] - buffer[i + tau];
                this.yinBuffer[tau] += delta * delta;
            }
        }
    }

    private cumulativeMeanNormalizedDifference(): void {
        let runningSum = 0;
        this.yinBuffer[0] = 1;

        for (let tau = 1; tau < this.halfBufferSize; tau++) {
            runningSum += this.yinBuffer[tau];
            this.yinBuffer[tau] *= tau / runningSum;
        }
    }

    private absoluteThreshold(): number {
        let tau = -1;
        for (let t = 2; t < this.halfBufferSize; t++) {
            if (this.yinBuffer[t] < this.threshold) {
                tau = t;
                this.probability = 1 - this.yinBuffer[tau];
                break;
            }
        }

        if (tau === -1 || this.yinBuffer[tau] >= this.threshold) {
            this.probability = 0;
        }

        return tau;
    }

    private parabolicInterpolation(tauEstimate: number): number {
        let betterTau: number;
        let x0, x2;

        if (tauEstimate < 1) {
            x0 = tauEstimate;
        } else {
            x0 = tauEstimate - 1;
        }

        if (tauEstimate + 1 < this.halfBufferSize) {
            x2 = tauEstimate + 1;
        } else {
            x2 = tauEstimate;
        }

        if (x0 === tauEstimate) {
            if (this.yinBuffer[tauEstimate] <= this.yinBuffer[x2]) {
                betterTau = tauEstimate;
            } else {
                betterTau = x2;
            }
        } else if (x2 === tauEstimate) {
            if (this.yinBuffer[tauEstimate] <= this.yinBuffer[x0]) {
                betterTau = tauEstimate;
            } else {
                betterTau = x0;
            }
        } else {
            const s0 = this.yinBuffer[x0];
            const s1 = this.yinBuffer[tauEstimate];
            const s2 = this.yinBuffer[x2];
            betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
        }

        return betterTau;
    }

    init(bufferSize: number, threshold: number): void {
        this.bufferSize = bufferSize;
        this.halfBufferSize = bufferSize / 2;
        this.probability = 0.0;
        this.threshold = threshold;
        this.yinBuffer = new Array(this.halfBufferSize).fill(0);
    }

    getPitch(buffer: Float32Array): number {
        let tauEstimate = -1;
        let pitchInHertz = -1;

        this.difference(buffer);
        this.cumulativeMeanNormalizedDifference();

        tauEstimate = this.absoluteThreshold();

        if (tauEstimate !== -1) {
            pitchInHertz = this.sampleRate / this.parabolicInterpolation(tauEstimate);
        }

        return pitchInHertz;
    }

    getProbability(): number {
        return this.probability;
    }
}
