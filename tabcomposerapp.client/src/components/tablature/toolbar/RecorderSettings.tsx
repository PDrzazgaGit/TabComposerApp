import { Button, Dropdown, InputGroup, Modal } from "react-bootstrap";
import { RecordFill, StopFill } from "react-bootstrap-icons";
import { useTabulature } from "../../../hooks/useTabulature";
import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

export const RecorderSettings = observer(() => {

    const { tabulatureRecorder } = useTabulature();

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const [deviceLabel, setDeviceLabel] = useState<string>("");

    const [deviceId, setDeviceId] = useState<string>("");

    const [renderModal, setRenderModal] = useState(false);

    const handleCloseModal = () => setRenderModal(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const fetchDevices = useCallback(async () => {
        try {
            const devices = await tabulatureRecorder.getAvailableMicrophones();
            setDevices(devices);
            setDeviceLabel(devices[0].label || 'No device found')
            setDeviceId(devices[0].deviceId)
        } catch (error) {
            console.error("Failed to fetch microphone devices:", error);
        }
    }, [tabulatureRecorder, setDeviceLabel]);

    useEffect(() => {
        fetchDevices();
    }, [tabulatureRecorder, fetchDevices]);

    useEffect(() => {
        tabulatureRecorder.draw(canvasRef.current);
    })

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
                const num = tabulatureRecorder.getF();
                if (num) {
                    console.log(num, "Hz")

                    //
                }

            } catch {
                console.log("Nic");
            }

        }, 1);

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
                <canvas  ref={canvasRef} style={{ width: '100%', height: '150px', border: '1px solid #ccc' }} />
                <InputGroup
                    className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
                >
                    <Button
                        onClick={() => start()}
                        variant="light"
                        className="border flex-grow-1"
                        disabled={ tabulatureRecorder.monite || tabulatureRecorder.recording }
                    >
                        <RecordFill
                            color="red"
                        />
                    </Button>

                    <Button
                        onClick={() => stop()}
                        variant="light"
                        className="border flex-grow-1"
                        disabled={tabulatureRecorder.monite || !tabulatureRecorder.recording}
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
                        onClick={() => fetchDevices()}
                    >
                        Refresh
                    </Button>
                </InputGroup>
                <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}>

                    <Button
                        className="border flex-grow-1"
                        onClick={() => tabulatureRecorder.effectsToggle()}
                        variant={tabulatureRecorder.effectsOn ? "secondary" : "light"}
                    >
                        {`Effects ${tabulatureRecorder.effectsOn ? "off" : "on"}`}
                    </Button>

                    <Button
                        className="border flex-grow-1"

                        onClick={() =>
                            tabulatureRecorder.moniteToggle(deviceId)
                        }
                        disabled={tabulatureRecorder.recording}
                        variant={ tabulatureRecorder.monite ? "danger" : "success" }
                    >
                        {`Monitor ${tabulatureRecorder.monite ? "off" : "on"}` }
                    </Button>
                </InputGroup>
            </div>
        </>
    );
}
)
/*

<InputGroup
    className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
>
                
</InputGroup>

*/