import { MeasureProvider } from "../../context/MeasureProvider";
import { useTabulature } from "../../hooks/useTabulature";
import { MeasureLabel } from "./measures/MeasureLabel";
import { MeasureView } from "./measures/MeasureView";
import { TabulatureContainer } from "./TabulatureContainer";
import { EditorToolbar } from "./toolbar/EditorToolbar";

export const TabulatureView = () => {

    const { tabulature, measuresPerRow } = useTabulature();

    return (
        <EditorToolbar playerMode={ true }>
            <div
                className="d-flex justify-content-center align-items-center mb-3 column"
            >
                <h1>
                    {tabulature?.title || "undefined"}
                </h1>
            </div>
            <TabulatureContainer maxItemsPerRow={measuresPerRow} >
                {tabulature!.map((measure, index) => {
                    return (
                        <MeasureProvider key={index} initialMeasure={measure} initialMeasureId={index}>
                            <MeasureLabel />
                            <MeasureView isEditor={false} measurePerRow={measuresPerRow} />

                        </MeasureProvider>
                    )
                })}
            </TabulatureContainer>
        </EditorToolbar>
    );
}