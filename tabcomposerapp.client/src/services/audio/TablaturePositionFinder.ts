import { ITuning, Sound } from "./../../models";

export class TablaturePosition {
    constructor(public readonly fret: number, public readonly stringNumber: number, public readonly timeStamp: number, public readonly measureNumber: number) { }
}
export type TabCostFunction = (fretA: number, stringA: number, fretB: number, stringB: number) => number;
export class TablaturePositionFinder {

    private layers: Map<number, TablaturePosition[]>

    private costFunction = (fretA: number, stringA: number, fretB: number, stringB: number): number => {
        return 1 * Math.abs(fretB - fretA) + 3 * Math.abs(stringB - stringA) + 1;
    }

    private currentLevel: number;
    constructor(private tuning: ITuning, private maxFrets: number = 24) {
        this.layers = new Map<number, []>();
        this.currentLevel = 0;
    }

    public init() {
        this.layers = new Map<number, []>();
        this.currentLevel = 0;
    }

    private findFret(frequency: number, stringFrequency: number): number {
        return Math.round(12 * Math.log2(frequency / stringFrequency));
    }

    public addSound(
        frequency: number,
        timeStamp: number,
        measureNumber: number
    ): boolean {
        this.layers.set(this.currentLevel, []);
        const currentLayer = this.layers.get(this.currentLevel);
        this.tuning.forEach((string: number, openSound: Sound) => {
            const fret = this.findFret(frequency, openSound.frequency);
            if (fret >= 0 && fret <= this.maxFrets) {
                currentLayer?.push(
                    new TablaturePosition(
                        fret,
                        Number(string),
                        timeStamp,
                        measureNumber
                    )
                )
            }
        })
        if (currentLayer?.length === 0)
            return false;
        this.currentLevel++;
        return true;
    }


    public getBestPositions(costFunction: TabCostFunction = this.costFunction): TablaturePosition[] {
        if (this.currentLevel === 0) return [];

        const distances = new Map<TablaturePosition, number>();
        const previous = new Map<TablaturePosition, TablaturePosition | null>();

        // Inicjalizacja odleg³oœci dla pierwszej warstwy
        const firstLayer = this.layers.get(0) || [];
        firstLayer.forEach(position => {
            distances.set(position, 0);
            previous.set(position, null);
        });

        // Przechodzenie przez kolejne warstwy
        for (let level = 0; level < this.currentLevel - 1; level++) {
            const currentLayer = this.layers.get(level) || [];
            const nextLayer = this.layers.get(level + 1) || [];

            nextLayer.forEach(nextPos => {
                distances.set(nextPos, Infinity);
                previous.set(nextPos, null);

                currentLayer.forEach(currPos => {
                    const cost = distances.get(currPos)! + costFunction(currPos.fret, currPos.stringNumber, nextPos.fret, nextPos.stringNumber);
                    if (cost < distances.get(nextPos)!) {
                        distances.set(nextPos, cost);
                        previous.set(nextPos, currPos);
                    }
                });
            });
        }

        const lastLayer = this.layers.get(this.currentLevel - 1) || [];
        let bestEnd: TablaturePosition | null = lastLayer.reduce((best, pos) => (distances.get(pos)! < distances.get(best)! ? pos : best), lastLayer[0]);

        const bestPath: TablaturePosition[] = [];
        while (bestEnd) {
            bestPath.unshift(bestEnd);
            bestEnd = previous.get(bestEnd) || null;
        }

        return bestPath;
    }
}