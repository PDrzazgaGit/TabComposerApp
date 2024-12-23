import { forwardRef } from 'react';
import { useMeasure } from '../../../hooks/useMeasure';

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
                    color: isHovered ? '#007bff' : "black",
                }}
            >
                {measureId}
            </span>
            <div>
                <span
                    style={{
                        color: isHovered ? '#007bff' : "black",
                    }}
                >{measure.numerator}\{measure.denominator}</span>
            </div>

            <div>
                <span
                    style={{
                        color: isHovered ? '#007bff' : "black",
                    }}
                > &#9833; = {measure.tempo} </span>
            </div>
        </div>
    );
});