import { runInAction } from 'mobx';
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Button, FormControl, InputGroup, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { SessionExpired } from "../";
import { MeasureProvider } from "../../context";
import { useAuth, useTabulature, useTabulatureApi } from "../../hooks";
import { TabulatureContainer } from "./";
import { AddMeasureView, MeasureLabelEditor, MeasureView } from "./measures";
import { EditorToolbar } from "./toolbar";


export const TabulatureEditorView: React.FC<{ previevMode?: boolean }> = observer(({ previevMode = false}) => {

    const {
        tabulature,
        measuresPerRow,
    } = useTabulature();

    const { getToken, clientAuth } = useAuth();

    const { updateTabulature, tabulatureManagerApi } = useTabulatureApi();

    const updateTimeMs: number = 5000;

    const token = useMemo(() => getToken(), [getToken]);

    const minFret = 12

    const maxFret = 30

    useEffect(() => {
        if (previevMode)
            return;
        const intervalId = setInterval(async () => {

            if (!tabulatureManagerApi.upToDate) {
                
                const success = await updateTabulature(token ? token : '');

                if (!success) {
                    //
                }
            }

        }, updateTimeMs);

        return () => {
            if (previevMode)
                return;
            clearInterval(intervalId);
            updateTabulature(token ? token : '');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabulature]);
    
    const [showEditModal, setShowEditModal] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        runInAction(() => tabulature.title = event.target.value); 
    }

    const handleChangeMaxFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.valueAsNumber;
        
        if (isNaN(value) ) {
            value = minFret;
        }
        
        runInAction(() => tabulature.frets = value);
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
        if (previevMode)
            return;
        const token = getToken();
        if (!token) {
            return;
        }
        const success = await updateTabulature(token);
        if (!success) {
            //
        }
    }

    if (clientAuth.authorized === false && previevMode === false) {
        return <SessionExpired />
    }

    return (
        <EditorToolbar previewMode={previevMode }>
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
                            <OverlayTrigger
                                placement="bottom"
                                overlay={(props: React.HTMLAttributes<HTMLDivElement>) => {
                                    return (
                                        <Tooltip {...props}>
                                            From range {`${minFret}-${maxFret}`}
                                        </Tooltip>
                                    )
                                }}
                                flip
                            >
                                <InputGroup.Text>Frets</InputGroup.Text>
                            </OverlayTrigger>
                            <FormControl
                                type="number"
                                min={minFret}
                                max={maxFret}
                                value={tabulature.frets}
                                onChange={handleChangeMaxFrets}
                                onBlur={() => {
                                    if (tabulature.frets < minFret) {
                                        tabulature.frets = minFret
                                    } else if (tabulature.frets > maxFret) {
                                        tabulature.frets = maxFret;
                                    }
                                }}
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
                            <MeasureLabelEditor previewMode={ previevMode} />
                            <MeasureView isEditor={true} measurePerRow={measuresPerRow} />
                        </MeasureProvider>
                    )
                })}
                <AddMeasureView></AddMeasureView>
            </TabulatureContainer>
        </EditorToolbar>
    );
})