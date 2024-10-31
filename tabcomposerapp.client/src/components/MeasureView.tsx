import { useEffect, useState } from "react";
import { IMeasure, INote, NoteDuration } from "../models";
import { TuningFactory } from "../services";
import {useMeasure } from "./../hooks/useMeasure"
import { Measure } from "./../services/Measure"
import { NoteView } from "./NoteView";
import { Button } from "react-bootstrap";

interface MeasureViewProps {
    measure: IMeasure;
}


export const MeasureView: React.FC<MeasureViewProps> = ({ measure }) => {

    const { setMeasure } = useMeasure();

    useEffect(() => {
        setMeasure(measure);
    }, [measure, setMeasure]); 

    const noteComponents: JSX.Element[] = [];

    // U¿ycie forEach do renderowania NoteView dla ka¿dej nuty
    measure.forEach((notes: INote[], stringId: number) => {
        notes.forEach((note) => {
            noteComponents.push(
                <NoteView note={note} stringId={stringId} />
            );
            noteComponents.push(<span >-</span>);
        });
        noteComponents.push(<br />);
    });

    return (
        <>
            {noteComponents}
           
        </>
    );
}