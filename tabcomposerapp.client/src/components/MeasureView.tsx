import { useEffect, useMemo, useCallback } from "react";
import {  INote  } from "../models";
import {useMeasure } from "./../hooks/useMeasure"
import { StringContainer } from "./StringContainer";

interface MeasureViewProps {
    //measureId: number;
}

export const MeasureView: React.FC<MeasureViewProps> = () => {

    const { getMeasure } = useMeasure();
    const measure = getMeasure();

    const stringComponents: JSX.Element[] = [];

    measure.forEach((notes: INote[], stringId: number) => {
        stringComponents.push(
            <StringContainer key={stringId} stringId={stringId} notes={notes} />
        );
    });

    return (
        <>
            <div style={{ borderRight: "2px solid grey" }}/*onClick={() => { alert(measureId) } }*/>                        
                {stringComponents}  
            </div>
        </>
       
    );
}
