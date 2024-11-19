import { MusicScale, TuningFactory, GuitarScale, MeasureService } from "./../../services";
import { ITuning, Sound, Notation, IMeasure, Tabulature, NoteDuration, INote } from "./../../models";
import { Table, Button } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
//import './../../styles/TabulatureView.css';
import { NoteView } from './../NoteView';
import { TabulatureProvider } from './../../context/TabulatureProvider';
import { useMeasure } from './../../hooks/useMeasure';
import { MeasureView } from "../MeasureView";
import { ComponentA, ComponentB } from "../Test";
import {TabulatureView } from "../TabulatureView"
import {useState } from "react"
//import { FretBoard } from "./../../structures";

export const Song = () => {

    const [tabulature, setTab] = useState<Tabulature | null>(null);
    
    const tuning: ITuning = TuningFactory.EStandardTuning();
    const tab = new Tabulature(tuning);

    let measure: IMeasure = new MeasureService(120, 4, 4, tuning);
    measure.pushNote(0, 6, NoteDuration.Quarter);
    measure.pushNote(3, 6, NoteDuration.Quarter);
   // measure.pushNote(3, 6, NoteDuration.Quarter);
    measure.pushPause(6, NoteDuration.Quarter);
   // measure.pushNote(5, 6, NoteDuration.Eighth);
   // measure.pushNote(5, 6, NoteDuration.Eighth);
   // measure.pushNote(5, 6, NoteDuration.Eighth);


   // measure.pushNote(5, 6, NoteDuration.Eighth);
    //measure.pushNote(5, 6, NoteDuration.Quarter);
    const pause = measure.pushPause(6, NoteDuration.Quarter)!;
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    //console.log(pause.getName());
    measure = new MeasureService(100, 3, 4, tuning);
    measure.pushNote(0, 6, NoteDuration.Quarter);
    measure.pushNote(3, 6, NoteDuration.Quarter);
    measure.pushNote(5, 6, NoteDuration.Eighth);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    tab.addMeasure(measure);
    if (!tabulature) {
        setTab(tab);
    }
   
   // tabulature?.addMeasure(measure);

   

   // tab.addMeasure(measure);
    //tab.addMeasure(measure);
    /*
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    measure.pushNote(3, 1, NoteDuration.Quarter)
    */

    //const quarternote: INote = measure.putNote(3, 1, 0, NoteDuration.Quarter)!
    
   // measure.pushNote(3, 6, NoteDuration.Quarter)

   // measure.pushNote(3, 1, NoteDuration.Quarter)

  //  const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
   // measure.putNote(3, 1, 1500, NoteDuration.Quarter)

  //  measure.putNote(3, 2, 0, NoteDuration.Quarter)
 //   measure.putNote(3, 2, 500, NoteDuration.Quarter)
   // const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
  //  measure.putNote(3, 2, 1500, NoteDuration.Quarter)

  //  measure.putNote(3, 3, 0, NoteDuration.Quarter)
  //  measure.putNote(3, 3, 500, NoteDuration.Quarter)
  //  const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
//measure.putNote(3, 3, 1500, NoteDuration.Quarter)

   // measure.putNote(3, 4, 0, NoteDuration.Quarter)
   // measure.putNote(3, 4, 500, NoteDuration.Quarter)
  //  const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
   // measure.putNote(3, 4, 1500, NoteDuration.Quarter)

   // measure.putNote(3, 5, 0, NoteDuration.Quarter)
   // measure.putNote(3, 5, 500, NoteDuration.Quarter)
  //  const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
   // measure.putNote(3, 5, 1500, NoteDuration.Quarter)

   // measure.putNote(3, 6, 0, NoteDuration.Quarter)
   // measure.putNote(3, 6, 500, NoteDuration.Quarter)
    //const sixteenth: INote = measure.putNote(3, 1, 1000, NoteDuration.Sixteenth)!
    //measure.putNote(3, 6, 1500, NoteDuration.Quarter)

    //console.log(sixteenth);

    //console.log(measure.changeNoteTimeStamp(sixteenth, 1, 1375));

    //console.log(measure);

   // measure.changeTempo(100);
   // measure.changeSignature(3,4);
    // measure.putNote(3, 1, 500, NoteDuration.Quarter)
   // measure.changeNoteFret(sixteenth, 1, 12);
   // console.log(sixteenth);

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

  /*

   <MeasureProvider>
            <MeasureView measure={  measure }>

            </MeasureView>
        </MeasureProvider>

  */

    return (
        <>
            <TabulatureProvider initialTabulature={tabulature!}>
                <TabulatureView/>      
            </TabulatureProvider>
                 
        </>
       
       
    );
}