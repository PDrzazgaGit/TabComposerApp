import { MusicScale, TuningFactory, GuitarScale, Fretboard } from "./../../services";
import { ITuning, Sound, Notation, IMeasure, Tabulature, NoteDuration } from "./../../models";
//import { FretBoard } from "./../../structures";

export const Song = () => {

    const tuning: ITuning = TuningFactory.EStandardTuning();
    const measure: IMeasure = new Fretboard(100, 4, 4, tuning);

    measure.putNote(3, 1, NoteDuration.Eighth)
    measure.putNote(3, 1, NoteDuration.Quarter)
    
   

    console.log(measure);

    //const notes = GuitarScale.findCorrespondingNotes(MusicScale.getSound(Notation.E, 4), tuning);

    /*

    const notes = GuitarScale.findCorrespondingNotes(GuitarScale.getNote(0, tuning.getStringSound(1)), tuning);

    notes.forEach((string, note) => {
        console.log(`${string} : ${note.fret}`)
    })

    */

   // const baseSoundA:Sound = MusicScale.getSound(Notation.G, 3);
    //const refSoundA: Sound = MusicScale.getSound(Notation.E, 2);

   // const computedFret = GuitarScale.findNoteOnString(baseSoundA, refSoundA).fret;

    //console.log(computedFret);

    //console.log();
    /*
    measure.strings.forEach(6, note => {
        console.log(note.getName());
    })
    */

   // const x: number = 1 / 32;

  //  console.log(1/x)

    return <></>;
}