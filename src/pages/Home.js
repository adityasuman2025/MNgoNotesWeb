import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { utils, SnackBar, LoadingAnimation } from "mngo-project-tools";
import { getUserNotes } from "../apis";
import { LOGGED_USER_TOKEN_COOKIE_NAME } from '../constants';

import NotesListItem from "../components/NotesListItem";
import NavBar from "../components/NavBar";

export default function Home(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesList, setNotesList] = useState([]);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
            if (mngoNotesLoggedUserToken) {
                //fetching user's notes list from api
                fetchUserNotesList(mngoNotesLoggedUserToken);
            } else {
                //no one is logged
                //redirecting to landing page
                setDisplayLoader(false);
                setRedirectToLandingPage(true);
                return;
            }
        } catch {
            makeSnackBar("Invalid Request");
        }
    }, []);

    //function to fetch user's notes list from api
    async function fetchUserNotesList(loggedUserToken) {
        //sending rqst to api
        const response = await getUserNotes(loggedUserToken);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                setNotesList(data);
            } else {
                makeSnackBar("Something went wrong");
            }
        } else {
            makeSnackBar(response.msg);
        }

        setDisplayLoader(false);
    }

    //function to make a snack-bar
    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }

    //function to close snack-bar
    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    //when Create New Note Button is clicked
    function hanldeCreateNewNoteBtnClick() {
        props.history.push("/create-note");
    }

    //function to handle when any note item is clicked on
    async function handleNotesListItemClick(item) {
        if (item.encrypted_notes_id) {
            const encrypted_notes_id = item.encrypted_notes_id;
            props.history.push("/view-note/" + encrypted_notes_id);
            return;
        } else {
            makeSnackBar("Something went wrong");
        }
    }

    //function to render page content
    function renderPageContent() {
        return (
            <>
                <NavBar />
                <br /><br />

                <div className="notesListContainer">
                    {
                        notesList.map(function(item, idx) {
                            return (
                                <NotesListItem
                                    key={idx}
                                    noteDetails={item}
                                    onClick={handleNotesListItemClick}
                                />
                            )
                        })
                    }
                </div>

                <div
                    className="createNewNoteBtn"
                    onClick={hanldeCreateNewNoteBtnClick}
                >
                    <img
                        alt="createNewNoteImg"
                        src={require('../img/add1.png')}
                        className="createNewNoteImg"
                    />
                </div>
            </>
        )
    }

    //component rendering
    return (
        <>
            {
                //redirecting to landing page
                redirectToLandingPage ? <Redirect to="/" /> : null
            }

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />


            {
                displayLoader ?
                    <LoadingAnimation loading={displayLoader} />
                    :
                    renderPageContent()
            }
        </>
    )
}