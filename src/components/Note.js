import React, { useRef, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Hotkeys from 'react-hot-keys';
import { utils, SnackBar, LoadingAnimation, ConfirmDialog, encryptionUtil } from "mngo-project-tools";
import { deleteUserNote, updateUserNote } from "../apis";
import { ENCRYPTION_KEY, LOGGED_USER_TOKEN_COOKIE_NAME, TYPE_TO_DO } from '../constants';
import NoteContentItem from "../components/NoteContentItem";

let timer;

export default function ViewNote({
    userNoteId,
    noteDetailsData
}) {
    const renderedRef = useRef(null);

    const [displayLoader, setDisplayLoader] = useState(true);
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmDialogText, setConfirmDialogText] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    const [noteDetails, setNoteDetails] = useState({ title: "", type: 0, noteContentItems: [] });
    const [focusedNoteContentItemIdx, setFocusedNoteContentItemIdx] = useState(-1);

    useEffect(() => {
        try {
            if (noteDetailsData) {
                setNoteDetails(noteDetailsData);
            } else {
                setRedirectToLandingPage(true);
                return;
            }
            setDisplayLoader(false);
        } catch {
            makeSnackBar("Invalid Request");
        }
    }, [noteDetailsData]);

    useEffect(() => {
        clearTimeout(timer);

        if (noteDetails.type) {
            if (renderedRef.current) timer = setTimeout(() => { saveNoteInDb(noteDetails) }, 800);

            renderedRef.current = true; // to prevent call of save api when component is rendered for the first time
        }
    }, [noteDetails]); //saving notes after 1000s of doing any change in noteDetails // like debounce

    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }


    /*-----note data item stuffs--------*/
    function handleNoteContentItemCheckBoxClick(idx, toSet) {
        setNoteDetails({
            ...noteDetails,
            noteContentItems: noteDetails.noteContentItems.map((item, i) => {
                if (i === idx) item.isChecked = toSet;
                return item;
            })
        });
    }

    function handleNoteContentItemRemoveClick(idx) {
        setNoteDetails({ ...noteDetails, noteContentItems: noteDetails.noteContentItems.filter((_, i) => i !== idx) });
    }

    function handleNoteContentItemChange(idx, value) {
        setNoteDetails({
            ...noteDetails,
            noteContentItems: noteDetails.noteContentItems.map((item, i) => {
                if (i === idx) item.text = value;
                return item;
            })
        });
    }

    function handleNoteContentItemSubmit(e, idx) {
        e.preventDefault();

        const { noteContentItems = [] } = noteDetails || {};
        if (idx === -1) {
            setNoteDetails({ ...noteDetails, noteContentItems: [{}, ...noteContentItems] });
            setFocusedNoteContentItemIdx(0);
            return;
        } else if (idx + 1 < noteContentItems.length) {
            setNoteDetails({
                ...noteDetails,
                noteContentItems: [...noteContentItems.slice(0, idx + 1), {}, ...noteContentItems.slice(idx + 1, noteContentItems.length)]
            }); // if clicking enter on any b/w items then creating a new row item in between prev and next
        } else if (idx + 1 >= noteContentItems.length) {
            setNoteDetails({ ...noteDetails, noteContentItems: [...noteContentItems, {}] });
        }

        setFocusedNoteContentItemIdx(idx + 1);
    }
    /*-----note data item stuffs--------*/


    /*------delete note stuffs-------*/
    function handleDeleteNoteClick() {
        setConfirmDialogText("Are you sure to delete " + noteDetails.title + "?");
        setIsConfirmDialogOpen(true);
    }

    function handleConfirmDialogConfirm() {
        setIsConfirmDialogOpen(false);
        deleteNote();
    }

    async function deleteNote() {
        setDisplayLoader(true);

        const userToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        const response = await deleteUserNote(userToken, userNoteId);
        if (response.statusCode === 200) {
            setRedirectToLandingPage(true);
            return;
        } else {
            makeSnackBar(response.msg);
        }

        setDisplayLoader(false);
    }
    /*------delete note stuffs-------*/


    /*------save note stuffs-------*/
    async function handleSaveNoteClick(action) {
        setDisplayLoader(true);
        makeSnackBar("Saving...", "info");

        if (!displayLoader) {
            const response = await saveNoteInDb();
            if (response.statusCode === 200) {
                makeSnackBar("Saved", "success");
                setTimeout(function() {
                    if (action === "shortcutKey") setDisplayLoader(false); //checking if saving using shortcut key
                    else {
                        setRedirectToLandingPage(true);
                        return;
                    }
                }, 500);
            } else {
                makeSnackBar(response.msg);
                setDisplayLoader(false);
            }
        }
    }

    async function saveNoteInDb(noteDetails) {
        const userToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);

        const { title = "", type = 1, noteContentItems = [] } = noteDetails || {};
        return await updateUserNote(userToken, userNoteId, {
            type, id: userNoteId,
            title: encryptionUtil.encryptText(title, ENCRYPTION_KEY),
            noteContentItems: noteContentItems.map((item, idx) => ({
                ...item, id: userNoteId + "_content_" + idx,
                text: encryptionUtil.encryptText(item.text, ENCRYPTION_KEY),
            }))
        });
    }
    /*------save note stuffs-------*/


    function renderPageContent() {
        return (
            <>
                <div className="noteHeaderContainer">
                    <div className="noteHeader">
                        <input
                            type="text"
                            className="noteTitleInput"
                            placeholder="Title"
                            autoCapitalize="words"
                            value={noteDetails.title}
                            onChange={(e) => setNoteDetails({ ...noteDetails, title: e.target.value })}
                        />

                        <img alt="deleteImg" className="deleteImg" src={require('../img/delete.png')} onClick={handleDeleteNoteClick} />
                    </div>
                    <select
                        className="pickerBox"
                        value={noteDetails.type}
                        onChange={(e) => setNoteDetails({ ...noteDetails, type: parseInt(e.target.value) })}
                    >
                        <option value="1">text</option>
                        <option value="2">checkbox</option>
                    </select>
                </div>

                <div className="noteContentList" >
                    {
                        noteDetails.type === TYPE_TO_DO ?
                            <div className="addItemBtn" onClick={(e) => handleNoteContentItemSubmit(e, -1)} >
                                <img alt="addItemIcon" src={require('../img/add1.png')} />
                                <span>Add Item</span>
                            </div>
                            : null
                    }

                    {
                        (noteDetails.noteContentItems || []).map((item, idx) => {
                            if (noteDetails.type !== TYPE_TO_DO && idx > 0) return //if notes type is text then showing only 1st item
                            return (
                                <NoteContentItem
                                    key={item.id + "_" + idx}
                                    idx={idx}
                                    notesType={noteDetails.type}
                                    noteContent={item}
                                    isFocused={focusedNoteContentItemIdx === idx}
                                    onCheckBoxClick={handleNoteContentItemCheckBoxClick}
                                    onRemoveClick={handleNoteContentItemRemoveClick}
                                    onInputFieldChange={handleNoteContentItemChange}
                                    onSubmitInputField={handleNoteContentItemSubmit}
                                />
                            )
                        })
                    }
                </div>
            </>
        )
    }

    return (
        <Hotkeys
            keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
            onKeyDown={(keyName, e, handle) => { e.preventDefault(); handleSaveNoteClick("shortcutKey") }}
            filter={e => true} //to enable shortcut key inside input, textarea and select too
        >
            {redirectToLandingPage ? <Redirect to="/" /> : null}

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={() => { setSnackBarVisible(false) }}
            />

            <ConfirmDialog
                isDialogOpen={isConfirmDialogOpen}
                dialogText={confirmDialogText}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDialogConfirm}
            />

            {displayLoader ? <LoadingAnimation loading /> : renderPageContent()}
        </Hotkeys>
    )
}