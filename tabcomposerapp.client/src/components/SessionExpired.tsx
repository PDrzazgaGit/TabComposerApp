import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const SessionExpired = () => {

    const navigate = useNavigate();

    const [show, setShow] = useState(true);

    const { signOut } = useAuth();

    const handleClose = () => {
        setShow(false);
        signOut();
        navigate("/login");   
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New tablature</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Your session expired. Please login again.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => handleClose()}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
}