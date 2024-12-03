import { useMeasure } from "../hooks/useMeasure";
import { forwardRef } from 'react';

interface MeasureLabelProps {
    isHovered?: boolean;
}

export const MeasureLabel = forwardRef<HTMLDivElement, MeasureLabelProps>(({ isHovered = false }, ref) => {

    const { measure, measureId } = useMeasure();

    return (
        <div
            className="d-flex align-items-center justify-content-between px-3"
            ref={ ref }
        >
            <span
                style={{
                    color: isHovered ? "cyan" : "black",
                }}
            >
                {measureId}
            </span>
            <div>
                <span
                    style={{
                        color: isHovered ? "cyan" : "black",
                    }}
                >{measure.numerator}\{measure.denominator}</span>
            </div>

            <div>
                <span
                    style={{
                        color: isHovered ? "cyan" : "black",
                    }}
                > &#9833; = {measure.tempo} </span>
            </div>
        </div>
    );
});