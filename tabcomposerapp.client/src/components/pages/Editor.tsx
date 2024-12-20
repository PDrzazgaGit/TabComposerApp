import { TuningFactory } from "../../services";
import { Tabulature } from "../../models";
import {TabulatureEditorView } from "../TabulatureEditorView"
import { Button, Container, Dropdown, FormControl, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { useError } from "../../hooks/useError";
import { useTabulature } from "../../hooks/useTabulature";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";


export const Editor = () => {

    const { getToken, user } = useAuth();

    const { tabulature, addTabulature } = useTabulature();

    const [title, setTitle] = useState<string>('Untitled');

    const [tuning, setTuning] = useState<string | undefined>();

    const [maxFrets, setMaxFrets] = useState(24);

    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const { createTabulatureErrors, setCreateTabulatureErrors, clearCreateTabulatureErrors } = useError();

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxFrets(event.target.valueAsNumber);
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleTuningChange = (tuning: string) => {
        setTuning(tuning);
    }

    const handleCreateTabulature = async () => {
        if (tuning) {
            clearCreateTabulatureErrors();
            const token = await getToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const tuningModel = TuningFactory.getTuning(tuning);
            const newTabulature = new Tabulature(tuningModel, maxFrets, title, user?.username, description);
            const success = await addTabulature(token, newTabulature);
            if (!success) {
                setCreateTabulatureErrors({ ["error"]: ["Cannot add tablature"] });
            }

        } else {
            setCreateTabulatureErrors({["tuningNotProvided"] : ["Select tuning first"]})
        }
    }

    return (
        <Container className = "mt-3">
            {tabulature && (
                <TabulatureEditorView />
            ) || (
               
                <div>
                    <h1 className="text-center mb-3">New tabulature</h1>
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
                    <InputGroup
                        className="d-flex justify-content-center align-items-center column mb-3"
                    >
                        <InputGroup.Text>Description</InputGroup.Text>
                        <FormControl
                            type="text"
                            value={description}
                            onChange={handleChangeDescription}
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
                            onClick={() => handleCreateTabulature()}
                        >
                            Create
                        </Button>
                    </InputGroup>
                    {createTabulatureErrors["error"] && (
                        <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                            <div className="text-danger">
                                {createTabulatureErrors["error"]}
                            </div>

                        </InputGroup>
                    )}
                </div>
            )}        
        </Container>
    );
}