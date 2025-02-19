import { autorun } from "mobx";
import { useEffect, useState } from "react";
import { Button, Dropdown, FormCheck, FormControl, InputGroup, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useAuth, useTabulature, useTabulatureApi } from "../../../hooks";
import { NoteDuration } from "../../../models";
import { noteRepresentationMap } from "../../../utils";

export const GlobalSettings: React.FC<{ previevMode?: boolean }> = ({previevMode=false}) => {

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

    const [upToDate, setUpToDate] = useState(true);

    useEffect(() => {

        const disposer = autorun(() => {
            setUpToDate(tabulatureManagerApi.upToDate);
        });

        return () => disposer();  
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

    const minValue: number = 1;
    const maxTempo: number = 999;
    const maxDisplay: number = 5;
    const maxMetrum: number = 12;

    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <OverlayTrigger
                    placement="bottom"
                    overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                        return (
                            <Tooltip {...props}>
                                Number of measures in row
                            </Tooltip>
                        )
                    }}
                    flip
                >
                    <InputGroup.Text>Display</InputGroup.Text>
                </OverlayTrigger>
                
                <FormControl
                    type="number"
                    min={minValue}
                    max={maxDisplay}
                    value={isNaN(measuresPerRow) ? '' : measuresPerRow}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setMeasuresPerRow(e.target.valueAsNumber);
                    }}
                    onBlur={(() => {
                        if (measuresPerRow > maxDisplay) {
                            setMeasuresPerRow(maxDisplay)
                        } else if (isNaN(measuresPerRow)) {
                            setMeasuresPerRow(3)
                        } else if (measuresPerRow < minValue) {
                            setMeasuresPerRow(minValue)
                        }
                    })}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <OverlayTrigger
                    placement="bottom"
                    overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                        return (
                            <Tooltip {...props}>
                                From range {`${minValue}-${maxTempo}`}
                            </Tooltip>
                        )
                    }}
                    flip
                >
                    <InputGroup.Text>Tempo</InputGroup.Text>
                </OverlayTrigger>
                
                <FormControl
                    type="number"
                    min={minValue}
                    max={maxTempo}
                    value={isNaN(globalTempo) ? '' : globalTempo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGlobalTempo(e.target.valueAsNumber)
                    }}
                    onBlur={(() => {
                        if (globalTempo > maxTempo) {
                            setGlobalTempo(maxTempo)
                        } else if (isNaN(globalTempo)) {
                            setGlobalTempo(120)
                        } else if (globalTempo < minValue) {
                            setGlobalTempo(minValue)
                        }
                    })}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <OverlayTrigger
                    placement="bottom"
                    overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                        return (
                            <Tooltip {...props}>
                                From range {`${minValue}-${maxMetrum}`}
                            </Tooltip>
                        )
                    }}
                    flip
                >
                    <InputGroup.Text>Numerator</InputGroup.Text>
                </OverlayTrigger>
               
                <FormControl
                    type="number"
                    min={minValue}
                    max={maxMetrum}
                    value={isNaN(globalNumerator) ? '' : globalNumerator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGlobalNumerator(e.target.valueAsNumber)
                    }}
                    onBlur={(() => {
                        if (globalNumerator > maxMetrum) {
                            setGlobalNumerator(maxMetrum)
                        } else if (isNaN(globalNumerator)) {
                            setGlobalNumerator(4)
                        } else if (globalNumerator < minValue) {
                            setGlobalNumerator(minValue)
                        }
                    })}
                />
            </InputGroup>

            <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 20%' }}>
                <OverlayTrigger
                    placement="bottom"
                    overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                        return (
                            <Tooltip {...props}>
                                From range {`${minValue}-${maxMetrum}`}
                            </Tooltip>
                        )
                    }}
                    flip
                >
                    <InputGroup.Text>Denominator</InputGroup.Text>
                </OverlayTrigger>
                
                <FormControl
                    type="number"
                    min={minValue}
                    max={maxMetrum}
                    value={isNaN(globalDenominator) ? '' : globalDenominator}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGlobalDenominator(e.target.valueAsNumber)
                    }}
                    onBlur={(() => {
                        if (globalDenominator > maxMetrum) {
                            setGlobalDenominator(maxMetrum)
                        } else if (isNaN(globalDenominator)) {
                            setGlobalDenominator(4)
                        } else if (globalDenominator < minValue) {
                            setGlobalDenominator(minValue)
                        }
                    })}
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
                {previevMode === true && (
                    <Button
                        variant="warning"
                        disabled={true}
                        className="w-100"
                    >
                        Trial Mode
                    </Button>
                ) || (
                    <Button
                        variant={upToDate && "light" || "success"}
                        onClick={() => handleClick()}
                        className="w-100"
                        disabled={upToDate}
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
                )}
                
            </InputGroup>
        </div>
    );
}