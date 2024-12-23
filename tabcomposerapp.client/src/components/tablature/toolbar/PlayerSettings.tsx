import { Button } from "react-bootstrap";
import { useTabulature } from "../../../hooks/useTabulature";
import { useEffect, useState } from "react";
import { TabulaturePlayer } from "../../../services/audio/TabulaturePlayer";

export const PlayerSettings = () => {

    const { tabulature } = useTabulature();

    const [player, setPlayer] = useState<TabulaturePlayer | undefined>(undefined);

    useEffect(() => {
        if (tabulature) {
            setPlayer(new TabulaturePlayer(tabulature));
        }
    }, [tabulature])

    const play = async () => {

        if (player) {

            await player.play();

            //const tab = new TabulaturePlayer();
            //tab.playTabulature(tabulature);
        }
    }

    const pause = async () => {

        if (player) {

            player.pause();
            //player.changeTempo(1.75);
            //const tab = new TabulaturePlayer();
            //tab.playTabulature(tabulature);
        }
    }

    const stop = async () => {

        if (player) {

            player.stop();

            //const tab = new TabulaturePlayer();
            //tab.playTabulature(tabulature);
        }
    }

    const [tempoFactor, setTempoFactor] = useState(1); // Domyœlnie 1

    // Handler zmieniaj¹cy tempo transportu
    const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (player) {
            player.changeTempo(value);
        }
        setTempoFactor(value);
    };

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
}