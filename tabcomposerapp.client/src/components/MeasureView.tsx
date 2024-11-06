import { useEffect, useMemo, useCallback } from "react";
import { IMeasure, INote, NoteDuration } from "../models";
import { TuningFactory } from "../services";
import {useMeasure } from "./../hooks/useMeasure"
import { Measure } from "./../services/Measure"
import { NoteView } from "./NoteView";
import { StringContainer } from "./StringContainer";


export const MeasureView = () => {

    const { getMeasure } = useMeasure();

    //const noteComponents: JSX.Element[] = [];

    const stringComponents: JSX.Element[] = [];

    getMeasure().forEach((notes: INote[], stringId: number) => {
        stringComponents.push(
            <StringContainer stringId={stringId} notes={notes}>

            </StringContainer>
        );
    });
    /*
    // U¿ycie forEach do renderowania NoteView dla ka¿dej nuty
    getMeasure().forEach((notes: INote[], stringId: number) => {
        notes.forEach((note) => {
            noteComponents.push(
                <NoteView note={note} stringId={stringId} />
            );
            noteComponents.push(<span >-</span>);
        });
        noteComponents.push(<br />);
    });
    */

    
    return (
        <>
            { stringComponents } 
        </>
    );
}
