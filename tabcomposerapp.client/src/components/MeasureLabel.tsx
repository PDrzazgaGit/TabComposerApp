import { useMeasure } from "../hooks/useMeasure";
import { useMemo } from "react";

export const MeasureLabel = () => {

    const { getMeasure, measureId } = useMeasure();

    const measure = useMemo(() => getMeasure(), [getMeasure]);

    return (
        <>
            {measureId } <span>&#9833; = { measure.tempo } </span>
        </>
    );
}