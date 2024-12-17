import { Container } from "react-bootstrap";
import { TabulatureView } from "../TabulatureView";
import { useEffect } from "react";
import { useTabulature } from "../../hooks/useTabulature";
import { useNavigate } from "react-router-dom";

export const Player = () => {

    const { tabulature } = useTabulature();

    //const navigate = useNavigate();

    return (
        <Container className="mb-3">
            {tabulature && (
                <TabulatureView />
            )}
        </Container>
    );
}