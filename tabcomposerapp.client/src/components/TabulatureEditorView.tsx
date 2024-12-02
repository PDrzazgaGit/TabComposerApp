import { TabulatureContainer } from "./TabulatureContainer"
import { ITabulature } from "../models"
import { MeasureView } from "./MeasureView";
import { MeasureProvider } from "../context/MeasureProvider"
import { MeasureLabelEditor } from "./MeasureLabelEditor";
import { useEffect, useMemo, useState } from "react";
import { useTabulature } from "../hooks/useTabulature";
import { AddMeasureView } from "./AddMeasureView";

interface TabulatureEditorViewProps {
   // tabulature: ITabulature;
}

export const TabulatureEditorView: React.FC<TabulatureEditorViewProps> = () => {

    const { tabulature } = useTabulature();

    return (
        <TabulatureContainer maxItemsPerRow={3} >
            {tabulature.map((measure, index) => {
                return (
                    <MeasureProvider key={index} initialMeasure={measure} initialMeasureId={index}>
                        <MeasureView isEditor={true} />
                        <MeasureLabelEditor />
                    </MeasureProvider>
                )
            })}
            <AddMeasureView></AddMeasureView>
        </TabulatureContainer>
  );
}