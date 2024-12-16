import { useState, useCallback, useEffect } from "react";
import {useMeasure } from "./../hooks/useMeasure"
import { useTabulature } from "./../hooks/useTabulature"
import { StringEditorView } from "./StringEditorView";
import { StringView } from "./StringView";

interface MeasureViewProps {
    isEditor?: boolean;
    measurePerRow: number
}

export const MeasureView: React.FC<MeasureViewProps> = ({ isEditor = false, measurePerRow }) => {

    const { measure, measureId } = useMeasure();
    const { tabulature } = useTabulature(); // Odkomentowana linia

    const [stringComponents, setStringComponents] = useState<JSX.Element[]>([]);

    const generateStringComponents = useCallback(() => {
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
                style={
                    (measureId !== 0 && measureId % measurePerRow === 0) && {
                        borderLeft: "2px solid black",
                        borderRight: "2px solid black"
                    } || {
                        borderRight: "2px solid black"
                    } 
                }>                        
                {stringComponents}  
            </div>
        </>
       
    );
}
