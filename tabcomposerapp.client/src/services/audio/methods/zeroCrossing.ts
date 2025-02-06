/**
 * Zerro crossing function
 * 
 * @param x Audio signal as waveform.
 * @param fs Sampling rate.
 */
export const zeroCrossing = (x: Float32Array, fs: number): number => {

    const N: number = x.length;  // Length of samples
    const T: number = N / fs;    // Time of signal
    let ZR: number = 0;          // Zero-Crossings

    for (let n = 1; n < N - 1; n++) {
        if (x[n] * x[n - 1] < 0) {
            ZR++;
        }    
    }

    const C: number = ZR / 2;   // Signal cycles count

    const f: number = C / T;

    return f;
}