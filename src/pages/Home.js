import React, { useState, useEffect, Suspense, lazy } from "react";
import { Redirect } from "react-router-dom";
import { utils, SnackBar, LoadingAnimation, encryptionUtil } from "mngo-project-tools";
import { getUserNotes, createUserNote } from "../apis";
import { LOGGED_USER_TOKEN_COOKIE_NAME, ENCRYPTION_KEY } from '../constants';
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
const Note = lazy(() => import('../components/Note'));

export default function Home() {
    const [displayLoader, setDisplayLoader] = useState(true);
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    const [notesList, setNotesList] = useState([]);

    const [activeNoteId, setActiveNoteId] = useState("");
    const [loadingLatestNotesData, setLoadingLatestNotesData] = useState();

    useEffect(() => {
        try {
            const userToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
            if (userToken) fetchUserNotesList(userToken);
            else {
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
        if (loadingLatestNotesData === null)
            (async function() {
                setLoadingLatestNotesData(true);
                await fetchUserNotesList(utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME));
                setLoadingLatestNotesData(false);
            })(); //fetching the latest notes data on selecting any note
    }, [loadingLatestNotesData]);

    function setActiveNote(noteId) {
        setLoadingLatestNotesData(null);
        setActiveNoteId(noteId);
    }

    async function fetchUserNotesList(loggedUserToken) {
        const response = await getUserNotes(loggedUserToken);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                if (data.notesList.length) setNotesList(data.notesList);
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
        const response = await createUserNote(userToken, userNoteId);
        if (response.statusCode === 200) {
            setActiveNote(userNoteId)
        } else {
            makeSnackBar(response.msg);
        }
    }

    async function handleNoteItemClick(item) {
        if (item.id) {
            setActiveNote(item.id);
        } else {
            makeSnackBar("Something went wrong");
        }
    }

    //function to render page content
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
                            loadingLatestNotesData === true ? <LoadingAnimation loading /> :
                                loadingLatestNotesData === false ?
                                    <Suspense fallback={<LoadingAnimation loading />}>
                                        <Note
                                            userNoteId={activeNoteId}
                                            noteDetailsData={notesList.filter(item => item.id === activeNoteId)[0]}
                                        />
                                    </Suspense>
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