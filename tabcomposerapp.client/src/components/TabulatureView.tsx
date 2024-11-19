import { TabulatureContainer } from "./TabulatureContainer"
import { ITabulature } from "../models"
import { MeasureView } from "./MeasureView";
import { MeasureProvider } from "../context/MeasureProvider"
import { MeasureLabel } from "./MeasureLabel";
import { useEffect, useMemo, useState } from "react";
import { useTabulature } from "../hooks/useTabulature";

interface TabulatureViewProps {
   // tabulature: ITabulature;
}

export const TabulatureView: React.FC<TabulatureViewProps> = () => {

    const { getTabulature } = useTabulature();

    const tabulature = useMemo(() => getTabulature(), [getTabulature]);


    return (
        <TabulatureContainer maxItemsPerRow={4} >
            {tabulature.map((measure, index) => {
                return (
                    <MeasureProvider key={index} initialMeasure={measure} initialMeasureId={index}>
                        <MeasureLabel/>
                        <MeasureView/>
                    </MeasureProvider>
                )
                
            })
            
            }
        </TabulatureContainer>
  );
}