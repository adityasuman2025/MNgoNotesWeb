import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import NotesListDataItem from "../components/NotesListDataItem";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { getDecryptedCookieValue, makeEncryptedCookie } from '../utils';

export default function CreateNote() {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesData, setNotesData] = useState({title: "", type: 1});
    const [notesListData, setNotesListData] = useState([{position: 100000, list_title: "", is_active: 1}]);
    const [tempNotesListData, setTempNotesListData] = useState([]);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
            if (mngoNotesLoggedUserId) {
                setDisplayLoader(false);
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
				<div className="notesHeaderContainer">
                    <div className="notesHeader" >
                        <div className="notesTitleContainer">
                            <img
                                alt="saveNoteImg"
                                className="saveNoteImg"
                                src={require('../img/save2.png')}
                                // onClick={handleSaveNoteClick}
                            />

                            <input
                                type="text"
                                className="notesInputBox"
                                placeholder= "Title"
                                value={notesData.title}
                                onChange={(e) => setNotesData({
                                    title: e.target.value,
                                    type: notesData.type
                                })}
                            />
                        </div>
                    </div>
                </div>
                <br />

                <div className="notesListContainer">
                    <div className="notesFormContainer" >
                        <select
                            className="pickerBox"
                            onChange={(e) => setNotesData({
                                title: notesData.title,
                                type: parseInt(e.target.value),
                            })}
                        >
                            <option value="1">text</option>
                            <option value="2">checkbox</option>
                        </select>

                        {
                            //if notes type is checkbox then displaying Add Item btn
                            notesData.type === 2 ?
                                <div
                                    className="addNotesListDataItemBtn"
                                    // onClick={() => handleAddBtnClick(-1)}
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
                                        idx={idx}
                                        notesType={notesData.type}
                                        notesListData={item}
                                        // onCheckBoxClick={hanldeCheckBoxClick}
                                        // onRemoveClick={handleRemoveClick}
                                        // onInputFieldChange={handleInputFieldChange}
                                        // onSubmitInputField={handleSubmitInputField}
                                    />
                                )
                            })
                        }
                    </div>
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