import { ITabulature, ITuning, Tabulature, IMeasure, Sound, Articulation, INote, IPause, NoteKind, Notation, NoteDuration } from "../models";
import { MusicScale } from "./MusicScale";
import { TuningFactory } from "./TuningFactory";

export interface SerializedNote {
    fret: number,
    noteDuration: NoteDuration,
    articulation: Articulation
}
export interface SerializedMeasure {
    tempo: number;
    numerator: number;
    denominator: number;
    notes: Record<string, SerializedNote[]>;  // Mapowanie id struny na tablicê nut
}

export interface SerializedTabulature {
    title: string;
    author: string;
    frets: number;         // Zak³adam, ¿e frets to liczba
    tuning: SerializedTuning;  // Serializowane dane o strojeniu
    measures: SerializedMeasure[];  // Tablica serializowanych miar
}

export interface SerializedTuning {
    tuning: Record<number, { notation: Notation, octave: number }>
}

export class SerializationService {

    public static serializeTabulature(tabulature: ITabulature): string {
        const serializedTabulature: SerializedTabulature = {
            title: tabulature.title,
            author: tabulature.author,
            frets: tabulature.frets,
            tuning: this.serializeTuning(tabulature.tuning), // wywo³anie metody getData() na tuning
            measures: tabulature.map(measure => this.serializeMeasure(measure)) // serializacja ka¿dej miary
        }
        return JSON.stringify(serializedTabulature);
    }

    public static deserializeTabulature(data: string): ITabulature {
        const serializedTabulature: SerializedTabulature = JSON.parse(data);

        const tuning: ITuning = this.deserializeTuning(serializedTabulature.tuning);
        const title = serializedTabulature.title;
        const author = serializedTabulature.author;
        const frets = serializedTabulature.frets;

        const tabulature = new Tabulature(tuning, frets, title, author);

        serializedTabulature.measures.forEach((serializedMeasure: SerializedMeasure) => {
            const tempo = serializedMeasure.tempo;
            const numerator = serializedMeasure.numerator;
            const denominator = serializedMeasure.denominator;
            const measure: IMeasure = tabulature.addMeasure(tempo, numerator, denominator) as IMeasure;
            tuning.forEach((stringId: number) => {
                const notes: SerializedNote[] = serializedMeasure.notes[stringId];
                notes.forEach(serializedNote => {
                    if (serializedNote.fret != -1) {
                        measure.pushNote(serializedNote.fret, Number(stringId), serializedNote.noteDuration)?.setArticulation(serializedNote.articulation);
                    } else {
                        measure.pushPause(Number(stringId), serializedNote.noteDuration);
                    }
                })
            })
        })
        return tabulature;
    }

    private static serializeNote(note: INote | IPause): SerializedNote {
        if (note.kind === NoteKind.Note) {
            return {
                fret: (note as INote).fret,
                articulation: (note as INote).articulation,
                noteDuration: note.noteDuration
            }
        } else {
            return {
                fret: -1,
                articulation: Articulation.None,
                noteDuration: note.noteDuration
            }
        }
    }

    private static serializeMeasure(measure: IMeasure): SerializedMeasure {
        const serializedMeasure: SerializedMeasure = {
            tempo: measure.tempo,
            numerator: measure.numerator,
            denominator: measure.denominator,
            notes: {} // Obiekt, który przechowa nutki dla ka¿dego stringa
        };

        measure.forEach((notes, stringId) => {
            serializedMeasure.notes[stringId] = notes.map(note => this.serializeNote(note)); // Serializacja ka¿dego elementu
        });
        return serializedMeasure;
    }

    private static serializeTuning(tuning: ITuning): SerializedTuning {

        const dataToSerialize = tuning.getData();

        const serializedData: SerializedTuning = {
            tuning: {}
        };

        Object.keys(dataToSerialize).forEach(key => {
            const sound = dataToSerialize[parseInt(key)];  // Klucz jest typu string, wiêc musimy go sparsowaæ do number
            serializedData.tuning[parseInt(key)] = {
                notation: sound.notation,
                octave: sound.octave
            };
        });

        return serializedData;
    }

    private static deserializeTuning(data: SerializedTuning): ITuning {

        const tuningData: Record<number, Sound> = {};
        
        Object.keys(data.tuning).forEach(key => {
            const numberKey = parseInt(key);
            const soundData = data.tuning[numberKey];
            
            tuningData[numberKey] = MusicScale.getSound(soundData.notation, soundData.octave)
        });

        return TuningFactory.getCustomTuning(tuningData);
    }

}