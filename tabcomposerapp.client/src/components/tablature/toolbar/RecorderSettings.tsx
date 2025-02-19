import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, FormCheck, InputGroup, Modal } from "react-bootstrap";
import { RecordFill, StopFill } from "react-bootstrap-icons";
import * as Tone from "tone";
import { useTabulature } from "../../../hooks";

export const RecorderSettings: React.FC<{ recording: boolean }> = observer(({ recording }) => {

    const {
        tabulatureRecorder,
        globalTempo,
        globalNumerator,
        globalDenominator,
        globalNoteDuration
    } = useTabulature();

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const [deviceLabel, setDeviceLabel] = useState<string>("");

    const [deviceId, setDeviceId] = useState<string>("");

    const [renderModal, setRenderModal] = useState(false);

    const [showCharts, setShowCharts] = useState(true);

    const handleCloseModal = () => setRenderModal(false);

    const canvasFFTRef = useRef<HTMLCanvasElement | null>(null);
    const canvasAMDFRef = useRef<HTMLCanvasElement | null>(null);

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
        let stopFunctions: { stopAMDF: () => void; stopFFT: () => void; } | null = null;

        if (showCharts && (tabulatureRecorder.monite || tabulatureRecorder.recording)) {
            if (canvasAMDFRef.current && canvasFFTRef.current) {
                stopFunctions = tabulatureRecorder.draw(canvasAMDFRef.current, canvasFFTRef.current);
            }
        }

        return () => {
            if (stopFunctions) {
                stopFunctions.stopAMDF();
                stopFunctions.stopFFT();
            }
        };
    }, [showCharts, tabulatureRecorder.monite, tabulatureRecorder.recording, canvasAMDFRef, canvasFFTRef, tabulatureRecorder]);

    const start = async () => {
        await Tone.start();
        if (!await tabulatureRecorder.record(
            deviceId,
            globalTempo,
            globalNumerator,
            globalDenominator,
            globalNoteDuration

        )) {
            setRenderModal(true)
        }

    }

    const moniteToggle = async () => {
        await Tone.start();
        if (!await tabulatureRecorder.moniteToggle(deviceId)) {
            setRenderModal(true);
        }
    }

    useEffect(() => {
        return () => {
            tabulatureRecorder.stop();
        }
    }, [tabulatureRecorder])

    useEffect(() => {
        if (!recording) {
            tabulatureRecorder.stop();
        }
    }, [tabulatureRecorder, recording])

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
                {showCharts && (
                    <>
                        <InputGroup
                            className="w-100 d-flex align-items-center justify-content-center" style={{ flex: '1 1 100%' }}
                        >
                            <canvas ref={canvasFFTRef} style={{ width: '50%', height: '150px', border: '1px solid #ccc' }} />
                            <canvas ref={canvasAMDFRef} style={{ width: '50%', height: '150px', border: '1px solid #ccc' }} />


                        </InputGroup>
                    </>
                    
                )}
                
                <InputGroup
                    className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
                >
                    <Button
                        onClick={() => start()}
                        variant="light"
                        className="border w-25 "
                        disabled={ tabulatureRecorder.monite || tabulatureRecorder.recording || devices.length === 0}
                    >
                        <RecordFill
                            color="red"
                        />
                    </Button>

                    <Button
                        onClick={() => stop()}
                        variant="light"
                        className="border  w-25"
                        disabled={tabulatureRecorder.monite || !tabulatureRecorder.recording}
                    >
                        <StopFill />
                    </Button>

                    <Button
                        className="border  w-25"

                        onClick={() => moniteToggle()}
                        disabled={tabulatureRecorder.recording}
                        variant={tabulatureRecorder.monite ? "danger" : "success"}
                    >
                        {`Monitor ${tabulatureRecorder.monite ? "off" : "on"}`}
                    </Button>
                    <InputGroup.Text
                        className="border  w-25 d-flex justify-content-center"
                    >
                        <FormCheck
                            checked={showCharts}
                            type="checkbox"
                            label="Show charts"
                            id={ "setShowCharts" }
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowCharts(e.target.checked)}
                        >

                        </FormCheck>
                    </InputGroup.Text>

                </InputGroup>
                <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}>
                    <Dropdown drop="down-centered">
                        <Dropdown.Toggle
                            variant="light"
                            className="border flex-grow-1"
                            disabled={tabulatureRecorder.monite || tabulatureRecorder.recording}
                        >
                            {`${deviceLabel}`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {devices.map((device) => (
                                <Dropdown.Item
                                    key={device.deviceId}
                                    onClick={() => {
                                        setDeviceLabel(device.label || `Microphone ${device.deviceId}`)
                                        setDeviceId(device.deviceId)
                                    }}
                                >
                                    {device.label || `Microphone ${device.deviceId}`}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button
                        className="border  w-25"
                        variant="light"
                        onClick={() => fetchDevices()}
                    >
                        Refresh
                    </Button>
                    <Button
                        className="border  w-25"
                        onClick={() => tabulatureRecorder.effectsToggle()}
                        variant={tabulatureRecorder.effectsOn ? "secondary" : "light"}
                    >
                        {`Effects ${tabulatureRecorder.effectsOn ? "off" : "on"}`}
                    </Button>
                   
                </InputGroup>
            </div>
        </>
    );
}
)
