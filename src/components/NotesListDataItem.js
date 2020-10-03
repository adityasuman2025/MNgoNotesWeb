import React from "react";

export default function NotesListDataItem({
    notesType,
    notesListData,
    onClick,
}) {
    const rowId = notesListData.id;
    const isActive = parseInt(notesListData.is_active);
    const title = notesListData.list_title.toString();
    var toSet = isActive === 1 ? 2: 1;

    //function to hanlde when note item is clicked on
    function handleNoteItemClick() {
        onClick(notesListData);
    }

    //component rendering
    return (
        <div
            className="notesListDataFields"
        >
            {
            //checkbox icon
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
                        // onPress={() => checkboxClickHandler(idx, rowId, toSet)}
                    />
                : null
            }

            <input
                type="text"
                className="notesListDataFieldInput"
                value={title}
                // onChangeText={(val) => updateHandlerOfNotesOldList(idx, row_id, val)}
                // onSubmitEditing={() => submitEditList(idx)}
                // autoFocus //to auto focus on creation of its new element
            />

            {
                //if notes type is checkbox then showing remove icon
                notesType == 2 ?
                    <img
                        alt="removeNotesListDataIcon"
                        className={"notesListDataFieldRemoveIcon"}
                        src={require('../img/cross2.png')}
                        // onPress={() => removeOldList(row_id)}
                    />
                : null
            }
        </div>
    )
}