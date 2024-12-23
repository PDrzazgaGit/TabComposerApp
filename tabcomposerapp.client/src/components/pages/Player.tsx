import { Container } from "react-bootstrap";
import { TabulatureView } from "../tablature/TabulatureView";
import { TabulatureProvider } from "../../context/TabulatureProvider";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { useEffect, useState } from "react";
import { ITabulature } from "../../models";

export const Player = () => {

    const [tabulature, setTabulature] = useState<ITabulature | null>();

    useEffect(() => {
        setTabulature(TabulatureManagerApi.getTabualture())
    }, [])

    if (!tabulature)
        return (<></>)

    return (

        <TabulatureProvider initialtabulature={tabulature}>
            <Container className="mb-3">
                <TabulatureView />
            </Container>
        </TabulatureProvider> 
    );
}