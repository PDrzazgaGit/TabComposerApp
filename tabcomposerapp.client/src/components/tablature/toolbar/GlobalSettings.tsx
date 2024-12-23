import { InputGroup, FormControl, Dropdown, FormCheck } from "react-bootstrap";
import { NoteDuration } from "../../../models";
import { noteRepresentationMap } from "../../../utils/noteUtils";
import { useTabulature } from "../../../hooks/useTabulature";

export const GlobalSettings = () => {

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

    const handleMeasuresPerRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeasuresPerRow(event.target.valueAsNumber);
    }

    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
                <InputGroup.Text>Display</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={5}
                    value={measuresPerRow}
                    onChange={handleMeasuresPerRow}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
                <InputGroup.Text>Tempo</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalTempo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalTempo(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
                <InputGroup.Text>Numerator</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalNumerator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalNumerator(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
                <InputGroup.Text>Denominator</InputGroup.Text>
                <FormControl
                    type="number"
                    min={1}
                    max={999}
                    value={globalDenominator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalDenominator(e.target.valueAsNumber)}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
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

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 15%' }}>
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

            <InputGroup className="w-100 d-flex align-items-center justify-content-center" style={{ flex: '1 1 15%' }}>
                <FormCheck
                    checked={shiftOnDelete}
                    type="checkbox"
                    id={"checkShift"}
                    label="Shift on delete"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShiftOnDelete(e.target.checked)}
                />
            </InputGroup>
        </div>
    );
}