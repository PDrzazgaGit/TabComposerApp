import { useMemo, useState, useCallback } from "react";
import {useMeasure } from "./../hooks/useMeasure"
import { StringEditorView } from "./StringEditorView";
import { StringView } from "./StringView";

interface MeasureViewProps {
    isEditor?: boolean;
}

export const MeasureView: React.FC<MeasureViewProps> = ({ isEditor = false }) => {

    const { measure } = useMeasure();

    const stringComponents = useMemo(() => {
        const components: JSX.Element[] = [];
        if (measure) {
            measure.forEach((_, stringId: number) => {
                components.push(
                    isEditor ?
                        <StringEditorView key={stringId} stringId={stringId} />
                        :
                        <StringView key={stringId} stringId={ stringId }></StringView>
                );
            });
        }
        return components;
    }, [measure, isEditor]); 

    return (
        <>
            <div
                style={{
                    borderRight: "2px solid black",
                }}>                        
                {stringComponents}  
            </div>
        </>
       
    );
}
