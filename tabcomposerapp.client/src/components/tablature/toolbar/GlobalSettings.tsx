import { InputGroup, FormControl, Dropdown, FormCheck, Button, Spinner } from "react-bootstrap";
import { NoteDuration } from "../../../models";
import { noteRepresentationMap } from "../../../utils/noteUtils";
import { useTabulature } from "../../../hooks/useTabulature";
import { useTabulatureApi } from "../../../hooks/useTabulatureApi";
import { useAuth } from "../../../hooks/useAuth";
import { autorun } from "mobx";
import { useEffect, useState } from "react";

export const GlobalSettings: React.FC = () => {

    const {
        measuresPerRow,
        setMeasuresPerRow,
        globalTempo,
        setGlobalTempo,
        globalNumerator,
        setGlobalNumerator,
        globalDenominator,
        setGlobalDenominator,
        globalNoteDuration,
        setGlobalNoteDuration,
        globalNoteInterval,
        setGlobalNoteInterval,
        shiftOnDelete,
        setShiftOnDelete
    } = useTabulature();

    const { updateTabulature, tabulatureManagerApi } = useTabulatureApi();
    const { getToken } = useAuth();

    

    const handleMeasuresPerRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeasuresPerRow(event.target.valueAsNumber);
    }

    const [upToDate, setUpToDate] = useState(true);

    useEffect(() => {

        const disposer = autorun(() => {
            setUpToDate(tabulatureManagerApi.upToDate);
        });

        return () => disposer();  // Czyszczenie efektu
    }, [tabulatureManagerApi]);
    
    const handleClick = async () => {
        const token = getToken();

        if (!token) {
            return;
        }

        const success = await updateTabulature(token);

        if (!success) {
            //
        }
    }

    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <InputGroup.Text>Display</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={5}
                    value={measuresPerRow}
                    onChange={handleMeasuresPerRow}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <InputGroup.Text>Tempo</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalTempo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalTempo(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <InputGroup.Text>Numerator</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalNumerator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalNumerator(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <InputGroup.Text>Denominator</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalDenominator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalDenominator(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <Dropdown drop="down-centered">
                    <Dropdown.Toggle variant="light" className="border flex-grow-1">
                        {`Duration: ${NoteDuration[globalNoteDuration]}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {Object.entries(noteRepresentationMap).map(([key, symbol]) => (
                            <Dropdown.Item key={key + "_duration"} onClick={() => setGlobalNoteDuration(key as unknown as NoteDuration)}>
                                {symbol}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <Dropdown drop="down-centered">
                    <Dropdown.Toggle variant="light" className="border flex-grow-1">
                        {`Interval: ${NoteDuration[globalNoteInterval]}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {Object.entries(noteRepresentationMap).map(([key, symbol]) => (
                            <Dropdown.Item key={key + "_interval"} onClick={() => setGlobalNoteInterval(key as unknown as NoteDuration)}>
                                {symbol}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center justify-content-center" style={{ flex: '1 1 20%' }}>
                <FormCheck
                    checked={shiftOnDelete}
                    type="checkbox"
                    id={"checkShift"}
                    label="Shift on delete"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShiftOnDelete(e.target.checked)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center justify-content-center" style={{ flex: '1 1 20%' }}>
                <Button
                    variant={upToDate && "light" || "success"}
                    onClick={() => handleClick()}
                    className="w-100"
                    disabled={ upToDate }
                >
                    {upToDate && "Up to date" || (
                        <>
                            <span className="me-1">Saving...</span>
                            <Spinner
                                animation="border"
                                role="status"
                                size="sm"
                            >
                                <span className="visually-hidden">Loading...</span>

                            </Spinner>
                        </>
                    )}
                </Button>
            </InputGroup>
        </div>
    );
}