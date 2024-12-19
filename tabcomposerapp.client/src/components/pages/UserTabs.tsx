import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { getTabulature, getUserTabulaturesInfo } from "../../api/TabulatureService";
import { useAuth } from "../../hooks/useAuth";
import { Key, useEffect, useMemo, useReducer, useState } from "react";
import { Notation } from "../../models/NotationModel";
import { useTabulature } from "../../hooks/useTabulature";
import { SerializationService } from "../../services/SerializationService";
import { useNavigate } from "react-router-dom";
import { TabulatureDataModel } from "../../models/TabulatureDataModel";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";


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

    if (!tabInfo) return (<></>);

    return (
        <Container className="mt-3">
            <Row className="align-items-center">
                <h1 className="mb-3 text-center">My Tabs</h1>
            </Row>
            {Object.entries(tabInfo).length === 0 && (
                <div className="mb-3">
                    <Row className="align-items-center">
                        <Col
                            className="text-center"
                        >
                            Ohh there is nothing here. Let's Compose your first Tab!
                        </Col>
                    </Row>
                    
                </div>
            )}
            {Object.entries(tabInfo).map(([key, tab]) => (
                <div key={key}
                    className="mb-3"
                >
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="fw-bold">{tab.title}</h5>
                            <p className="text-muted">Created: {tab.created}</p>
                            <p className="text-muted">Length: {tab.length} measures</p>
                            
                            <strong>Tuning:</strong>
                            <div>
                                {tab.tuning.slice().reverse().map((notation: { notation: Notation; }, idx: Key | null | undefined) => (
                                    <Badge key={idx} bg="secondary" className="me-2">
                                        {Notation[Number(notation.notation)]}
                                    </Badge>
                                ))}
                            </div>
                            
                        </Col>
                        <Col xs="auto" className="text-end">
                            <Button
                                variant="light"
                                className="me-2"  
                                onClick={() => { handlePlay(Number(key)) }}
                            >
                                Play
                            </Button>
                            <Button
                                variant="success"
                                className="me-2" 
                                onClick={() => { handleEdit(Number(key)) } }
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => { handleDelete(Number(key)) }}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))}
            <Row className="align-items-center mb-3">
                <Col
                    className="text-center"
                >
                    <Button
                        variant="success"
                        onClick={() => handleNewTablature() }
                    >
                        New Tablature
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
