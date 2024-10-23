import { MusicScale } from "./../../services/MusicScale"

export const Song = () => {

    const sound = MusicScale.getSound(MusicScale.Notation.A, 4);

    return <>
        {
            
            sound.frequency

        }
    </>
}