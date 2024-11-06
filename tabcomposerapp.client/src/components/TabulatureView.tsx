import { TabulatureContainer } from "./TabulatureContainer"
import { ITabulature } from "../models"
import { MeasureView } from "./MeasureView";
import { MeasureProvider } from "../context/MeasureProvider"

interface TabulatureViewProps {
    tabulature: ITabulature;
}

export const TabulatureView: React.FC<TabulatureViewProps> = ({ tabulature }) => {

    const measures: JSX.Element[] = [];

    tabulature.forEach(measure => {
        measures.push(
            <MeasureProvider initialMeasure={ measure }>
                <MeasureView>

                </MeasureView>
            </MeasureProvider>
        )
    });
    

    return (
        <TabulatureContainer maxItemsPerRow={ 4 } >
            { measures }
      </TabulatureContainer>
  );
}