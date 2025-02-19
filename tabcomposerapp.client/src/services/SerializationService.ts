import { Articulation, IMeasure, INote, IPause, ITabulature, ITuning, IUser, NoteKind, SerializedMeasure, SerializedNote, SerializedTabulature, SerializedTuning, Sound, Tabulature } from "../models";
import { MusicScale, TuningFactory } from "./";

export class SerializationService {

    public static serializeUser(user: IUser): string {
        return JSON.stringify(user);
    }

    public static deserializeUser(data: string): IUser {
        const user: IUser = JSON.parse(data);
        return user;
    }

    public static serializeTabulature(tabulature: ITabulature): string {
        const serializedTabulature: SerializedTabulature = {
            title: tabulature.title,
            author: tabulature.author,
            frets: tabulature.frets,
            tuning: this.serializeTuning(tabulature.tuning), 
            measures: tabulature.map(measure => this.serializeMeasure(measure)), 
            description: tabulature.description ? tabulature.description : ""
        }
        return JSON.stringify(serializedTabulature);
    }

    public static deserializeTabulature(data: string): ITabulature {
        const serializedTabulature: SerializedTabulature = JSON.parse(data);

        const tuning: ITuning = this.deserializeTuning(serializedTabulature.tuning);

        const title = serializedTabulature.title;
        const author = serializedTabulature.author;
        const frets = serializedTabulature.frets;
        const description = serializedTabulature.description;

        const tabulature = new Tabulature(tuning, frets, title, author, description);
        serializedTabulature.measures.forEach((serializedMeasure: SerializedMeasure) => {
            const tempo = serializedMeasure.tempo;
            const numerator = serializedMeasure.numerator;
            const denominator = serializedMeasure.denominator;
            const measure: IMeasure = tabulature.addMeasure(tempo, numerator, denominator) as IMeasure;
            tuning.forEach((stringId: number) => {
                const notes: SerializedNote[] = serializedMeasure.notes[stringId];
                notes.forEach(serializedNote => {
                    if (serializedNote.fret != -1) {                      
                        measure.putNote(serializedNote.fret, Number(stringId), serializedNote.timeStamp , serializedNote.noteDuration)?.setArticulation(serializedNote.articulation);
                    } else {
                        measure.putPause(Number(stringId), serializedNote.timeStamp,serializedNote.noteDuration);
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
                noteDuration: note.noteDuration,
                timeStamp: note.getTimeStampMs()
            }
        } else {
            return {
                fret: -1,
                articulation: Articulation.None,
                noteDuration: note.noteDuration,
                timeStamp: note.getTimeStampMs()
            }
        }
    }

    private static serializeMeasure(measure: IMeasure): SerializedMeasure {
        const serializedMeasure: SerializedMeasure = {
            tempo: measure.tempo,
            numerator: measure.numerator,
            denominator: measure.denominator,
            notes: {} 
        };

        measure.forEach((notes, stringId) => {
            serializedMeasure.notes[stringId] = notes.map(note => this.serializeNote(note)); 
        });
        return serializedMeasure;
    }

    private static serializeTuning(tuning: ITuning): SerializedTuning {

        const dataToSerialize = tuning.getData();

        const serializedData: SerializedTuning = {
            tuning: {}
        };

        Object.keys(dataToSerialize).forEach(key => {
            const sound = dataToSerialize[parseInt(key)];  
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