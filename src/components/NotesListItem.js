import React from "react";

export default function NotesListItem({
    noteDetails,
    onClick,
}) {
    //function to hanlde when note item is clicked on
    function handleNoteItemClick() {
        onClick(noteDetails);
    }

    //component rendering
    return (
        <div
            className="notesListItem"
            onClick={handleNoteItemClick}>
            <img
                alt="notesItemIcon"
                className="notesListImg"
                src={
                    noteDetails.type === "1" ?
                            require('../img/notes_icon.png')
                        :
                            require('../img/todos_icon.png')
                    }
              />

            <div className="notesListText">
                <div className="notesListTitleText" >
                    {noteDetails.title}
                </div>
                <div className="notesListType" >
                    {noteDetails.type === "1" ? "text" : "checkbox"}
                </div>
            </div>
        </div>
    )
}