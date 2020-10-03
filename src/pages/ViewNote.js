import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";
import NotesListDataItem from "../components/NotesListDataItem";

import { getListDataOfANote } from "../apis";
import { getDecryptedCookieValue } from '../utils';

export default function ViewNote() {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesType, setNotesType] = useState(null);
    const [notesData, setNotesData] = useState({title: "", hasChanged: false});
    const [notesListData, setNotesListData] = useState([]);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
            const mngoNotesSelectedNotesId = getDecryptedCookieValue("mngoNotesSelectedNotesId");
            const mngoNotesSelectedNotesTitle = getDecryptedCookieValue("mngoNotesSelectedNotesTitle");
            const mngoNotesSelectedNotesType = getDecryptedCookieValue("mngoNotesSelectedNotesType");
            if (mngoNotesLoggedUserId && mngoNotesSelectedNotesId && mngoNotesSelectedNotesTitle && mngoNotesSelectedNotesType) {
                setNotesData({
                    "title": mngoNotesSelectedNotesTitle,
                    "hasChanged": false,
                });
                setNotesType(parseInt(mngoNotesSelectedNotesType));

                //fetching user's notes list data from api
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
            <div className="notesListContainer">
                <div className="notesHeader" >
                    <div className="notesTitleContainer">
                        <img
                            alt="saveNoteImg"
                            className="saveNoteImg"
                            src={require('../img/save2.png')}
                        />

                        <div className="titleFormContainer">
                            <input
                                type="text"
                                className="notesInputBox"
                                placeholder= "Title"
                                value={notesData.title}
                                onChange={(e) => setNotesData( {title: e.target.value, hasChanged: true} )}
                            />
                        </div>
                    </div>

                    <img
                        alt="deleteNotesImg"
                        className="deleteNotesImg"
                        src={require('../img/delete.png')}
                    />
                </div>

                <div className="notesFormContainer" >
                    {
                        //if notes type is checkbox then displaying Add Item btn
                        notesType === 2 ?
                            <div
                                className="addNotesListDataItemBtn"
                                // onPress={() => handleAddBtnClick(-1) }
                            >
                                <img
                                    alt="addItemIcon"
                                    className="addNotesListDataItemBtnIcon"
                                    src={require('../img/add1.png')}
                                />
                                <span className="addNotesListDataItemBtnText" > Add Item</span>
                            </div>
                        : null
                    }

                    {
                        //rendering notes data list items
                        notesListData.map( function(item, idx) {
                            return (
                                <NotesListDataItem
                                    key={idx}
                                    notesType={notesType}
                                    notesListData={item}
                                />
                            )
                        })
                    }
                </div>
            </div>
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