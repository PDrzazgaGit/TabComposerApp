import { observer } from "mobx-react-lite";
import { MeasureProvider } from "../../context";
import { useTabulature } from "../../hooks";
import { TabulatureContainer } from "./";
import { MeasureLabel, MeasureView } from "./measures";
import { EditorToolbar } from "./toolbar";

export const TabulatureView = observer(() => {

    const { tabulature, measuresPerRow } = useTabulature();

    return (
        <EditorToolbar playerMode={true}>
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
                        <MeasureProvider key={index} measure={measure} initialMeasureId={index}>
                            <MeasureLabel />
                            <MeasureView isEditor={false} measurePerRow={measuresPerRow} />

                        </MeasureProvider>
                    )
                })}
            </TabulatureContainer>
        </EditorToolbar>
    );
})