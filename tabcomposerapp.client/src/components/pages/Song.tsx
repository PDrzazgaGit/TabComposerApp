import { MusicScale, TuningFactory, GuitarScale, Measure } from "./../../services";
import { ITuning, Sound, Notation, IMeasure, Tabulature, NoteDuration, INote } from "./../../models";
//import { FretBoard } from "./../../structures";

export const Song = () => {

    
    const tuning: ITuning = TuningFactory.EStandardTuning();
    const measure: IMeasure = new Measure(120, 4, 4, tuning);
    const tab = new Tabulature(tuning);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    /*
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    */

    measure.putNote(3, 1, 0, NoteDuration.Quarter)
    measure.putNote(3, 1, 500, NoteDuration.Quarter)
    const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
    measure.putNote(3, 1, 1500, NoteDuration.Quarter)

    //console.log(measure.changeNoteTimeStamp(sixteenth, 1, 1375));

    //console.log(measure);

   // measure.changeTempo(100);
   // measure.changeSignature(3,4);
    // measure.putNote(3, 1, 500, NoteDuration.Quarter)
    measure.changeNoteFret(sixteenth, 1, 12);
    console.log(sixteenth);

    /*
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    */
    //measure.pushNote(3, 1, NoteDuration.Quarter)
   // measure.pushNote(3, 1, NoteDuration.Quarter)
    //measure.pushNote(3, 1, NoteDuration.Quarter)

   // console.log(measure);
    /*
    measure.forEach((_, notes) => {
        const durations: (number | undefined)[] =
        notes.map(note => {
            if (note instanceof Note) {
                return note.getTimeStampMs();
            } else
                return undefined;
        })
        console.log(durations);
    });
   
    */
    //console.log(measure);

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

    return <>
        
       
    </>;
}