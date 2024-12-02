import { Button, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useTabulature } from "../hooks/useTabulature";



export const AddMeasureView = () => {

    const [numerator, setNumerator] = useState(4);
    const [denominator, setDenominator] = useState(4);
    const [tempo, setTempo] = useState(100);

    const { addMeasure, tabulature } = useTabulature();

    const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTempo = event.target.value;
        setTempo(Number(newTempo));

    };

    const handleNumeratorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNumerator = event.target.value;
        setNumerator(Number(newNumerator));
    };

    const handleDenominatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDenominator = event.target.value;
        setDenominator(Number(newDenominator));
    };

    const handleAddMeasure = () => {
        addMeasure(tempo, numerator, denominator);
    }

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover id={"add_measure"} {...props} onClick={(e) => e.stopPropagation()}>
            <Popover.Header as="h3">New Measure</Popover.Header>
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
                <InputGroup
                    className="flex-grow-1 w-100 justify-content-center align-items-center"
                >
                    <Button
                        variant="light"
                        className="w-100"
                        onClick={handleAddMeasure}
                    >
                        Add
                    </Button>
                </InputGroup>
            </Popover.Body>
        </Popover>
    )

    return (
       
        <div
            className="d-flex justify-content-center align-items-center column"
            style={{ height: `${1.5 * tabulature.tuning.stringCount + 1.5}em` }}  // + 1.5 ==> measure label
        >
            <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={renderPopover}
                rootClose
               // onEnter={handleEnter}
            >
                <Button
                    variant="light"
                >
                    +
                </Button>
            </OverlayTrigger>
        </div>
    );
}

/*

<InputGroup
                className="flex-grow-1 w-100 justify-content-center align-items-center"
            >
                <InputGroup.Text>Tempo</InputGroup.Text>
                <FormControl
                    type="number"
                    value={120}
                   // onChange={}
                    min={0}
                    max={999}
                />
            </InputGroup>
            <InputGroup
                className="flex-grow-1 w-100 justify-content-center align-items-center"
            >
                <InputGroup.Text>Numerator</InputGroup.Text>
                <FormControl
                    type="number"
                    value={4}
                    // onChange={}
                    min={1}
                    max={999}
                />
            </InputGroup>
            <InputGroup
                className="flex-grow-1 w-100 justify-content-center align-items-center"
            >
                <InputGroup.Text>Denominator</InputGroup.Text>
                <FormControl
                    type="number"
                    value={4}
                    // onChange={}
                    min={1}
                    max={999}
                />
            </InputGroup>

*/