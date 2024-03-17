import React, { useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { TYPE_TO_DO, TINY_MCE_API_KEY } from '../constants';

let intervalRef = null;
/* eslint-disable react-hooks/exhaustive-deps */
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
    }, [isFocused]);

    useEffect(() => {
        clearInterval(intervalRef);
        checkAndRemoveToxNotification();

        if (notesType !== TYPE_TO_DO) {
            intervalRef = setInterval(() => {
                checkAndRemoveToxNotification();
            }, 100);
        }

        return () => clearInterval(intervalRef);
    }, [notesType]);

    function checkAndRemoveToxNotification() {
        const toxNotificationClass = document.getElementsByClassName('tox-silver-sink');
        const toxNotification = toxNotificationClass?.[0];
        if (toxNotification) {
            toxNotification.style.display = "none";
            clearInterval(intervalRef);
        }
    }

    const { isChecked = false, text = "" } = noteContent || {};
    return (
        <form className={notesType === TYPE_TO_DO ? "notesListDataFieldsToDos" : "notesListDataFields"} onSubmit={(e) => onSubmitInputField(e, idx)} >
            {
                (notesType === TYPE_TO_DO) ? ( //if notes type is checkbox then showing checkbox icon
                    <img alt="checkBoxIcon" className="notesListDataFieldCheckedIcon"
                        src={!isChecked ? require('../img/unchecked.webp') : require('../img/checked.webp')}
                        onClick={() => onCheckBoxClick(idx, !isChecked)}
                    />
                ) : null
            }

            {
                (notesType === TYPE_TO_DO) ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className={`notesListDataFieldInput ${isChecked ? 'checked' : ''}`}
                        placeholder="type text"
                        value={text}
                        onChange={(e) => onInputFieldChange(idx, e.target.value)}
                    />
                ) : (
                    <Editor
                        className="notesListDataFieldTextArea"
                        apiKey={TINY_MCE_API_KEY}
                        value={text}
                        init={{
                            resize: false,
                            menubar: false,
                            auto_focus: true,
                            width: '100%',
                            height: '100%',
                            selector: "textarea",
                            placeholder: "type text...",
                            toolbar: "",
                            plugins: 'autolink link',
                            link_default_protocol: 'https',
                            content_css: 'none', // Remove any default content styles
                            content_style: "body { line-height: 1.2; color: #d8d8d8; font-weight: 100; font-size: 14px; font-family: sans-serif; } p { margin: 0; } a { color: #d8d8d8;}",
                        }}
                        onEditorChange={(content) => onInputFieldChange(idx, content)}
                    />
                )
            }

            {
                //if notes type is checkbox then showing remove icon
                (notesType === TYPE_TO_DO) ? (
                    <img alt="removeNotesListDataIcon" className={"notesListDataFieldRemoveIcon"} src={require('../img/cross2.webp')}
                        onClick={() => onRemoveClick(idx)}
                    />
                ) : null
            }
        </form>
    )
}