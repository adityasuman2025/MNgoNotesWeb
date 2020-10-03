import React from "react";
import cx from "classnames";

function NotesListItem({
    title,
    type,
    onClick,
}) {
    return (
        <div 
            className="notesListItem" 
            onClick={onClick}>
            <img 
                className="notesListImg" 
                src={
                        type === 1 ? 
                            require('../img/notes_icon.png') 
                        : 
                            require('../img/todos_icon.png')
                    }
              />
            <div className="notesListText">
                <div className="notesListTitleText" >
                    {title}
                </div>
                <div className="notesListType" >
                    { type === 1 ? "text" : "checkbox" }
                </div>
            </div>            
        </div>
    )
}

export default NotesListItem;