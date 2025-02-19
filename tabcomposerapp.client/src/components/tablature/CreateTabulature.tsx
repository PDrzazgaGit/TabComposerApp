import { useState } from "react";
import { Button, Dropdown, FormControl, InputGroup, Modal, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SessionExpired } from "../";
import { useAuth, useTabulatureApi } from "../../hooks";
import { AppErrors, Tabulature } from "../../models";
import { TuningFactory } from "../../services";


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

    const minFret: number = 12;
    const maxFret: number = 30;

    const [createTabulatureErrors, setCreateTabulatureErrors] = useState<AppErrors>({});

    const clearCreateTabulatureErrors = () => setCreateTabulatureErrors({});

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
       
        let value = event.target.valueAsNumber;

        if (isNaN(value)) {
            value = minFret;
        }
        setMaxFrets(value);

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
                        
                        <OverlayTrigger
                            placement="bottom"
                            overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                                return (
                                    <Tooltip {...props}>
                                        From range {`${minFret}-${maxFret}`}
                                    </Tooltip>
                                )
                            }}
                            flip
                        >
                            <InputGroup.Text>Frets</InputGroup.Text>
                        </OverlayTrigger>
                        <FormControl
                            type="number"
                            min={minFret}
                            max={maxFret}
                            value={maxFrets}
                            onChange={handleChangeMaxFrets}
                            onBlur={() => {
                                if (maxFrets < minFret) {
                                    setMaxFrets(minFret);
                                } else if (maxFrets > maxFret) {
                                    setMaxFrets(maxFret);
                                }
                            }}
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