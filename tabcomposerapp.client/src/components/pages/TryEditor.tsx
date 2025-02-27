import { useMemo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { TabulatureProvider } from "../../context";
import { Articulation, INote, NoteDuration, Tabulature } from "../../models";
import { TuningFactory } from "../../services";
import { TabulatureEditorView } from "../tablature";

export const TryEditor = () => {

    const tabulature = useMemo(() => {
        const tab = new Tabulature(TuningFactory.EStandardTuning(), 24, "Try TabComposer!", "Guest", "Here's your tab ground! Remember that your progress won't be saved. Consider creating an account!");

        for (let i = 0; i < 1; i++) {
            tab.addMeasure(100, 4, 4);
            const measure = tab.getMeasure(i);
            measure?.pushNote(0,6,NoteDuration.Quarter)
            measure?.moveNoteRight(measure?.pushNote(2,5,NoteDuration.Quarter) as INote,5,false,NoteDuration.Thirtytwo)
            measure?.moveNoteRight(measure?.pushNote(2, 4, NoteDuration.Eighth) as INote,4,false,NoteDuration.Sixteenth)
            measure?.moveNoteRight(measure?.pushNote(3, 3, NoteDuration.Sixteenth) as INote,3,false,NoteDuration.Eighth)
            measure?.pushNote(5, 3, NoteDuration.Eighth)
            measure?.moveNoteRight(measure?.pushNote(6, 2, NoteDuration.Eighth) as INote, 2, false, NoteDuration.Quarter)
 
           
            const note1 = measure?.pushNote(4, 1, NoteDuration.Eighth);
            note1?.setArticulation(Articulation.Legato)
            measure?.moveNoteRight(note1 as INote, 1, false, NoteDuration.Quarter)
            measure?.pushNote(5, 1, NoteDuration.Eighth) 
            
            const note =  measure?.pushNote(7, 1, NoteDuration.Eighth) as INote
            note.slide = true;
            note.setArticulation(Articulation.BendFullReturn)
            measure?.pushNote(8, 1, NoteDuration.Eighth) 
            measure?.pushNote(12, 1, NoteDuration.Eighth) 
            
            
        }


        return tab;
    }, [])

    return (
        <Container className="mt-3">
            {tabulature && (
                
                <TabulatureProvider initialtabulature={tabulature}>
                    <TabulatureEditorView previevMode={true} />
                </TabulatureProvider>
            ) || (
                    <Row className="align-items-center">
                        <Col className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                )}
        </Container>
    );
}