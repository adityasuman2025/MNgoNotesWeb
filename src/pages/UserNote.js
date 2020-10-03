import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { getListDataOfANote } from "../apis";
import { getDecryptedCookieValue } from '../utils';

function UserNotes() {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesListData, setNotesListData] = useState([])

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
            const mngoNotesSelectedNotesId = getDecryptedCookieValue("mngoNotesSelectedNotesId");
            if (mngoNotesLoggedUserId && mngoNotesSelectedNotesId) {
                //fetching user's notes list from api
                fetchNotesListData(mngoNotesSelectedNotesId);
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
   
    //function to handle when any note item is clicked on
    async function fetchNotesListData(notesId) {
        //sending rqst to api
        try {
            const response = await getListDataOfANote(notesId);
            if (response === "-10") {
                makeSnackBar("Internal Server Error");
            } else if (response === "-1") {
                makeSnackBar("Something went wrong");
            } else if (response === "0") {
                makeSnackBar("Failed to fetch notes list data");
            } else {
                const jsonResponse = JSON.parse(response);
                setNotesListData(jsonResponse);
                console.log(jsonResponse);
            }
        } catch {
            makeSnackBar("Something went wrong");
         }
 
         setDisplayLoader(false);
         //NotesListDataItem
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
                : null
                    // renderPageContent()
            }
        </>
    )
}

export default UserNotes;