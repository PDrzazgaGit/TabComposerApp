import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export const SessionExpired = () => {

    const navigate = useNavigate();

    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
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