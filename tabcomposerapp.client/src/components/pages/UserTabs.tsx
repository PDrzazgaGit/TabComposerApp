import { useState, useEffect, Key } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { useAuth } from "../../hooks/useAuth";
//import { useTabulature } from "../../hooks/useTabulature";
import { Notation } from "../../models";
import { TabulatureDataModel } from "../../models/TabulatureDataModel";
import { CreateTabulature } from "../tablature/CreateTabulature";
import { SessionExpired } from "../SessionExpired";



export const UserTabs = () => {
    const { getToken } = useAuth();
   // const { setTabulature, downloadTabulature, deleteTabulature } = useTabulature();
    const [tabInfo, setTabInfo] = useState<Record<number, TabulatureDataModel> | null>(null);

    const [showDelete, setShowDelete] = useState(false);

    const handleCloseDelete = (id?: number) => {
        if (id) {
            handleDelete(id);
        }
        setShowDelete(false)
    };
    const handleShowDelete = () => setShowDelete(true);

    const  navigate  = useNavigate();

    useEffect(() => {
        const fetchTablatureData = async () => {
            const token = await getToken();
            if (token) {
                const data = await TabulatureManagerApi.getUserTabulaturesInfo(token);
                if (data) {
                    setTabInfo(data);
                } else {
                    //b³¹d
                }
            } else {
                <SessionExpired/>
            }
        };
        fetchTablatureData();
    }, [getToken, navigate]);


    const handlePlay = async (id: number) => {

        const result = await TabulatureManagerApi.downloadTabulature(id);
        if (!result) {
            //
        } else {
            navigate("/player");
        }
       
    }

    const handleEdit = async (id: number) => {

        const result = await TabulatureManagerApi.downloadTabulature(id);

        if (!result) {
            //
        } else {
            navigate("/editor");
        }
    }

    const handleDelete = async (id: number) => {
        const token = await getToken();
        if (token) {
            const success = await TabulatureManagerApi.deleteTabulature(token, id)//await deleteTabulature(token, id);
            if (success) {
                setTabInfo(prev => {
                    if (!prev) return prev;
                    const updatedTabs = { ...prev };
                    delete updatedTabs[id];
                    return updatedTabs;
                });
            }
        } else {
            <SessionExpired />
        }
    };

    if (!tabInfo) return (<></>);

    return (
        <Container className="mt-3">
            {Object.entries(tabInfo).length === 0 && (
                <div className="mb-3">
                    <Row className="align-items-center">
                        <Col className="text-center">
                            Ohh there is nothing here. Let's Compose your first Tab!
                        </Col>
                    </Row>
                </div>
            )}
            {Object.entries(tabInfo).map(([key, tab]) => (
                <Card key={key} className="mb-4 shadow-sm">
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
            <Row className="align-items-center mb-3">
                <Col className="text-center">
                    <CreateTabulature/>
                </Col>
            </Row>
        </Container>

    );
};