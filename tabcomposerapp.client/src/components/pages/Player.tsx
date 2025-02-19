import { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TabulatureProvider } from "../../context";
import { useTabulatureApi } from "../../hooks";
import { TabulatureView } from "../tablature";

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