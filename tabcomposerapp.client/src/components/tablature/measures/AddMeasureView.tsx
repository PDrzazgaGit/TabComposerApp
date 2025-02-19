import { useState } from "react";
import { Button, Col, Container, FormControl, InputGroup } from "react-bootstrap";
import { useTabulature } from "../../../hooks";



export const AddMeasureView = () => {

    const { addMeasure, globalNumerator, globalDenominator, globalTempo, getMeasuresCount, copyMeasure } = useTabulature();

    const [measureToCopy, setMeasureToCopy] = useState(getMeasuresCount()-1);

    const handleAddMeasure = async () => {
        addMeasure(globalTempo, globalNumerator, globalDenominator);
    }

    const handleCopyMeasure = async () => {
        copyMeasure(measureToCopy);
    }

    return (
       
        <Container
            className="d-flex justify-content-center align-items-center"  
            style={{ height: "100%" }}  
        >
            <Col className="d-flex flex-column align-items-center">
                <InputGroup className="mb-3 w-50">
                    <Button
                        variant="light"
                        onClick={handleAddMeasure}
                        className="w-100"
                    >
                        New Empty Measure
                    </Button>
                </InputGroup>

                {getMeasuresCount() > 0 && (
                    <InputGroup className="mb-3 w-50">
                        <Button
                            variant="light"
                            onClick={handleCopyMeasure}
                        >
                            Copy
                        </Button>
                        <FormControl
                            type="number"
                            min={0}
                            max={getMeasuresCount() - 1}
                            value={measureToCopy}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setMeasureToCopy(e.target.valueAsNumber) }}
                            onBlur={() => {
                                if (isNaN(measureToCopy) || measureToCopy < 0) {
                                    setMeasureToCopy(0)
                                } else if (measureToCopy > getMeasuresCount() - 1) {
                                    setMeasureToCopy(getMeasuresCount() - 1)
                                }
                            }}
                        />
                    </InputGroup>
                )}
            </Col>
        </Container>
    );
}