import { useMemo, useState, useCallback } from "react";
import {  INote  } from "../models";
import {useMeasure } from "./../hooks/useMeasure"
import { StringContainer } from "./StringContainer";

interface MeasureViewProps {
    //measureId: number;
}

export const MeasureView: React.FC<MeasureViewProps> = () => {

    const { measure } = useMeasure();

    const stringComponents = useMemo(() => {
        const components: JSX.Element[] = [];
        if (measure) {
            measure.forEach((_, stringId: number) => {
                components.push(<StringContainer key={stringId} stringId={stringId} />);
            });
        }
        return components;
    }, [measure]); 

    return (
        <>
            <div style={{ borderRight: "2px solid grey" }}/*onClick={() => { alert(measureId) } }*/>                        
                {stringComponents}  
            </div>
        </>
       
    );
}
