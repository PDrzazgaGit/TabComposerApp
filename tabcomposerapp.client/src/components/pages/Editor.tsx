import { Container, Row, Col, Spinner } from "react-bootstrap";
import { TabulatureEditorView } from "../tablature/TabulatureEditorView";
import { TabulatureProvider } from "../../context/TabulatureProvider";
import {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTabulatureApi } from "../../hooks/useTabulatureApi";

export const Editor = () => {

    const { getTabulature } = useTabulatureApi();

    const navigate = useNavigate();

    const tabulature = getTabulature();

    useEffect(() => {
        if (!tabulature) {
            navigate('/mytabs');
        }
    }, [navigate, tabulature])

    return (
        <Container className="mt-3">
            {tabulature && (
                <TabulatureProvider initialtabulature={tabulature}>
                    <TabulatureEditorView />
                </TabulatureProvider>
            ) || (
                <Row className="align-items-center">
                    <Col className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                </Row>
                ) }
        </Container>
    );
}