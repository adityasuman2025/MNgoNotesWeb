import React from "react";
import { TYPE_TO_DO } from '../constants';

export default function NoteItem({
    isActive,
    noteDetails,
    onClick,
}) {
    return (
        <div className={["notesListItem", ...[isActive ? "activeNote" : ""]].join(" ")} onClick={() => { onClick(noteDetails) }}>
            <div className="notesListTitleText">{noteDetails.title}</div>
            <div className="notesListType">{noteDetails.type === TYPE_TO_DO ? "checkbox" : "text"}</div>
        </div>
    )
}