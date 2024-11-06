import { useEffect } from "react";
import { INote } from "../models";
import { NoteView } from "./NoteView";

interface StringContainerProps {
    stringId: number;
    notes: INote[];
}

export const StringContainer: React.FC<StringContainerProps> = ({ stringId, notes }) => {
    const notesComponents: JSX.Element[] = notes.map(note => {
        return (
            <NoteView note={note} stringId={stringId}></NoteView>
        );
    })



    return (
        <>
            {notesComponents }
        </>
    );
}