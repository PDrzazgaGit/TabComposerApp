import { useMeasure } from "../hooks/useMeasure";

export const MeasureLabel = () => {

    const { measure, measureId } = useMeasure();

    return (
        <div className="d-flex align-items-center justify-content-between px-3">
            <span>{measureId}</span>
            <div>
                <span>{measure.numerator}\{measure.denominator}</span>
                <span> &#9833; = {measure.tempo} </span>
            </div>
        </div>
    );
}