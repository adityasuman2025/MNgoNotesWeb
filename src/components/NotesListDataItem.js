import React from "react";
import classNames from "classnames";

export default function NotesListDataItem({
    idx,
    notesType,
    notesListData,
    onCheckBoxClick,
    onRemoveClick,
    onInputFieldChange,
    onSubmitInputField,
}) {
    const rowId = parseInt(notesListData.id);
    const isActive = parseInt(notesListData.is_active);
    const title = notesListData.list_title.toString();
    var toSet = isActive === 1 ? 2: 1;

    //component rendering
    return (
        <form 
            className="notesListDataFields" 
            onSubmit={(e) => onSubmitInputField(e, idx)}
        >
            {
            //if notes type is checkbox then showing checkbox icon
                notesType === 2 ?
                    <img
                        alt="checkBoxIcon"
                        className="notesListDataFieldCheckedIcon"
                        src={
                            isActive === 1 ?
                                require('../img/unchecked.png')
                            :
                                require('../img/checked.png')
                        }
                        onClick={() => onCheckBoxClick(idx, rowId, toSet)}
                    />
                : null
            }

            {
                //if notes type is checkbox then showing checkbox icon
                notesType === 2 ? 
                    <input
                        type="text"
                        className={
                            classNames(
                                "notesListDataFieldInput",
                                { checked: isActive === 2 },
                            )
                        }
                        placeholder="type text"
                        value={title}
                        onChange={(e) => onInputFieldChange(idx, rowId, e.target.value)}
                        // autoFocus={
                        //     rowId < 0 ?
                        //         true
                        //     : false
                        // }
                    />
                :
                    <textarea
                        type="text"
                        className="notesListDataFieldTextArea"
                        placeholder="type text"
                        value={title}
                        onChange={(e) => onInputFieldChange(idx, rowId, e.target.value)}
                        // autoFocus //to auto focus on creation of its new element
                    />
            }
           

            {
                //if notes type is checkbox then showing remove icon
                notesType === 2 ?
                    <img
                        alt="removeNotesListDataIcon"
                        className={"notesListDataFieldRemoveIcon"}
                        src={require('../img/cross2.png')}
                        onClick={() => onRemoveClick(rowId)}
                    />
                : null
            }
        </form>
    )
}