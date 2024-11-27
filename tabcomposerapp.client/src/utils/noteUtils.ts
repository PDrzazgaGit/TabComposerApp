import { NoteDuration } from "../models";

export const pauseRepresentationMap: Record<NoteDuration, string> = {
    [NoteDuration.Whole]: String.fromCodePoint(0x1D13B),
    [NoteDuration.Half]: String.fromCodePoint(0x1D13C),
    [NoteDuration.Quarter]: String.fromCodePoint(0x1D13D),
    [NoteDuration.Eighth]: String.fromCodePoint(0x1D13E),
    [NoteDuration.Sixteenth]: String.fromCodePoint(0x1D13F),
    [NoteDuration.Thirtytwo]: String.fromCodePoint(0x1D140),
};

export const noteRepresentationMap: Record<NoteDuration, string> = {
    [NoteDuration.Whole]: String.fromCodePoint(0x1D15D),
    [NoteDuration.Half]: String.fromCodePoint(0x1D15E),
    [NoteDuration.Quarter]: String.fromCodePoint(0x1D15F),
    [NoteDuration.Eighth]: String.fromCodePoint(0x1D160),
    [NoteDuration.Sixteenth]: String.fromCodePoint(0x1D161),
    [NoteDuration.Thirtytwo]: String.fromCodePoint(0x1D162),
};