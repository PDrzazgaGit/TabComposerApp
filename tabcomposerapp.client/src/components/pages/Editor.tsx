import { MusicScale, TuningFactory, GuitarScale, MeasureService } from "../../services";
import { ITuning, Sound, Notation, IMeasure, Tabulature, NoteDuration, INote } from "../../models";
import { TabulatureProvider } from '../../context/TabulatureProvider';
import {TabulatureView } from "../TabulatureView"
import {useState } from "react"
//import { FretBoard } from "./../../structures";

export const Editor = () => {

    const [tabulature, setTab] = useState<Tabulature | null>(null);
    
    const tuning: ITuning = TuningFactory.EStandardTuning();
    const tab = new Tabulature(tuning);

    const measure: IMeasure = new MeasureService(120, 4, 4, tuning);

  //  measure.pushNote(0, 6, NoteDuration.Eighth);
  //  measure.pushNote(1, 6, NoteDuration.Eighth);
   // measure.pushNote(2, 6, NoteDuration.Eighth);
   // measure.pushNote(3, 6, NoteDuration.Eighth);

    tab.addMeasure(new MeasureService(120, 4, 4, tuning));
    tab.addMeasure(new MeasureService(120, 3, 4, tuning));
    tab.addMeasure(new MeasureService(120, 4, 4, tuning));
    tab.addMeasure(new MeasureService(120, 7, 8, tuning));
    tab.addMeasure(new MeasureService(120, 4, 4, tuning));


    if (!tabulature) {
        setTab(tab);
    }


    return (
        <>
            <TabulatureProvider initialTabulature={tabulature!}>
                <TabulatureView/>      
            </TabulatureProvider>
                 
        </>
       
       
    );
}