import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useTabulature } from "../../../hooks/useTabulature";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { AppErrors } from "../../../models/AppErrorsModel";
import { PlayFill, PauseFill, StopFill } from 'react-bootstrap-icons';


export const PlayerSettings = observer(() => {

    const { tabulature, tabulaturePlayer } = useTabulature();

    const [playerErrors, setPlayerErrors] = useState<AppErrors>({});

    const clearPlayerErrors = () => setPlayerErrors({});

    const [selectedMeasure, setSelectedMeasure] = useState(0);

    const [tempoFactor, setTempoFactor] = useState(1); 

    useEffect(() => {
        return () => {
            if (tabulaturePlayer) {
                tabulaturePlayer.stop();
            }
        }
    }, [tabulaturePlayer])

    const play = async () => {
        clearPlayerErrors();
        if (selectedMeasure == 0) {
          //  setPlaying(true);
            await tabulaturePlayer.play();
        } else {
            const start = tabulature.getMeasure(selectedMeasure);
            if (start) {
               // setPlaying(true);
                await tabulaturePlayer.play(start);
            } else {
                setPlayerErrors({ ['playError']: [`There is no measure with id: ${selectedMeasure}.`] })
            }
        }
    }

    const pause = async () => {
        tabulaturePlayer.pause();
    }

    const stop = async () => {
        tabulaturePlayer.stop();
    }



    const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        tabulaturePlayer.changeTempo(value);
        setTempoFactor(value);
    };

    const handleSelectMeasure = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMeasure(event.target.valueAsNumber);
    }

    const handleBlurSelectMeasure = () => {
        if (isNaN(selectedMeasure)) {
            setSelectedMeasure(0);
        }
    }

    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">

            <InputGroup
                className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}
            >
                <Button
                    onClick={() => { pause() }}
                    variant={tabulaturePlayer.isPlaying === false ? "secondary" : "light"}
                    className="border flex-grow-1"
                >
                    <PauseFill />
                </Button>
                <Button
                    onClick={() => { play() }}
                    variant={tabulaturePlayer.isPlaying === true ? "secondary" : "light"}
                    className="border flex-grow-1"
                >
                    <PlayFill />
                </Button>

                <Button
                    onClick={() => { stop() }}
                    variant="light"
                    className="border flex-grow-1"
                >
                    <StopFill />
                </Button>
            </InputGroup>

            
              
            {playerErrors['playError'] && (
                <InputGroup className="w-100 d-flex align-items-center" style={{ flex: '1 1 100%' }}>
                    <div className="text-danger">
                        {playerErrors["playError"]}
                    </div>

                </InputGroup>
            )}



            <InputGroup
                className="w-100 d-flex align-items-center" style={{ flex: '1 1 33%' }}
            >
                {tabulature.getLength() > 1 && (
                    <>
                        <InputGroup.Text
                            className="w-50"
                        >
                            Start at measure:
                        </InputGroup.Text>
                        <FormControl
                            type='number'
                            min={0}
                            value={selectedMeasure}
                            max={tabulature.getLength() - 1}
                            onChange={handleSelectMeasure}
                            onBlur={handleBlurSelectMeasure}
                            className="w-50"
                            disabled={tabulaturePlayer.isPlaying === true}
                        />
                    </>
                )}
            </InputGroup>

            <InputGroup
                className="w-100 d-flex align-items-center" style={{ flex: '1 1 30%' }}
            >
                <InputGroup.Text
                    className="d-flex justify-content-center align-items-center w-100"
                >
                    &#8203;
                    <input
                        className="flex-grow-1"
                        type="range"
                        min={0.25}
                        max={2}
                        step={0.05}
                        value={tempoFactor}
                        onChange={handleTempoChange}
                    />
                </InputGroup.Text>

            </InputGroup>

            <InputGroup
                className="w-100 d-flex align-items-center" style={{ flex: '1 1 33%' }}
            >
                <InputGroup.Text
                    className="flex-grow-1 fw-bold w-100 "
                    style={{textAlign: 'center'} } 
                >
                    Speed: {Math.round(tempoFactor * 100)}%
                </InputGroup.Text>
            </InputGroup>
            

            
        </div>
    );
})

/*

<div className="d-flex justify-content-center align-items-center gap-3 row">

            <div
                className="d-flex justify-content-center align-items-center w-75 gap-3"
            >
                <InputGroup
                    className="d-flex justify-content-center align-items-center w-50"
                >
                    <Button
                        onClick={() => { pause() }}
                        variant={tabulaturePlayer.isPlaying === false ? "secondary" : "light"}
                        className="border flex-grow-1"
                    >
                        <PauseFill />
                    </Button>
                    <Button
                        onClick={() => { play() }}
                        variant={tabulaturePlayer.isPlaying === true ? "secondary" : "light"}
                        className="border flex-grow-1"
                    >
                        <PlayFill />
                    </Button>

                    <Button
                        onClick={() => { stop() }}
                        variant="light"
                        className="border flex-grow-1"
                    >
                        <StopFill />
                    </Button>
                </InputGroup>

                <InputGroup
                    className="d-flex justify-content-center align-items-center w-50"
                >
                    <InputGroup.Text
                        className="d-flex justify-content-center align-items-center w-100"
                    >
                        &#8203;
                        <input
                            className="flex-grow-1"
                            type="range"
                            min={0.25}
                            max={2}
                            step={0.05}
                            value={tempoFactor}
                            onChange={handleTempoChange}
                        />
                    </InputGroup.Text>
                    
                </InputGroup>

            </div>
              
            {playerErrors['playError'] && (
                <InputGroup className="d-flex justify-content-center align-items-center column w-75">
                    <div className="text-danger">
                        {playerErrors["playError"]}
                    </div>

                </InputGroup>
            )}

            <InputGroup
                className="d-flex justify-content-center align-items-center w-75 gap-3"
            >
                <InputGroup
                    className="d-flex justify-content-center align-items-center w-50"
                >

                </InputGroup>
                <InputGroup
                    className="d-flex justify-content-center align-items-center w-50"
                >
                    {tabulature.getLength() > 1 && (
                        <>
                            <InputGroup.Text>
                                Start at measure:
                            </InputGroup.Text>
                            <FormControl
                                type='number'
                                min={0}
                                value={selectedMeasure}
                                max={tabulature.getLength() - 1}
                                onChange={handleSelectMeasure}
                                onBlur={handleBlurSelectMeasure}
                                className="flex-grow-1"
                                disabled={tabulaturePlayer.isPlaying === true}
                            />
                        </>
                    )}
                </InputGroup>
                

            </InputGroup>

            
        </div>

*/