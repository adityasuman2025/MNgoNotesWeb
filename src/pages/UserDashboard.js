import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import NotesListItem from "../components/NotesListItem";
import NavBar from "../components/NavBar";
import SnackBar from "../components/SnackBar";

import { getUserNotes } from "../apis";
import { getDecryptedCookieValue } from '../utils';

function UserDashboard(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesList, setNotesList] = useState([])

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (!mngoNotesLoggedUserId) {
            //no one is logged
            //redirecting to landing page
            setDisplayLoader(false);
            setRedirectToLandingPage(true);
        } else {
            //fetching user's notes list from api
            fetchUserNotesList(mngoNotesLoggedUserId);
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

    //function to render page content
    function renderPageContent() {
        return (
            <>
                <SnackBar
                    open={snackBarVisible}
                    msg={snackBarMsg}
                    type={snackBarType}
                    handleClose={handleSnackBarClose}
                />

                <NavBar />
                <br /><br />

                <div className="notesListContainer">
                {
                    notesList.map(function(item, idx) {
                        return(
                            <NotesListItem
                                key={idx}
                                title={item.title}
                                type={item.type}
                                // onClick={handleNotesListItemClick}
                            />
                        )
                    })
                }
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

            {
                displayLoader ?
                    <LoadingAnimation loading={displayLoader}/>
                :
                    renderPageContent()
            }
        </>
    )
}

export default UserDashboard;