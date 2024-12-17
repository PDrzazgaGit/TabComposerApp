import { TuningFactory } from "../../services";
import { ITabulature, Tabulature } from "../../models";
import {TabulatureEditorView } from "../TabulatureEditorView"
import { Button, Card, Container, Dropdown, FormControl, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { useState } from "react";
import { useError } from "../../hooks/useError";
import { useTabulature } from "../../hooks/useTabulature";


export const Editor = () => {

    const { tabulature, setTabulature } = useTabulature();

    const [title, setTitle] = useState<string>('Untitled');

    const [tuning, setTuning] = useState<string | undefined>();

    const [maxFrets, setMaxFrets] = useState(24);

    const { createTabulatureErrors, setCreateTabulatureErrors, clearCreateTabulatureErrors } = useError();

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxFrets(event.target.valueAsNumber);
    }

    const handleTuningChange = (tuning: string) => {
        setTuning(tuning);
    }

    const handleCreateTabulature = () => {
        if (tuning) {
            clearCreateTabulatureErrors();
            const tuningModel = TuningFactory.getTuning(tuning);
           // setTabulature2(new Tabulature(tuningModel, maxFrets, title));
            //console.log(tabulature2);
            setTabulature(new Tabulature(tuningModel, maxFrets, title));
        } else {
            setCreateTabulatureErrors({["tuningNotProvided"] : ["Select tuning first"]})
        }
    }
    
    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>) => (
        <Popover {...props}>
            <Popover.Header>
                Configure Tablature
            </Popover.Header>
            <Popover.Body>
                <InputGroup
                    className="d-flex justify-content-center align-items-center column mb-3"
                >
                    <InputGroup.Text>Title</InputGroup.Text>
                    <FormControl
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </InputGroup>
                <InputGroup
                    className="d-flex justify-content-center align-items-center column mb-3"
                >
                    <InputGroup.Text>Frets</InputGroup.Text>
                    <FormControl
                        type="number"
                        min={12}
                        max={30}
                        value={maxFrets}
                        onChange={handleChangeMaxFrets}
                    />
                </InputGroup>
                <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                    
                    <Dropdown
                        drop="down-centered"
                    >
                        <Dropdown.Toggle
                            className="border flex-grow-1"
                            variant="light"
                        >{tuning ? tuning : "Select Tuning"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.entries(TuningFactory.TuningList).map(([key]) => (
                                <Dropdown.Item
                                    key={key}
                                    onClick={() => handleTuningChange(key)}
                                >
                                    {key}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
                {createTabulatureErrors["tuningNotProvided"] && (
                    <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                        <div className="text-danger">
                            {createTabulatureErrors["tuningNotProvided"]}
                        </div>

                    </InputGroup>
                )}
                <InputGroup
                    className="d-flex justify-content-center align-items-center column"
                >
                    <Button
                        className="flex-grow-1 border"
                        variant="success"
                        onClick={ () => handleCreateTabulature() }
                    >
                        Create
                    </Button>
                </InputGroup>
            </Popover.Body>
        </Popover>
    )
    
    const handleEnter = () => {
        document.body.click()
    }

    return (
        <Container className = "mb-3">
            {tabulature && (
                <TabulatureEditorView />
            ) || (
                <OverlayTrigger
                    overlay={renderPopover}
                    trigger="click"
                    placement="bottom"
                    onEnter={handleEnter}
                    rootClose
                >
                    <Button
                        variant="light"
                        className="border"
                    >
                        New Tablature
                    </Button>
                </OverlayTrigger>
            )}        
        </Container>
    );
}