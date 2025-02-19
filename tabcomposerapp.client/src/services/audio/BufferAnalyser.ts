import * as Tone from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";
import { NoteDuration } from "../../models";
import { MusicScale } from "../MusicScale";
import { IAnalyzerService } from "./";

export type FrequencyBuffer = { timestamp: number, frequency: number };

export class BufferAnalyser {

    private transport: TransportClass;
    private metronomeLoop: Tone.Loop | null = null;
    private recordingLoop: Tone.Loop | null = null;

    private values: Map<number, FrequencyBuffer[]> | null;

    private recordingNoteDuration: NoteDuration | null;
    private recordingTempo: number | null;
    private recordingDenominator: number | null;
    private recordingNumerator: number | null;

    private synth: Tone.MembraneSynth;

    constructor(private analyser: IAnalyzerService, private samplesOfFrequencies: number = 0.025) {
        this.values = null;
        this.recordingNoteDuration = null;
        this.recordingTempo = null;
        this.recordingDenominator = null;
        this.recordingNumerator = null;
        this.metronomeLoop = null;
        this.recordingLoop = null;
        this.transport = Tone.getTransport();
        this.synth = new Tone.MembraneSynth().toDestination();
    }

    public async start(tempo: number, numerator: number, denominator: number, duration: NoteDuration) {
        if (this.transport.state === "started") {
            return;
        }
       
        this.values = new Map();
        this.recordingNoteDuration = duration;
        this.recordingTempo = tempo;
        this.recordingDenominator = denominator;
        this.recordingNumerator = numerator;

        let frequencyBuffer: FrequencyBuffer[] = [];

        let currentBeat = 0;
        const timeToPlay = (60 / (this.recordingTempo * this.recordingDenominator / 4));
        const timeToRecord = timeToPlay * this.recordingNumerator;

        let measureTime = 0;
        let measureIndex = 0;

        this.metronomeLoop = new Tone.Loop((time) => {
            if (currentBeat === 0) {
                this.synth.triggerAttackRelease("E2", timeToPlay * (1 / numerator), time, 0.5);
                this.values?.set(measureIndex,frequencyBuffer)
                measureIndex++;
                frequencyBuffer = [];
                measureTime = 0;
            } else {
                this.synth.triggerAttackRelease("E2", timeToPlay * (1 / numerator), time, 0.1);
            }
            currentBeat = (++currentBeat) % numerator;
        }, timeToPlay);

        this.recordingLoop = new Tone.Loop(() => {
            const sample = this.analyser.getDominantFrequency();
            if (sample !== null) {
                frequencyBuffer.push({ timestamp: measureTime, frequency: MusicScale.findClosestFrequency(sample) });
            }
            measureTime += this.samplesOfFrequencies;
        }, this.samplesOfFrequencies);

        this.metronomeLoop.start(0);
        this.recordingLoop.start(timeToRecord);

        this.transport.start();
    }

    private analyse() {
        if (!this.recordingTempo || !this.numerator || !this.denominator || !this.recordingNoteDuration) {
            return;
        }
        const measureDuration = (60 / this.recordingTempo) * (this.numerator * (4 / this.denominator));
        this.values?.forEach((frequencyBuffer, measureIndex) => {
            if (frequencyBuffer.length > 0) {

                const measureShift = (measureDuration / this.numerator!) * this.denominator! * this.recordingNoteDuration! 

                let partIndex = 0;
                const measureParts: Map<number, FrequencyBuffer[]> = new Map();
                frequencyBuffer.forEach(sample => {
                    while (sample.timestamp > partIndex + measureShift) {
                        partIndex += measureShift;
                    }
                    const part = measureParts.get(partIndex)
                    if (sample.frequency != null) {
                        if (!part) {
                            measureParts.set(partIndex, [{ timestamp: sample.timestamp, frequency: sample.frequency }])
                        } else {
                            part.push({ timestamp: sample.timestamp, frequency: sample.frequency })
                        }
                    }

                })
                this.values?.set(measureIndex, []);
                measureParts.forEach((part, partKey) => {
                    part.sort((a, b) => {
                        if (a.frequency !== b.frequency) {
                            return a.frequency - b.frequency; 
                        }
                        return a.timestamp - b.timestamp; 
                    });

                    const frequency = this.analyzePart(part, this.samplesOfFrequencies);
                    if (frequency != null) {
                        this.values?.get(measureIndex)?.push({ timestamp: partKey, frequency: frequency })
                    }
                })
            }
        })
    }

    public stopAndGetResult(): Map<number, FrequencyBuffer[]> | null{
        
        this.transport.stop();
        this.transport.cancel();
        this.metronomeLoop?.stop();
        this.metronomeLoop?.cancel()
        this.recordingLoop?.stop();
        this.recordingLoop?.cancel()
        this.analyse();
        return this.values;
    }

    public clear() {
        this.values = null;
        this.recordingNoteDuration = null;
        this.recordingTempo = null;
        this.recordingDenominator = null;
        this.recordingNumerator = null;
        this.metronomeLoop = null;
        this.recordingLoop = null;
    }

    public get noteDuration(): NoteDuration | null {
        return this.recordingNoteDuration;
    }
    public get tempo(): number | null{
        return this.recordingTempo;
    }
    public get numerator(): number | null {
        return this.recordingNumerator;
    }
    public get denominator(): number | null {
        return this.recordingDenominator;
    }

    private analyzePart(
        part: FrequencyBuffer[],
        samplesOfFrequency: number,
        tolerance = 1e-3
    ): number | null {
  
        const frequencyGroups = new Map<number, { timestamp: number }[]>();
        part.forEach((note) => {
            if (!frequencyGroups.has(note.frequency)) {
                frequencyGroups.set(note.frequency, []);
            }
            frequencyGroups.get(note.frequency)!.push({ timestamp: note.timestamp });
        });

        let bestSequence = { frequency: null as number | null, count: 0};

        frequencyGroups.forEach((notes, frequency) => {

            let index = 0;
            while (index < notes.length) {
                let currentCount = 1;
                let lastTimestamp = notes[index].timestamp;
                let j = index + 1;
                while (j < notes.length) {
                    const expectedTimestamp = lastTimestamp + samplesOfFrequency;
                    if (Math.abs(notes[j].timestamp - expectedTimestamp) < tolerance) {
                        currentCount++;
                        lastTimestamp = notes[j].timestamp;
                        j++;
                    } else {
                        break;
                    }
                }

                if (currentCount > bestSequence.count) {
                    bestSequence = {
                        frequency,
                        count: currentCount          
                    };
                }

                index = j;
            }
        });
        return bestSequence.frequency;
    }


}
