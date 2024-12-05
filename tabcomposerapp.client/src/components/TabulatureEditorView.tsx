import { Badge, Card, Container, FormControl, InputGroup } from "react-bootstrap";
import { MeasureProvider } from "../context/MeasureProvider";
import { useTabulature } from "../hooks/useTabulature";
import { AddMeasureView } from "./AddMeasureView";
import { MeasureLabelEditor } from "./MeasureLabelEditor";
import { MeasureView } from "./MeasureView";
import { TabulatureContainer } from "./TabulatureContainer";
import { useState } from "react";
import { StickyPanel } from "./StickyPanel";


export const TabulatureEditorView = () => {

    const { tabulature, measuresPerRow, setMeasuresPerRow } = useTabulature();

    const [title, setTitle] = useState<string>('Untitled');

    const handleMeasuresPerRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeasuresPerRow(event.target.valueAsNumber);
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (tabulature) {
            setTitle(event.target.value);
            tabulature.title = title;
        }
    }

    const handleOnBlur = () => {
        console.log(title.length);
        if (title.length === 0) {
            setTitle("Untitled");
        }
    }

    const renderFooterContent = () => (
        <Card>
            <Card.Header>
                <h4>
                    <Badge bg="secondary">Global Toolbar</Badge>
                </h4>
            </Card.Header>
            <Card.Body>
                <InputGroup
                    className="d-flex justify-content-center align-items-center column"
                >
                    <InputGroup.Text>Display measures</InputGroup.Text>
                    <FormControl
                        type="number"
                        min={1}
                        max={5}
                        value={measuresPerRow}
                        onChange={handleMeasuresPerRow}
                    ></FormControl>
                </InputGroup>
                
            </Card.Body>
            
        </Card>
        
    )

    return (
        <Container className="mt-3">
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
                        {tabulature.map((measure, index) => {
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
        </Container>
  );
}

