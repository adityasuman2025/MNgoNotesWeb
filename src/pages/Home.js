import React, { useRef, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import WithAuth from "mngo-project-tools/hocs/WithAuth";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import Loader from "mngo-project-tools/comps/Loader";
import { getCookieValue } from "mngo-project-tools/utils";
import { getCacheRegular, setCacheRegular } from "mngo-project-tools/cachingUtil";
import { getUserNotes, createUserNote, updateUserNote } from "../apis";
import { removeNoteIdFromPendingPush } from "../utils";
import { LOGGED_USER_TOKEN_COOKIE_NAME, STORAGE_KEY, STORAGE_PENDING_PUSH_KEY } from '../constants';
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import Note from "../components/Note";

function Home() {
    const renderedRef = useRef(null);

    const [displayLoader, setDisplayLoader] = useState(true);
    const [snackBarData, setSnackBarData] = useState({ visisible: false, msg: "", type: "" });

    const [notesList, setNotesList] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState("");
    const [reRenderNoteComp, setReRenderNoteComp] = useState();

    useEffect(() => {
        try {
            //checking notesList in cache before making api call
            const cachedData = getCacheRegular(STORAGE_KEY);
            if (cachedData.length) {
                setNotesList(cachedData);
                setDisplayLoader(false);

                setTimeout(() => { setActiveNote(cachedData[0].id) }, 100); //by default 1st note will be active from cached data
            }

            const userToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);

            (async function() {
                const pendingPushNoteIds = Object.keys(getCacheRegular(STORAGE_PENDING_PUSH_KEY));
                let c = 0;

                if (pendingPushNoteIds.length) {
                    for (let i = 0; i < pendingPushNoteIds.length; i++) {
                        const thisNoteId = pendingPushNoteIds[i];
                        const thisNoteDetails = cachedData.find(item => item.id === thisNoteId);
                        if (thisNoteId && Object.keys(thisNoteDetails).length) {
                            try {
                                await updateUserNote(userToken, thisNoteId, thisNoteDetails);
                                await removeNoteIdFromPendingPush(thisNoteId); //removing this note id from pending push storage
                                c++;
                            } catch (e) { }
                        }
                    }
                }
                if (c === pendingPushNoteIds.length) await fetchUserNotesList(userToken, cachedData);
            })();
        } catch {
            makeSnackBar("Invalid Request");
        }
    }, []);

    useEffect(() => {
        if (renderedRef.current) setCacheRegular(STORAGE_KEY, notesList);
        renderedRef.current = true; //for the first time notesList state will be empty because it is intialized empty // so to ignore that case
    }, [notesList]); // for storing any change in notesList in cache

    useEffect(() => {
        if (reRenderNoteComp === true) setReRenderNoteComp(false); //for re-rendering of Note component on change of activeNoteId
    }, [reRenderNoteComp]);

    function setActiveNote(noteId, rqstNotReRender) {
        setReRenderNoteComp(rqstNotReRender ? null : true)
        setActiveNoteId(noteId);
    }

    async function fetchUserNotesList(loggedUserToken, cachedData) {
        try {
            const { data = {} } = await getUserNotes(loggedUserToken);

            if (data) {
                if (data.notesList.length) {
                    //if cached data and api data is different then storing api data in state
                    if (JSON.stringify(cachedData) !== JSON.stringify(data.notesList)) setNotesList(data.notesList);

                    if (!cachedData.length) setTimeout(() => { setActiveNote(data.notesList[0].id) }, 100); //by default 1st note will be active from api data whenever there is no cached data
                }
            } else {
                makeSnackBar("Something went wrong");
            }
        } catch (e) {
            makeSnackBar(e.message);
        }

        setDisplayLoader(false);
    }

    function makeSnackBar(msg, type = "error") {
        setSnackBarData({ visisible: true, msg, type });
    }

    async function handleCreateNoteBtnClick() {
        const userToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);

        try {
            const { data: { userNoteId } = {} } = await createUserNote(userToken);
            if (userNoteId) {
                setNotesList([{
                    title: "", type: 1, id: userNoteId,
                    ts: new Date().getTime(),
                    noteContentItems: [{ text: "" }]
                }, ...notesList]); // creating a new dummy note in state
                setActiveNote(userNoteId);
            }
        } catch (e) {
            makeSnackBar(e.message);
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

    return (
        <>
            <NavBar />

            <div className="homeContainer">
                <div className="noteItemContainer">
                    <Loader loading={displayLoader} styles={{ loaderClassName: "loader" }} />

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
                <img alt="createNewNoteImg" src={require('../img/add1.webp')} className="createNewNoteImg" />
            </div>

            <SnackBar
                open={snackBarData.visisible}
                msg={snackBarData.msg}
                type={snackBarData.type}
                onClose={() => setSnackBarData({ visisible: false })}
            />
        </>
    )
}


function redirectToLogin() {
    // window.location.href = "/login"; // windiw.location.href was not working in chrome extension

    return <Redirect to="/login" />;
}

export default WithAuth(Home, LOGGED_USER_TOKEN_COOKIE_NAME, redirectToLogin);