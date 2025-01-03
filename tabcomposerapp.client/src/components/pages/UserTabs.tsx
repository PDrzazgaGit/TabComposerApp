import { useState, useEffect, Key, useMemo } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Notation } from "../../models";
import { TabulatureDataModel } from "../../models/TabulatureDataModel";
import { CreateTabulature } from "../tablature/CreateTabulature";
import { SessionExpired } from "../SessionExpired";
import { useTabulatureApi } from "../../hooks/useTabulatureApi";
import { AppErrors } from "../../models/AppErrorsModel";

export const UserTabs = () => {
    const { getToken } = useAuth();

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
        <Container className="mt-3">
            {tabInfo && Object.entries(tabInfo!).length === 0 && (
                <div className="mb-3">
                    <Row className="align-items-center">
                        <Col className="text-center">
                            Ohh there is nothing here. Let's Compose your first Tab!
                        </Col>
                    </Row>
                </div>
            )}
            {tabInfo && Object.entries(tabInfo!).map(([key, tab]) => (
                <Card key={key} className="mb-3">
                    <Card.Header className="fw-bold mb-1">{tab.title}</Card.Header>
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
                                        variant="light"
                                        className="w-100"
                                        onClick={() => { handlePlay(Number(key)) }}
                                    >
                                        Play
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => { handleEdit(Number(key)) }}
                                    >
                                        Edit
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
                    <Card.Footer>
                        <Card.Text className="text-muted">Created: {tab.created}</Card.Text>
                    </Card.Footer>
                </Card>
            ))}
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
            
        </Container>

    );
};