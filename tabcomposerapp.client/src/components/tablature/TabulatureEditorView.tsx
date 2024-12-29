import { useEffect, useState } from "react";
import { MeasureProvider } from "../../context/MeasureProvider";
import { useTabulature } from "../../hooks/useTabulature";
import { AddMeasureView } from "./measures/AddMeasureView";
import { MeasureLabelEditor } from "./measures/MeasureLabelEditor";
import { MeasureView } from "./measures/MeasureView";
import { TabulatureContainer } from "./TabulatureContainer";
import { EditorToolbar } from "./toolbar/EditorToolbar";
import { Modal, Button, FormControl, InputGroup } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { TabulatureManagerApi } from "../../api/TabulatureManagerApi";
import { SessionExpired } from "../SessionExpired";
import { observer } from "mobx-react-lite";
import { runInAction } from 'mobx';
import { useTabulatureApi } from "../../hooks/useTabulatureApi";


export const TabulatureEditorView = observer(() => {

    const {
        tabulature,
        measuresPerRow,
    } = useTabulature();

    const { getToken } = useAuth();

    const { updateTabulature, clientApi } = useTabulatureApi();

    useEffect(() => {
        // Funkcja, która bêdzie wywo³ywana co 1000 ms (1 sekunda)
        const intervalId = setInterval(async () => {
            const token = getToken();

            if (!token) {
                return;
            }

            const success = await updateTabulature(token);
            console.log(clientApi.authorized)
            if (!success) {
                //
            }
        }, 1000);

        // Funkcja cleanup - czyszczenie interwa³u po odmontowaniu komponentu
        return () => {
            clearInterval(intervalId);
        };
    }, [getToken, updateTabulature]); 

    const [showEditModal, setShowEditModal] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        runInAction(() => tabulature.title = event.target.value); 
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
        runInAction(() => tabulature.frets = event.target.valueAsNumber);
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        runInAction(() => tabulature.description = event.target.value);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    };

    const handleShowEditModal = () => setShowEditModal(true);

    const handleSaveEditModal = async () => {
        handleCloseEditModal();

        const token = getToken();
        if (!token) {
            return;
        }
        const success = await updateTabulature(token);
        if (!success) {
            //
        }
    }

    if (!clientApi.authorized) {

        return <SessionExpired />
    }

    return (
        <EditorToolbar>
            <div
                className="d-flex justify-content-center align-items-center mb-3 column"
            >
                <h1
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={handleShowEditModal}
                >
                    {tabulature.title}
                </h1>
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify tab</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup
                            className="d-flex justify-content-center align-items-center column mb-3"
                        >
                            <InputGroup.Text>Title</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={tabulature.title}
                                onChange={handleTitleChange}
                            />
                        </InputGroup>
                        <InputGroup
                            className="d-flex justify-content-center align-items-center column mb-3"
                        >
                            <InputGroup.Text>Frets</InputGroup.Text>
                            <FormControl
                                type="number"
                                min={12}
                                max={30}
                                value={tabulature.frets}
                                onChange={handleChangeMaxFrets}
                            />
                        </InputGroup>
                        <InputGroup
                            className="d-flex justify-content-center align-items-center column mb-3"
                        >
                            <InputGroup.Text>Description</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={tabulature.description}
                                onChange={handleChangeDescription}
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => handleCloseEditModal()}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={() => handleSaveEditModal()}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <TabulatureContainer maxItemsPerRow={measuresPerRow} >
                {tabulature.map((measure, index) => {
                    return (
                        <MeasureProvider key={index} measure={measure} initialMeasureId={index}>
                            <MeasureLabelEditor />
                            <MeasureView isEditor={true} measurePerRow={measuresPerRow} />
                        </MeasureProvider>
                    )
                })}
                <AddMeasureView></AddMeasureView>
            </TabulatureContainer>
        </EditorToolbar>
    );
})

