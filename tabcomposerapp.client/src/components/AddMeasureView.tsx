import { Button, ButtonGroup, Container, Dropdown, FormControl, InputGroup, Popover, Col, Row } from "react-bootstrap";
import { useTabulature } from "../hooks/useTabulature";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { NoteDuration, Articulation } from "../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../utils/noteUtils";
import { useState } from "react";



export const AddMeasureView = () => {

    const { addMeasure, globalNumerator, globalDenominator, globalTempo, getMeasuresCount, copyMeasure } = useTabulature();

    const { getToken } = useAuth();

    const [measureToCopy, setMeasureToCopy] = useState(getMeasuresCount()-1);

    const navigate = useNavigate();

    const handleAddMeasure = async () => {
        const token = await getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        addMeasure(globalTempo, globalNumerator, globalDenominator, token);
    }

    const handleCopyMeasure = async () => {
        const token = await getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        copyMeasure(measureToCopy);
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