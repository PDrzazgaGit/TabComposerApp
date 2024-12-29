import { Container, Row, Col,Spinner } from "react-bootstrap";
import { TabulatureView } from "../tablature/TabulatureView";
import { TabulatureProvider } from "../../context/TabulatureProvider";
import { useEffect } from "react";
import { useTabulatureApi } from "../../hooks/useTabulatureApi";
import { useNavigate } from "react-router-dom";

export const Player = () => {

    const { getTabulature } = useTabulatureApi();

    const navigate = useNavigate();

    const tabulature = getTabulature();

    useEffect(() => {
        if (!tabulature) {
            navigate('/mytabs');
        }
    }, [navigate, tabulature])

    return (
        <Container className="mb-3">
            {tabulature && (
                <TabulatureProvider initialtabulature={tabulature}>
                    <TabulatureView />
                </TabulatureProvider> 
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
}