import React from "react";
import { TYPE_TO_DO } from '../constants';

export default function NoteItem({
    noteDetails,
    onClick,
}) {
    return (
        <div className="notesListItem" onClick={() => { onClick(noteDetails) }}>
            <img
                alt="notesItemIcon" className="notesListImg"
                src={noteDetails.type === TYPE_TO_DO ? require('../img/todos_icon.png') : require('../img/notes_icon.png')}
            />

            <div className="notesListText">
                <div className="notesListTitleText">{noteDetails.title}</div>
                <div className="notesListType">{noteDetails.type === TYPE_TO_DO ? "checkbox" : "text"}</div>
            </div>
        </div>
    )
}