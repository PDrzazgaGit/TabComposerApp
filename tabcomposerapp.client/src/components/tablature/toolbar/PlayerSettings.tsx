import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useTabulature } from "../../../hooks/useTabulature";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useError } from "../../../hooks/useError";

export const PlayerSettings = observer(() => {

    const { tabulature, tabulaturePlayer } = useTabulature();

    const { playerErrors, clearPlayerErrors, setPlayerErrors } = useError()

    const [selectedMeasure, setSelectedMeasure] = useState(0);

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
            await tabulaturePlayer.play();
        } else {
            const start = tabulature.getMeasure(selectedMeasure);
            if (start) {
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

    const [tempoFactor, setTempoFactor] = useState(1); // Domyœlnie 1

    // Handler zmieniaj¹cy tempo transportu
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
        <div>
            <Button
                onClick={() => { play() }}
            >
                Play
            </Button>
            <Button
                onClick={() => { pause() }}
            >
                Pause
            </Button>
            <Button
                onClick={() => { stop() }}
            >
                Stop
            </Button>

            {tabulature.getLength() > 1 && (
                <InputGroup>
                    <InputGroup.Text>
                        Start on measure
                    </InputGroup.Text>
                    <FormControl
                        type='number'
                        min={0}
                        value={selectedMeasure}
                        max={tabulature.getLength() - 1}
                        onChange={handleSelectMeasure}
                        onBlur={handleBlurSelectMeasure}
                    />
                </InputGroup>
            )}
            {playerErrors['playError'] && (
                <InputGroup className="d-flex justify-content-center align-items-center column mb-3">
                    <div className="text-danger">
                        {playerErrors["playError"]}
                    </div>

                </InputGroup>
            )}

            

            <h3>Speed {Math.round(tempoFactor * 100)} %</h3>
            <input
                type="range"
                min={0.25}
                max={2}
                step={0.05}
                value={tempoFactor}
                onChange={handleTempoChange}
                className="form-range"
            />
        </div>
    );
})