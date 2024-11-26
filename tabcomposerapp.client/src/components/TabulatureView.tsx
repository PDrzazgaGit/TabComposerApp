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

    const { tabulature } = useTabulature();

    return (
        <TabulatureContainer maxItemsPerRow={3} >
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