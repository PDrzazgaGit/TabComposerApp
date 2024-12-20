import { Container, Row, Col, Button, Badge, ButtonGroup, Dropdown, FormCheck, FormControl, InputGroup, Popover, OverlayTrigger, Card } from "react-bootstrap";
import { getTabulature, getUserTabulaturesInfo } from "../../api/TabulatureService";
import { useAuth } from "../../hooks/useAuth";
import { Key, useEffect, useMemo, useReducer, useState } from "react";
import { Notation } from "../../models/NotationModel";
import { useTabulature } from "../../hooks/useTabulature";
import { SerializationService } from "../../services/SerializationService";
import { useNavigate } from "react-router-dom";
import { TabulatureDataModel } from "../../models/TabulatureDataModel";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { NoteDuration, Articulation } from "../../models";
import { noteRepresentationMap, pauseRepresentationMap } from "../../utils/noteUtils";


export const UserTabs = () => {
    const { getToken } = useAuth();
    const { setTabulature, downloadTabulature, deleteTabulature } = useTabulature();
    const [tabInfo, setTabInfo] = useState<Record<number, TabulatureDataModel> | null>(null);

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
                navigate('/');
            }
        };
        fetchTablatureData();
    }, [getToken, navigate]);


    const handlePlay = async (id: number) => {
        const success = await downloadTabulature(id);
        console.log(success);
        navigate("/player");
    }

    const handleEdit = async (id: number) => {
        await downloadTabulature(id);
        navigate("/editor");
    }

    const handleDelete = async (id: number) => {
        const token = await getToken();
        if (token) {
            const success = await deleteTabulature(token, id);
            if (success) {
                setTabInfo(prev => {
                    if (!prev) return prev;
                    const updatedTabs = { ...prev };
                    delete updatedTabs[id];
                    return updatedTabs;
                });
            }
        } else {
            navigate("/login");
        }
    };

    const handleNewTablature = () => {
        setTabulature(null)
        navigate("/editor");
    }

    const renderPopover = (props: React.HTMLAttributes<HTMLDivElement>, id: number) => (
        <Popover
            id={"popover_delete_tab"}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body className="d-flex justify-content-center align-items-center row gap-3">
                
                <InputGroup className="w-100">
                    <Button
                        variant="light"
                        className="w-50"
                        onClick={() => { document.body.click() }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        className="w-50"
                        onClick={() => { handleDelete(id)} }
                    >
                        Delete
                    </Button>
                    
                </InputGroup>
                <div className="d-flex justify-content-center align-items-center text-danger">
                    You cannot undo this action
                </div>
            </Popover.Body>
        </Popover>
    )

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
                                    <OverlayTrigger
                                        trigger="click"
                                        placement="bottom-start"
                                        overlay={(e) => renderPopover(e,Number(key))}
                                        rootClose
                                        flip
                                    >
                                        <Button
                                            variant="danger"
                                            className="w-100"
                                        >
                                            Delete
                                        </Button>
                                    </OverlayTrigger>
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
                    <Button
                        variant="success"
                        onClick={() => handleNewTablature()}
                    >
                        New Tablature
                    </Button>
                </Col>
            </Row>
        </Container>

    );
};
