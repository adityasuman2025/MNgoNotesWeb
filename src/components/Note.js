import React, { useRef, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Hotkeys from 'react-hot-keys';
import { getCookieValue } from "mngo-project-tools/utils";
import { getCacheRegular, setCacheRegular } from "mngo-project-tools/cachingUtil";
import ConfirmDialog from "mngo-project-tools/comps/ConfirmDialog";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import LoadingAnimation from "mngo-project-tools/comps/LoadingAnimation";
import { deleteUserNote, updateUserNote } from "../apis";
import { removeNoteIdFromPendingPush } from "../utils";
import { LOGGED_USER_TOKEN_COOKIE_NAME, TYPE_TO_DO, STORAGE_PENDING_PUSH_KEY } from '../constants';
import NoteContentItem from "../components/NoteContentItem";

let timer;
/* eslint-disable react-hooks/exhaustive-deps */
export default function ViewNote({
    userNoteId,
    noteDetailsData,
    setNotesList,
    onDeleteNote,
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
    const [focusedNoteContentItemIdx, setFocusedNoteContentItemIdx] = useState(0); // by default 1st note content item will be focused

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
            if (renderedRef.current) {
                timer = setTimeout(() => {
                    //updating notesList state in the parent component
                    setNotesList(prev => prev.map(item => item.id === userNoteId ? noteDetails : item));

                    saveNoteInDb(noteDetails);
                }, 800);
            }

            renderedRef.current = true; // to prevent call of save api when component is rendered for the first time
        }
    }, [noteDetails]); //saving notes after 1000s of doing any change in noteDetails // like debounce

    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }


    /*-----note content item stuffs--------*/
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
    /*-----note content item stuffs--------*/


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

        try {
            const userToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
            await deleteUserNote(userToken, userNoteId);
            onDeleteNote(userNoteId);

            return;
        } catch (e) {
            makeSnackBar(e.message);
        }

        setDisplayLoader(false);
    }
    /*------delete note stuffs-------*/

    async function saveNoteInDb(noteDetails) {
        //pushing this note id in pending push storage
        setCacheRegular(STORAGE_PENDING_PUSH_KEY, { ...getCacheRegular(STORAGE_PENDING_PUSH_KEY), [userNoteId]: 1 });

        try {
            await updateUserNote(getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME), userNoteId, noteDetails);
            removeNoteIdFromPendingPush(userNoteId); //removing this note id from pending push storage
        } catch (e) { }
    }
    /*------save note stuffs-------*/


    function renderPageContent() {
        return (
            <>
                <div className="noteHeader">
                    <img alt="isCheckBoxIcon" className="isCheckBoxIcon"
                        src={noteDetails.type === TYPE_TO_DO ? require('../img/checked.webp') : require('../img/unchecked.webp')}
                        onClick={() => setNoteDetails({ ...noteDetails, type: noteDetails.type === TYPE_TO_DO ? 1 : TYPE_TO_DO })}
                    />
                    <input
                        type="text"
                        className="noteTitleInput"
                        placeholder="Title"
                        autoCapitalize="words"
                        value={noteDetails.title}
                        onChange={(e) => setNoteDetails({ ...noteDetails, title: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFocusedNoteContentItemIdx(-1);
                                setTimeout(() => { setFocusedNoteContentItemIdx(0) }, 0)
                            }
                        }} //to switch to first not content item on enter press in note title
                    />

                    <img alt="deleteImg" className="deleteImg" src={require('../img/delete.webp')} onClick={handleDeleteNoteClick} />
                </div>

                <div className="noteContentList" >
                    {
                        noteDetails.type === TYPE_TO_DO ?
                            <div className="addItemBtn" onClick={(e) => handleNoteContentItemSubmit(e, -1)} >
                                <img alt="addItemIcon" src={require('../img/add1.webp')} />
                                <span>Add Item</span>
                            </div>
                            : null
                    }

                    {
                        (noteDetails.noteContentItems || []).map((item, idx) => {
                            if (noteDetails.type !== TYPE_TO_DO && idx > 0) return <></> //if notes type is text then showing only 1st item
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
            onKeyDown={(keyName, e, handle) => { e.preventDefault(); makeSnackBar("Saved", "success"); }}
            filter={e => true} //to enable shortcut key inside input, textarea and select too
        >
            {redirectToLandingPage ? <Redirect to="/" /> : null}

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                onClose={() => { setSnackBarVisible(false) }}
            />

            <ConfirmDialog
                open={isConfirmDialogOpen}
                title={confirmDialogText}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDialogConfirm}
            />

            {displayLoader ? <LoadingAnimation loading /> : renderPageContent()}
        </Hotkeys>
    )
}