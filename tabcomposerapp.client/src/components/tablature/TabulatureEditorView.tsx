import { useState } from "react";
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


export const TabulatureEditorView = () => {

    const {
        tabulature,
        measuresPerRow,
    } = useTabulature();

    const { getToken } = useAuth();

    const [title, setTitle] = useState<string>(tabulature.title);

    const [maxFrets, setMaxFrets] = useState(tabulature.frets);

    const [description, setDescription] = useState(tabulature.description);

    const [showEditModal, setShowEditModal] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxFrets(event.target.valueAsNumber);
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    };
    const handleShowEditModal = () => setShowEditModal(true);

    const handleSaveEditModal = async () => {
        handleCloseEditModal();

        const token = await getToken();
        if (token) {
            tabulature.description = description;
            tabulature.frets = maxFrets;
            tabulature.title = title;
            const success = await TabulatureManagerApi.updateTabulature(token);
            if (!success) {
                //
            }
        } else {
            <SessionExpired />
        }
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
                    {title}
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
                                value={title}
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
                                value={maxFrets}
                                onChange={handleChangeMaxFrets}
                            />
                        </InputGroup>
                        <InputGroup
                            className="d-flex justify-content-center align-items-center column mb-3"
                        >
                            <InputGroup.Text>Description</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={description}
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
                        <MeasureProvider key={index} initialMeasure={measure} initialMeasureId={index}>
                            <MeasureLabelEditor />
                            <MeasureView isEditor={true} measurePerRow={measuresPerRow} />
                        </MeasureProvider>
                    )
                })}
                <AddMeasureView></AddMeasureView>
            </TabulatureContainer>
        </EditorToolbar>
  );
}

