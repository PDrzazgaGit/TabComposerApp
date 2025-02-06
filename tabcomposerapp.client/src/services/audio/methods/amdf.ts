export const amdf = (x: Float32Array, fs: number, maxFrequency: number): number => {
    const N: number = x.length; // Liczba próbek sygna³u
    let minValue: number = Number.POSITIVE_INFINITY;
    let bestTau: number = 1;
    const maxTau = Math.ceil(fs/maxFrequency)

    for (let tau = 1; tau <= maxTau; tau++) {
        let sum: number = 0;

        for (let j = 0; j < N - tau; j++) {
            sum += Math.abs(x[j] - x[j + tau]);
        }

        const dTau: number = sum / (N - tau); // Funkcja ró¿nicowa AMDF

        if (dTau < minValue) {
            minValue = dTau;
            bestTau = tau;
        }
    }

    // Obliczenie czêstotliwoœci podstawowej f0 = fs / tau_min
    const f0: number = fs / bestTau;

    return f0;
};
