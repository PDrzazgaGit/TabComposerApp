import { Key, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SessionExpired } from "../";
import { useAuth, useTabulatureApi } from "../../hooks";
import { AppErrors, Notation, TabulatureDataModel } from "../../models";
import { CreateTabulature } from "../tablature";

export const UserTabs = () => {
    const { getToken, user } = useAuth();

    const [userTabsErrors, setUserTabsErrors] = useState<AppErrors>({});

    const clearUserTabsErrors = () => setUserTabsErrors({});

    const {getUserTabulatureInfo, downloadTabulature, deleteTabulature} = useTabulatureApi();

    const [authorized, setAuthorized] = useState<boolean | undefined>();

    const [tabInfo, setTabInfo] = useState<Record<number, TabulatureDataModel> | null>(null);

    const [showDelete, setShowDelete] = useState(false);

    const handleCloseDelete = (id?: number) => {
        if (id) {
            handleDelete(id);
        }
        setShowDelete(false)
    };
    const handleShowDelete = () => setShowDelete(true);

    const navigate = useNavigate();

    const token = useMemo(() => getToken(), [getToken]);
    
    useEffect(() => {
        const fetchTablatureData = async () => {
            if (!token) {
                setAuthorized(false);
                return;
            } 
            const data = await getUserTabulatureInfo(token);
            if (!data) {
                setAuthorized(false);
                return;
            } 
            setAuthorized(true);
            setTabInfo(data);        
        };
        fetchTablatureData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handlePlay = async (id: number) => {
        clearUserTabsErrors();
        const result = await downloadTabulature(id);
        if (!result) {
            setUserTabsErrors({ [`download_${id}`]:['Cannot load this tablature.']})
        } else {
            navigate("/player");
        }
       
    }

    const handleEdit = async (id: number) => {
        clearUserTabsErrors();
        const result = await downloadTabulature(id);
        if (!result) {
            setUserTabsErrors({ [`download_${id}`]: ['Cannot load this tablature.'] })
        } else { 
            navigate("/editor");
        }
    }

    const handleDelete = async (id: number) => {
        clearUserTabsErrors();
        const token = getToken();
        if (!token) {
            setAuthorized(false);
            return; 
        }
        const success = await deleteTabulature(token, id);
        if (!success) {
            setAuthorized(false);
            return; 
        }
        setTabInfo(prev => {
            if (!prev) return prev;
            const updatedTabs = { ...prev };
            delete updatedTabs[id];
            return updatedTabs;
        });
    };

    if (authorized === false) return (<SessionExpired></SessionExpired>);

    return (
        <Container className="mt-5">
            {user != null && user != undefined && (
                <Row className="justify-content-center mb-5">
                    <Col className="text-center">
                        <h1 className="fw-bold">Welcome {user.username}</h1>
                        
                    </Col>
                </Row>
                
            )}
           
            
            
            {tabInfo && Object.entries(tabInfo!).map(([key, tab]) => (
                <Card key={key} className="mb-3 p-4 bg-light shadow-sm">
                    <Card.Header className="fw-bold bg-light mb-1">{tab.title}</Card.Header>
                    <Card.Body>
                        <Row className="align-items-center w-100">
                            <Col className="w-50">
                                <Card.Text className="fw-bold">

                                    Tuning:
                                    {" "}
                                    {tab.tuning.slice().reverse().map((notation: { notation: Notation; }, idx: Key | null | undefined) => (
                                        <span key={idx}>{Notation[Number(notation.notation)]}</span>
                                    ))}

                                </Card.Text>
                                
                               
                                <Card.Text className="text-muted">Length: {tab.length} measures</Card.Text>

                                <Card.Text className="text-muted">Description:</Card.Text>
                                {tab.description}

                                {userTabsErrors[`download_${key}`] && (
                                    <Card.Text className="text-danger">{userTabsErrors[`download_${key}`]}</Card.Text>
                                )}
                                
                            </Col>
                            
                            <Col className="w-50 d-flex justify-content-end">
                                <ButtonGroup
                                    className="w-25 gap-1"
                                    vertical
                                >
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => { handleEdit(Number(key)) }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="w-100"
                                        onClick={() => { handlePlay(Number(key)) }}
                                    >
                                        Play
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="w-100"
                                        onClick={handleShowDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Modal show={showDelete} onHide={handleCloseDelete}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Are your sure?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>You cannot undo this action!</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="light" onClick={() => handleCloseDelete()}>
                                                Cancel
                                            </Button>
                                            <Button variant="danger" onClick={() => handleCloseDelete(Number(key))}>
                                                Delete
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer className="bg-light">
                        <Card.Text className="text-muted ">Created: {tab.created}</Card.Text>
                    </Card.Footer>
                </Card>
            ))}
            <Row className="justify-content-center mb-5">
                <Col md={10} className="w-100">
                    <Card className="p-4 bg-light shadow-sm">
                        <Card.Body className="text-center">
                            <h4 className="fw-semibold">
                                {tabInfo && Object.entries(tabInfo!).length === 0 && (
                                    "Ohh there is nothing here"
                                ) || (
                                        "So, you're looking for a new Tab?"
                                )}
                            </h4>
                            <p className="fs-5 text-justify">
                                {tabInfo && Object.entries(tabInfo!).length === 0 && (
                                    "Let's Compose your first Tab!"
                                ) || (
                                        "Let's Compose new piece of music!"
                                )}

                            </p>
                            {tabInfo && (
                                <Row className="align-items-center mb-3">
                                    <Col className="text-center">
                                        <CreateTabulature />
                                    </Col>
                                </Row>
                            ) || (
                                    <Row className="align-items-center">
                                        <Col className="text-center">
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </Col>
                                    </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row> 
        </Container>

    );
};