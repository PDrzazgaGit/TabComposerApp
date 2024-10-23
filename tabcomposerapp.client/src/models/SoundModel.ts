import { Notation } from './NotationModel'

export interface ISound {
    readonly frequency: number,
    readonly notation: Notation,
    readonly octave: number
}
