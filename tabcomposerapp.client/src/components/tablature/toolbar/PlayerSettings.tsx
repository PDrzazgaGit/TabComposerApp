import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { PauseFill, PlayFill, StopFill } from 'react-bootstrap-icons';
import { useTabulature } from "../../../hooks";
import { AppErrors } from "../../../models";
import * as Tone from "tone";

export const PlayerSettings: React.FC<{ playing: boolean }> = observer(({ playing }) => {

    const { tabulature, tabulaturePlayer, setRecordTempo } = useTabulature();

    const [playerErrors, setPlayerErrors] = useState<AppErrors>({});

    const clearPlayerErrors = () => setPlayerErrors({});

    const [selectedMeasure, setSelectedMeasure] = useState(0);

    const [tempoFactor, setTempoFactor] = useState(1); 

    useEffect(() => {
        return () => {
            tabulaturePlayer.stop();
        }
    }, [tabulaturePlayer])

    useEffect(() => {
        if (!playing) {
            tabulaturePlayer.stop();
        }
    }, [tabulaturePlayer, playing])

    const play = async () => {
        clearPlayerErrors();
        if (selectedMeasure == 0) {
            Tone.start();
            await tabulaturePlayer.play();
        } else {
            if (selectedMeasure > tabulature.getLength() - 1) {
                setSelectedMeasure(tabulature.getLength() - 1);
            }
            const start = tabulature.getMeasure(selectedMeasure);
            if (start) {
                await Tone.start();
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
        setRecordTempo(value);
    };

    const handleSelectMeasure = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMeasure(event.target.valueAsNumber);
    }

    const handleBlurSelectMeasure = () => {
        if (isNaN(selectedMeasure) || selectedMeasure < 0) {
            setSelectedMeasure(0);
        } else if (selectedMeasure > tabulature.getLength() - 1) {
            setSelectedMeasure(tabulature.getLength() - 1)
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
                            value={isNaN(selectedMeasure) ? '' : selectedMeasure}
                            max={tabulature.getLength() - 1}
                            onChange={handleSelectMeasure}
                            onBlur={handleBlurSelectMeasure}
                            className="w-50"
                            disabled={tabulaturePlayer.isPlaying === true || tabulaturePlayer.isPlaying === false}
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