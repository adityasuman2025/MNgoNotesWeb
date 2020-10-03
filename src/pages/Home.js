import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import NotesListItem from "../components/NotesListItem";
import NavBar from "../components/NavBar";
import SnackBar from "../components/SnackBar";

import { getUserNotes } from "../apis";
import { getDecryptedCookieValue, makeEncryptedCookie } from '../utils';

export default function Home(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesList, setNotesList] = useState([])

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
            if (mngoNotesLoggedUserId) {
                //fetching user's notes list from api
                fetchUserNotesList(mngoNotesLoggedUserId);
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
    async function fetchUserNotesList(userId) {
        //sending rqst to api
        try {
            const response = await getUserNotes(userId);
            if (response === "-10") {
                makeSnackBar("Internal Server Error");
            } else if (response === "-1") {
                makeSnackBar("Something went wrong");
            } else if (response === "0") {
                makeSnackBar("Failed to fetch user's notes list");
            } else {
                const jsonResponse = JSON.parse(response);
                setNotesList(jsonResponse);
            }
        } catch {
            makeSnackBar("Something went wrong");
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
        if (item.notes_id) {
            //creating cookie of the notes_id of the selected note and redirecting to the /notes page
            const notesId = item.notes_id;
            const mngoNotesSelectedNotesIdCookie = await makeEncryptedCookie("mngoNotesSelectedNotesId", notesId);
            if (mngoNotesSelectedNotesIdCookie) {
                props.history.push("/view-note");
                return;
            } else {
                makeSnackBar("Something went wrong");
            }
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
                            return(
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
                    <LoadingAnimation loading={displayLoader}/>
                :
                    renderPageContent()
            }
        </>
    )
}