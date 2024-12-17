import { MeasureProvider } from "../context/MeasureProvider";
import { useTabulature } from "../hooks/useTabulature";
import { MeasureLabel } from "./MeasureLabel";
import { MeasureView } from "./MeasureView";
import { StickyPanel } from "./StickyPanel";
import { TabulatureContainer } from "./TabulatureContainer";

export const TabulatureView = () => {

    const { tabulature, measuresPerRow } = useTabulature();

    const renderFooterContent = () => {
        return (
            <div>
                Hello
            </div>
        );
    }

    return (
        <StickyPanel content={renderFooterContent()}>
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


        </StickyPanel>
    );
}