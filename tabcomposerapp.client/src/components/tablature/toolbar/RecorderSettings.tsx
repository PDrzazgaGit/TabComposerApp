import { Button, InputGroup, Modal } from "react-bootstrap";
import { RecordFill, StopFill } from "react-bootstrap-icons";
import { useTabulature } from "../../../hooks/useTabulature";
import { useState } from "react";

export const RecorderSettings = () => {

    const { tabulatureRecorder } = useTabulature();

    const [renderModal, setRenderModal] = useState(false);

    const handleCloseModal = () => setRenderModal(false);

    const start = async () => {
        if (!await tabulatureRecorder.record()) {
            setRenderModal(true)
        }
        
    }

    const stop = () => {
        tabulatureRecorder.stop();
        
    }

    return (
        <>
            <Modal show={renderModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Microphone Access Issue</Modal.Title>
                </Modal.Header>
                <Modal.Body>Microphone access is unavailable. Please ensure a microphone is connected and grant microphone permissions in your browser settings. Refresh the page to try again.</Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => handleCloseModal()}>
                        Understood
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">

                <InputGroup
                    className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
                >
                    <Button
                        onClick={() => start()}
                        variant="light"
                        className="border flex-grow-1"
                    >
                        <RecordFill
                            color="red"
                        />
                    </Button>

                    <Button
                        onClick={() => stop()}
                        variant="light"
                        className="border flex-grow-1"
                    >
                        <StopFill />
                    </Button>
                </InputGroup>
            </div>
        </>
    );
}

/*

<InputGroup
    className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
>
                
</InputGroup>

*/