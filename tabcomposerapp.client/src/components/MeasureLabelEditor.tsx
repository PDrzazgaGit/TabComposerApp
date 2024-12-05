import { Button, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useMeasure } from "../hooks/useMeasure";
import { useState } from "react";
import { useError } from "../hooks/useError";
import { MeasureLabel } from "./MeasureLabel";
import { useTabulature } from "../hooks/useTabulature";

export const MeasureLabelEditor = () => {

    const { measure, changeSignature, changeTempo } = useMeasure();

    const { deleteMeasure } = useTabulature();

    const { measureEditorErrors, setMeasureEditorErrors, clearMeasureEditorErrors } = useError();

    const [isHovered, setIsHovered] = useState(false);

    const [numerator, setNumerator] = useState(measure.numerator);
    const [denominator, setDenominator] = useState(measure.denominator);
    const [tempo, setTempo] = useState(measure.tempo);

    const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTempo = Number(event.target.value);
        setTempo(newTempo);
        changeTempo(newTempo);
    };

    const handleNumeratorChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
        const newNumerator = Number(event.target.value);
        if (changeSignature(newNumerator, denominator)) {
            clearMeasureEditorErrors();
            setNumerator(Number(newNumerator));
        } else {
            setMeasureEditorErrors({ ['numeratorChange']:["Delete some notes first"] });
        }
       
    };

    const handleDenominatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDenominator = Number(event.target.value);
        if (changeSignature(numerator, newDenominator)) {
            clearMeasureEditorErrors();
            setDenominator(newDenominator);
        } else {
            setMeasureEditorErrors({ ['denominatorChange']: ["Delete some notes first"] });
        }

    };

    const handleDeleteMeasure = () => {
        deleteMeasure(measure);
    }

    const handleEnter = () => {
        document.body.click();
        clearMeasureEditorErrors();
    };

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={"add_measure"} {...props} onClick={(e) => e.stopPropagation()}>
            <Popover.Header as="h3">Edit Measure</Popover.Header>
            <Popover.Body className="">
                <InputGroup
                    className="flex-grow-1 w-100 justify-content-center align-items-center mb-3"
                >
                    <InputGroup.Text
                        className=""
                    >
                        Tempo
                    </InputGroup.Text>
                    <FormControl
                        type="number"
                        value={tempo}
                        onChange={handleTempoChange}
                        min={0}
                        max={999}
                    />
                </InputGroup>
                <InputGroup
                    className="flex-grow-1 w-100 justify-content-center align-items-center mb-3"
                >
                    <InputGroup.Text
                        className=""
                    >
                        Numerator
                    </InputGroup.Text>
                    <FormControl
                        type="number"
                        value={numerator}
                        onChange={handleNumeratorChange}
                        min={1}
                        max={999}
                    />
                </InputGroup>
                {measureEditorErrors["numeratorChange"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {measureEditorErrors["numeratorChange"]}
                        </div>

                    </InputGroup>
                )}
                <InputGroup
                    className="flex-grow-1 w-100 justify-content-center align-items-center mb-3"
                >
                    <InputGroup.Text
                        className=""
                    >
                        Denominator
                    </InputGroup.Text>
                    <FormControl
                        type="number"
                        value={denominator}
                        onChange={handleDenominatorChange}
                        min={1}
                        max={999}
                    />
                </InputGroup>
                {measureEditorErrors["denominatorChange"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {measureEditorErrors["denominatorChange"]}
                        </div>

                    </InputGroup>
                )}
                <InputGroup className="flex-grow-1 w-100 d-flex justify-content-center align-items-center">
                    <Button
                        className="w-100"
                        variant="danger"
                        onClick={() => handleDeleteMeasure()}
                    >
                        Delete Measure
                    </Button>
                </InputGroup>
            </Popover.Body>
        </Popover>
    )

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={renderPopover}
            onEnter={ handleEnter }
            rootClose
            flip
        >
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <MeasureLabel isHovered={isHovered} />
            </div>
        </OverlayTrigger>
        
    );
}