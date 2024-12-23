import { Container } from "react-bootstrap";
import { TabulatureEditorView } from "../tablature/TabulatureEditorView";
import { TabulatureProvider } from "../../context/TabulatureProvider";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { useState, useEffect } from "react";
import { ITabulature } from "../../models";

export const Editor = () => {

    const [tabulature, setTabulature] = useState<ITabulature | null>();

    useEffect(() => {
        setTabulature(TabulatureManagerApi.getTabualture())
    }, [])

    if (!tabulature)
        return (<></>)

    return (
        <TabulatureProvider initialtabulature={tabulature}>
            <Container className="mt-3">
                <TabulatureEditorView />
            </Container>
        </TabulatureProvider>
        
    );
}