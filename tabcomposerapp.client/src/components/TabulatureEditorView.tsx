import { Card, Tab, Dropdown, FormControl, InputGroup, Tabs, FormCheck } from "react-bootstrap";
import { MeasureProvider } from "../context/MeasureProvider";
import { useTabulature } from "../hooks/useTabulature";
import { AddMeasureView } from "./AddMeasureView";
import { MeasureLabelEditor } from "./MeasureLabelEditor";
import { MeasureView } from "./MeasureView";
import { TabulatureContainer } from "./TabulatureContainer";
import { useState } from "react";
import { StickyPanel } from "./StickyPanel";
import { NoteDuration } from "../models";
import { noteRepresentationMap } from "../utils/noteUtils";
import { SerializationService } from "../services/SerializationService";

export const TabulatureEditorView = () => {

    const {
        tabulature,
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

    const [title, setTitle] = useState<string>(tabulature!.title);

    const [tabKey, setTabKey] = useState<string | null>(null);

    const handleMeasuresPerRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeasuresPerRow(event.target.valueAsNumber);
    }

    function exampleFunction() {
        const testString: string = SerializationService.serializeTabulature(tabulature!);
        console.log(testString);

    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (tabulature) {
            setTitle(event.target.value);
            tabulature.title = title;
        } 
        exampleFunction();
    }

    const handleOnBlur = () => {
        console.log(title.length);
        if (title.length === 0) {
            setTitle("Untitled");
        }
    }

    const renderGlobalToolbar = () => (
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




    const renderFooterContent = () => (
        <Card>
            <Card.Body
                
            >
                <Tabs
                    activeKey={tabKey ? tabKey : 'toolbar'}
                    onSelect={(k) => setTabKey(k)}
                    className="mb-3"
                    fill
                >   
                    <Tab
                        eventKey="toolbar" title="Global Toolbar"
                    >
                        {renderGlobalToolbar()}
                    </Tab>
                    <Tab
                        eventKey="player" title="Tab Player"
                    >
                    </Tab>
                    <Tab
                        eventKey="recorder" title="Tab Recorder"
                    >
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>

        
    )

    return (
        <StickyPanel content={renderFooterContent()}>
                <InputGroup
                    className="d-flex justify-content-center align-items-center mb-3 column"
                >
                    <h1>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            onBlur={handleOnBlur}
                            style={{
                                padding: "0",
                                margin: "0",
                                border: "0",
                                outline: "0",
                                cursor: "pointer",
                                textAlign: "center"
                            }}
                        />
                    </h1>
                </InputGroup>
                <TabulatureContainer maxItemsPerRow={measuresPerRow} >
                    {tabulature!.map((measure, index) => {
                        return (
                            <MeasureProvider key={index} initialMeasure={measure} initialMeasureId={index}>
                                <MeasureLabelEditor />
                                <MeasureView isEditor={true} measurePerRow={measuresPerRow} />

                            </MeasureProvider>
                        )
                    })}
                    <AddMeasureView></AddMeasureView>
                </TabulatureContainer>
                   
               
        </StickyPanel>
  );
}

