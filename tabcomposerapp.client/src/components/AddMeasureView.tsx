import { Button } from "react-bootstrap";
import { useTabulature } from "../hooks/useTabulature";



export const AddMeasureView = () => {

    const { addMeasure, globalNumerator, globalDenominator, globalTempo } = useTabulature();

    const handleAddMeasure = () => {
        addMeasure(globalTempo, globalNumerator, globalDenominator);
    }

    return (
       
        <div
            className="d-flex justify-content-center align-items-center column"
            style={{ height: "100%" }}  // + 1.5 ==> measure label
        >
            <Button
                variant="light"
                onClick={handleAddMeasure }
            >
                New Measure
            </Button>
        </div>
    );
}