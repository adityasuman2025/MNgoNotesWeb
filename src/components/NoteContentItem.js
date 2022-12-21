import React, { useEffect, useRef } from "react";
import { utils } from "mngo-project-tools";
import { TYPE_TO_DO } from '../constants';

export default function NoteContentItem({
    idx,
    notesType,
    noteContent,
    isFocused,
    onCheckBoxClick,
    onRemoveClick,
    onInputFieldChange,
    onSubmitInputField,
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (isFocused === true) inputRef.current && inputRef.current.focus();

        if (notesType !== TYPE_TO_DO) adjustTextAreaHeight(inputRef.current, true);
    }, [isFocused]);

    useEffect(() => {
        if (notesType !== TYPE_TO_DO) adjustTextAreaHeight(inputRef.current, true);
    }, [notesType]);

    function adjustTextAreaHeight(e, isRef) {
        try {
            const element = (isRef === true ? e : e.target) || {};
            element.style.height = (element.scrollHeight) + "px";
        } catch { }
    }

    const { isChecked = false, text = "" } = noteContent || {};
    return (
        <form className="notesListDataFields" onSubmit={(e) => onSubmitInputField(e, idx)} >
            {
                //if notes type is checkbox then showing checkbox icon
                notesType === TYPE_TO_DO ?
                    <img alt="checkBoxIcon" className="notesListDataFieldCheckedIcon"
                        src={!isChecked ? require('../img/unchecked.png') : require('../img/checked.png')}
                        onClick={() => onCheckBoxClick(idx, !isChecked)}
                    />
                    : null
            }

            {
                //if notes type is checkbox then showing checkbox icon
                notesType === TYPE_TO_DO ?
                    <input
                        ref={inputRef}
                        type="text"
                        className={utils.cx("notesListDataFieldInput", ...[isChecked ? 'checked' : ''])}
                        placeholder="type text"
                        value={text}
                        onChange={(e) => onInputFieldChange(idx, e.target.value)}
                    />
                    :
                    <textarea
                        ref={inputRef}
                        type="text"
                        className="notesListDataFieldTextArea"
                        placeholder="type text"
                        value={text}
                        onChange={(e) => onInputFieldChange(idx, e.target.value)}
                        onKeyUp={adjustTextAreaHeight}
                    />
            }

            {
                //if notes type is checkbox then showing remove icon
                notesType === TYPE_TO_DO ?
                    <img alt="removeNotesListDataIcon" className={"notesListDataFieldRemoveIcon"} src={require('../img/cross2.png')}
                        onClick={() => onRemoveClick(idx)}
                    />
                    : null
            }
        </form>
    )
}