import React, { useRef, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { utils, SnackBar, LoadingAnimation, encryptionUtil } from "mngo-project-tools";
import { getUserNotes, createUserNote } from "../apis";
import { updateNoteInDb, removeNoteIdFromPendingPush } from "../utils";
import { LOGGED_USER_TOKEN_COOKIE_NAME, ENCRYPTION_KEY, DUMMY_NEW_NOTE, STORAGE_KEY, STORAGE_PENDING_PUSH_KEY } from '../constants';
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import Note from "../components/Note";

export default function Home() {
    const renderedRef = useRef(null);

    const [displayLoader, setDisplayLoader] = useState(true);
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    const [notesList, setNotesList] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState("");
    const [reRenderNoteComp, setReRenderNoteComp] = useState();

    useEffect(() => {
        try {
            //checking notesList in cache before making api call
            const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (cachedData.length) {
                setNotesList(cachedData);
                setDisplayLoader(false);

                setTimeout(() => { setActiveNote(cachedData[0].id) }, 100); //by default 1st note will be active from cached data
            }

            const userToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
            if (userToken) {
                (async function() {
                    const pendingPushNoteIds = Object.keys(JSON.parse(localStorage.getItem(STORAGE_PENDING_PUSH_KEY) || "{}"));
                    let c = 0;

                    if (pendingPushNoteIds.length) {
                        for (let i = 0; i < pendingPushNoteIds.length; i++) {
                            const thisNoteId = pendingPushNoteIds[i];
                            const thisNoteDetails = cachedData.find(item => item.id === thisNoteId);
                            if (thisNoteId && Object.keys(thisNoteDetails).length) {
                                const resp = await updateNoteInDb(thisNoteId, thisNoteDetails);
                                if (resp.statusCode === 200) {
                                    await removeNoteIdFromPendingPush(thisNoteId); //removing this note id from pending push storage
                                    c++;
                                }
                            }
                        }
                    }
                    if (c === pendingPushNoteIds.length) await fetchUserNotesList(userToken, cachedData);
                })();
            } else {
                //no one is logged //redirecting to landing page
                setDisplayLoader(false);
                setRedirectToLandingPage(true);
                return;
            }
        } catch {
            makeSnackBar("Invalid Request");
        }
    }, []);

    useEffect(() => {
        if (renderedRef.current) localStorage.setItem(STORAGE_KEY, JSON.stringify(notesList));
        renderedRef.current = true; //for the first time notesList state will be empty because it is intialized empty // so to ignore that case
    }, [notesList]); // for storing any change in notesList in cache/localStorage

    useEffect(() => {
        if (reRenderNoteComp === true) setReRenderNoteComp(false); //for re-rendering of Note component on change of activeNoteId
    }, [reRenderNoteComp]);

    function setActiveNote(noteId, rqstNotReRender) {
        setReRenderNoteComp(rqstNotReRender ? null : true)
        setActiveNoteId(noteId);
    }

    async function fetchUserNotesList(loggedUserToken, cachedData) {
        const response = await getUserNotes(loggedUserToken);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                if (data.notesList.length) {
                    //if cached data and api data is different then storing api data in state
                    if (JSON.stringify(cachedData) !== JSON.stringify(data.notesList)) setNotesList(data.notesList);

                    if (!cachedData.length) setTimeout(() => { setActiveNote(data.notesList[0].id) }, 100); //by default 1st note will be active from api data whenever there is no cached data
                }
            } else {
                makeSnackBar("Something went wrong");
            }
        } else {
            makeSnackBar(response.msg);
        }

        setDisplayLoader(false);
    }

    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }

    async function handleCreateNoteBtnClick() {
        const userToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        const userNoteId = encryptionUtil.md5Hash(userToken + "_note_" + (new Date().getTime()) + "_" + ENCRYPTION_KEY);

        setNotesList([DUMMY_NEW_NOTE(userNoteId), ...notesList]); //creating a new dummy note in state
        setActiveNote(userNoteId);
        const response = await createUserNote(userToken, userNoteId);
        if (response.statusCode === 200) { } else {
            makeSnackBar(response.msg);
        }
    }

    function handleNoteItemClick(item) {
        if (item.id) {
            setActiveNote(item.id);
        } else {
            makeSnackBar("Something went wrong");
        }
    }

    function handleDeleteNote(userNoteId) {
        setActiveNote("", true);
        setNotesList(prev => prev.filter(item => item.id !== userNoteId)); //removing deleted note from notesList state
    }

    function renderPageContent() {
        return (
            <>
                <NavBar />

                <div className="homeContainer">
                    <div className="noteItemContainer">
                        {
                            notesList.map((item, idx) =>
                                <NoteItem
                                    key={idx}
                                    isActive={activeNoteId === item.id}
                                    noteDetails={item}
                                    onClick={handleNoteItemClick}
                                />
                            )
                        }
                    </div>

                    <div className="noteContentContainer">
                        {
                            reRenderNoteComp === false ?
                                <Note
                                    userNoteId={activeNoteId}
                                    noteDetailsData={notesList.find(item => item.id === activeNoteId)}
                                    setNotesList={setNotesList}
                                    onDeleteNote={handleDeleteNote}
                                />
                                : null
                        }
                    </div>
                </div>

                <div className="createNewNoteBtn" onClick={handleCreateNoteBtnClick} >
                    <img alt="createNewNoteImg" src={require('../img/add1.png')} className="createNewNoteImg" />
                </div>
            </>
        )
    }

    return (
        <>
            {redirectToLandingPage ? <Redirect to="/" /> : null}

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={() => { setSnackBarVisible(false) }}
            />

            {displayLoader ? <LoadingAnimation loading /> : renderPageContent()}
        </>
    )
}