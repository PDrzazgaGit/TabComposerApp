import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { getTabulature, getUserTabulaturesInfo } from "../../api/TabulatureService";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Notation } from "../../models/NotationModel";
import { useTabulature } from "../../hooks/useTabulature";
import { SerializationService } from "../../services/SerializationService";
import { ITabulature } from "../../models";
import { useNavigate } from "react-router-dom";
import { SessionExpired } from "../SessionExpired";

interface TabulatureInfo {
    title: string;
    created: string;
    length: number;
    tuning: { notation: number }[];
}

export const UserTabs = () => {
    const { user, getToken } = useAuth();
    const { setTabulature } = useTabulature();
    const [tabInfo, setTabInfo] = useState<Record<number, TabulatureInfo>>({});

    const  navigate  = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchTablatureData = async () => {
                try {
                    const data = await getUserTabulaturesInfo(getToken()!);
                    setTabInfo(data);
                } catch (error) {
                    console.error("Error fetching tablatures:", error);
                }
            };
            fetchTablatureData();
        } else {
           //
        }
    }, [user, navigate, getToken]);

    const fetchTabulature = async (token: string, id: number) => {
        const tablatureData = await getTabulature(token, id) as string;
        setTabulature(SerializationService.deserializeTabulature(tablatureData))
    }

    const handleOpen = (id: number) => {
        fetchTabulature(getToken()!, id);
        navigate("/player");
    }

    const handleEdit = (id: number) => {     
        fetchTabulature(getToken()!, id);
        navigate("/editor");
    }

    return (
        <Container className="mt-4">
            <Row className="align-items-center">
                <h1 className="mb-4 text-center">My Tabs</h1>
            </Row>
            
            {Object.entries(tabInfo).map(([key, tab]) => (
                <div key={key} className="shadow-sm mb-4 p-3 rounded">
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="fw-bold">{tab.title}</h5>
                            <p className="text-muted">Created: {tab.created}</p>
                            <p className="text-muted">Length: {tab.length} measures</p>
                            
                            <strong>Tuning:</strong>
                            <div>
                                {tab.tuning.slice().reverse().map((notation, idx) => (
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
                                onClick={() => { handleOpen(Number(key)) }}
                            >
                                Open
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => { handleEdit(Number(key)) } }
                            >
                                Edit
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))}
        </Container>
    );
};
