import { useMeasure } from "../hooks/useMeasure";
import { useMemo } from "react";

export const MeasureLabel = () => {

    const { getMeasure, measureId } = useMeasure();

    const measure = useMemo(() => getMeasure(), [getMeasure]);

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