import { useState } from "react";
import { Container, Col, InputGroup, Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTabulature } from "../../../hooks/useTabulature";
import { SessionExpired } from "../../SessionExpired";



export const AddMeasureView = () => {

    const { addMeasure, globalNumerator, globalDenominator, globalTempo, getMeasuresCount, copyMeasure } = useTabulature();

    const { getTokenWithAuth } = useAuth();

    const [measureToCopy, setMeasureToCopy] = useState(getMeasuresCount()-1);

    const handleAddMeasure = async () => {
        const token = await getTokenWithAuth();
        if (!token) {
            <SessionExpired/>
            return;
        }
        addMeasure(globalTempo, globalNumerator, globalDenominator, token);
    }

    const handleCopyMeasure = async () => {
        const token = await getTokenWithAuth();
        if (!token) {
            <SessionExpired />
            return;
        }
        copyMeasure(measureToCopy, token);
    }

    return (
       
        <Container
            className="d-flex justify-content-center align-items-center"  // Wyrównanie na œrodku
            style={{ height: "100%" }}  // + 1.5 ==> measure label
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
                        />
                    </InputGroup>
                )}
            </Col>
        </Container>
    );
}