import { useMemo, useState, useCallback, useEffect } from "react";
import {useMeasure } from "./../hooks/useMeasure"
import { useTabulature } from "./../hooks/useTabulature"
import { StringEditorView } from "./StringEditorView";
import { StringView } from "./StringView";

interface MeasureViewProps {
    isEditor?: boolean;
}

export const MeasureView: React.FC<MeasureViewProps> = ({ isEditor = false }) => {

    const { measure } = useMeasure();
    const { tabulature } = useTabulature(); // Odkomentowana linia

    const [stringComponents, setStringComponents] = useState<JSX.Element[]>([]);

    const generateStringComponents = useCallback(() => {
        console.log(measure);
        const components: JSX.Element[] = [];
        if (measure) {
            measure.forEach((_, stringId: number) => {
                components.push(
                    isEditor ? (
                        <StringEditorView key={stringId} stringId={stringId} />
                    ) : (
                        <StringView key={stringId} stringId={stringId} />
                    )
                );
            });
        }
        return components;
    }, [measure, isEditor]);

    useEffect(() => {
        setStringComponents(generateStringComponents());
    }, [measure, isEditor, tabulature, generateStringComponents]);
    
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
