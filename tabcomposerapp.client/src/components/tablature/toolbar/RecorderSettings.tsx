import { Button, Dropdown, InputGroup, Modal } from "react-bootstrap";
import { RecordFill, StopFill } from "react-bootstrap-icons";
import { useTabulature } from "../../../hooks/useTabulature";
import { useCallback, useEffect, useState } from "react";

export const RecorderSettings = () => {

    const { tabulatureRecorder } = useTabulature();

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const [deviceLabel, setDeviceLabel] = useState<string>("");

    const [deviceId, setDeviceId] = useState<string>("");

    const [renderModal, setRenderModal] = useState(false);

    const handleCloseModal = () => setRenderModal(false);

    const fetchDevices = useCallback(async () => {
        try {
            const devices = await tabulatureRecorder.microphoneSelector.getDevices();
            setDevices(devices);
            setDeviceLabel(devices[0].label || 'No device found')
            setDeviceId(devices[0].deviceId)
        } catch (error) {
            console.error("Failed to fetch microphone devices:", error);
        }
    }, [tabulatureRecorder.microphoneSelector, setDeviceLabel]);

    useEffect(() => {
        fetchDevices();
    }, [tabulatureRecorder, fetchDevices]);

    const start = async () => {
        if (!await tabulatureRecorder.record(deviceId)) {
            setRenderModal(true)
        }
        
    }

    useEffect(() => {
        return () => {
            tabulatureRecorder.stop();
        }
    }, [tabulatureRecorder])

    useEffect(() => {
        const intervalId = setInterval(async () => {

            try {
                console.log(tabulatureRecorder.getF())
            } catch {
                console.log("Nic");
            }

        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
        
    }, [tabulatureRecorder]);

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
                <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}>
                    <Dropdown drop="down-centered">
                        <Dropdown.Toggle variant="light" className="border flex-grow-1">
                            {`${deviceLabel}`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {devices.map((device) => (
                                <Dropdown.Item
                                    key={device.deviceId}
                                    onClick={() => {
                                        setDeviceLabel(device.label || `Microphone ${device.deviceId}`)
                                        setDeviceId(deviceId)
                                    }}
                                >
                                    {device.label || `Microphone ${device.deviceId}`}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button
                        className="border flex-grow-1"
                        variant="light"
                        onClick={ ()=> fetchDevices()}
                    >
                        Refresh
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