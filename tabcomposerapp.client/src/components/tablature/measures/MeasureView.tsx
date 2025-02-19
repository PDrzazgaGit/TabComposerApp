import { observer } from "mobx-react-lite";
import { useMeasure } from "../../../hooks";
import { StringEditorView, StringView } from "../strings";


interface MeasureViewProps {
    isEditor?: boolean;
    measurePerRow: number
}

export const MeasureView: React.FC<MeasureViewProps> = observer(({ isEditor = false, measurePerRow }) => {

    const { measure, measureId } = useMeasure();

    const generateStringComponents = () => {
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
    }

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
                {generateStringComponents()}
            </div>
        </>
       
    );
})
