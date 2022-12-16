import React, { useEffect, useRef } from "react";
import { utils } from "mngo-project-toolss";

export default function NotesListDataItem({
    idx,
    notesType,
    positionToFocus,
    rowId,
    isActive,
    position,
    title = "",
    onCheckBoxClick,
    onRemoveClick,
    onInputFieldChange,
    onSubmitInputField,
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (positionToFocus === position) {
            inputRef.current && inputRef.current.focus();
        }
    }, [notesType, positionToFocus, position]);

    const toSet = isActive === 1 ? 2 : 1;

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
                        src={isActive === 1 ? require('../img/unchecked.png') : require('../img/checked.png')}
                        onClick={() => onCheckBoxClick(idx, rowId, toSet)}
                    />
                    : null
            }

            {
                //if notes type is checkbox then showing checkbox icon
                notesType === 2 ?
                    <input
                        ref={inputRef}
                        type="text"
                        className={utils.cx("notesListDataFieldInput", ...[isActive === 2 ? 'checked' : ''])}
                        placeholder="type text"
                        value={title}
                        onChange={(e) => onInputFieldChange(idx, rowId, e.target.value)}
                    />
                    :
                    <textarea
                        ref={inputRef}
                        type="text"
                        className="notesListDataFieldTextArea"
                        placeholder="type text"
                        value={title}
                        onChange={(e) => onInputFieldChange(idx, rowId, e.target.value)}
                    />
            }

            {
                //if notes type is checkbox then showing remove icon
                notesType === 2 ?
                    <img
                        alt="removeNotesListDataIcon"
                        className={"notesListDataFieldRemoveIcon"}
                        src={require('../img/cross2.png')}
                        onClick={() => onRemoveClick(idx, rowId)}
                    />
                    : null
            }
        </form>
    )
}