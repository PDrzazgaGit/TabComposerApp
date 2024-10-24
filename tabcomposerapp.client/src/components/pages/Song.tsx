import { MusicScale, TuningFactory } from "./../../services";
import { ITuning, Sound, Notation, Measure, Tabulature } from "./../../models";
import { FretBoard } from "./../../structures";

export const Song = () => {

    const tuning: ITuning = TuningFactory.EStandardTuning();

    const strings: FretBoard<Sound> = new FretBoard(6);
    strings.add(1, MusicScale.getSound(Notation.E, 1));
    strings.add(2, MusicScale.getSound(Notation.E, 2));
    strings.add(3, MusicScale.getSound(Notation.E, 3));
    strings.add(4, MusicScale.getSound(Notation.E, 4));
    strings.add(5, MusicScale.getSound(Notation.E, 5));

    const tabulature: Tabulature = new Tabulature(tuning);
    const measure: Measure = new Measure(tabulature, 100);
    measure.putNote(0, 6);
    measure.putNote(1, 6);
    measure.putNote(2, 6);
    measure.putNote(3, 6);
    measure.putNote(4, 6);
    measure.putNote(5, 6);
    measure.putNote(6, 6);
    measure.putNote(7, 6);
    measure.putNote(8, 6);
    measure.putNote(9, 6);
    measure.putNote(10, 6);
    measure.putNote(11, 6);
    measure.putNote(12, 6);
    measure.putNote(13, 6);

    measure.strings.forEach((num, note) => {
        let notes: string = "";
        for (let i = 0; i < note.length; i++) {
            notes += note[i].getName() + " ";
        }

        console.log(`${num} : ${notes}`)
    })

    console.log();
    /*
    measure.strings.forEach(6, note => {
        console.log(note.getName());
    })
    */
    return <></>;
}