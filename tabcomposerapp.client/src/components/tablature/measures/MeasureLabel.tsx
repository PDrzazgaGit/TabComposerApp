//import { forwardRef } from 'react';
import { useMeasure } from '../../../hooks/useMeasure';

interface MeasureLabelProps {
    divToHover?: React.RefObject<HTMLDivElement>;
}

export const MeasureLabel: React.FC<MeasureLabelProps> = ({ divToHover }) => {

    const { measure, measureId } = useMeasure();

    return (
        <div
            className="d-flex align-items-center justify-content-between px-3"
            ref={divToHover}
        >
            <div>
                <span>
                    {measureId}
                </span>
            </div>
            <div>
                <span>{measure.numerator}\{measure.denominator}</span>
            </div>

            <div>
                <span> &#9833; = {measure.tempo} </span>
            </div>
        </div>
    );
}