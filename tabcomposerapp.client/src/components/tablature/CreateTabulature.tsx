import { useState } from "react";
import { Modal, Button, Dropdown, FormControl, InputGroup, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useError } from "../../hooks/useError";
import { Tabulature } from "../../models";
import { TuningFactory } from "../../services";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { SessionExpired } from "../SessionExpired";
import { useTabulatureApi } from "../../hooks/useTabulatureApi";


export const CreateTabulature: React.FC<{ navlink?: boolean }> = ({ navlink = false }) => {

    const { getTokenWithAuth, user } = useAuth();

    const { addTabulature } = useTabulatureApi();

    const [tuning, setTuning] = useState<string | undefined>();

    const [title, setTitle] = useState<string>('Untitled');

    const [maxFrets, setMaxFrets] = useState(24);

    const [description, setDescription] = useState('');

    const [showCreate, setShowCreate] = useState(false);

    const navigate = useNavigate();

    const handleShowCreate = () => setShowCreate(true);

    const handleCloseCreate = () => {
        setShowCreate(false);
    }

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
            const token = await getTokenWithAuth();
            if (!token) {
                <SessionExpired />
                return;
            }
            const tuningModel = TuningFactory.getTuning(tuning);
            const newTabulature = new Tabulature(tuningModel, maxFrets, title, user?.username, description);
            const success = await addTabulature(token, newTabulature);
            if (!success) {
                setCreateTabulatureErrors({ ["error"]: ["Cannot add tablature"] });
            }
            handleCloseCreate();
            navigate('/editor');
        } else {
            setCreateTabulatureErrors({ ["tuningNotProvided"]: ["Select tuning first"] })
        }
    }

    return (
        <>
            {navlink && (
                <Nav.Link
                    onClick={handleShowCreate}
                >
                    New Tablature
                </Nav.Link>
            ) || (
                <Button
                    onClick={handleShowCreate}
                    variant="success"
                >
                    New Tablature
                </Button>
            )}
            
            
            <Modal show={showCreate} onHide={handleCloseCreate}>
                <Modal.Header closeButton>
                    <Modal.Title>New tablature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    {createTabulatureErrors["error"] && (
                        <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                            <div className="text-danger">
                                {createTabulatureErrors["error"]}
                            </div>

                        </InputGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => handleCloseCreate()}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => handleCreateTabulature()}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
}