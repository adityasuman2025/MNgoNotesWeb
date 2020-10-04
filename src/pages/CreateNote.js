import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import NotesListDataItem from "../components/NotesListDataItem";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { getDecryptedCookieValue } from '../utils';

export default function CreateNote() {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesData, setNotesData] = useState({title: "", type: 1});
    const [notesListData, setNotesListData] = useState([{position: 100000, title: "", is_active: 1}]);
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

    //function to handle when add item is clicked on
    //on clicking on add btn
	function handleAddBtnClick(idx) {
	    // creating a new empty json object
		let emptyJSON = {};
		emptyJSON["position"] = "";
		emptyJSON["title"] = "";
		emptyJSON["is_active"] = 1;

	    //storing the noteslist	data in a temp array
        let tempNotesList = [...notesListData];
        let len = Object.keys(tempNotesList).length;

        let newNotesList = [];

	    //if to be added at beginning
		if (idx === -1) {
            let nextPosition = tempNotesList[0]["position"];
			if(len === 0) {
                //if list is empty
                nextPosition = 100000;
            }

			let newPosition = parseInt((parseInt(0) + parseInt(nextPosition))/2);

			emptyJSON["position"] = newPosition;
            newNotesList.push(emptyJSON);
		}

	    //looping through the temp notes list to insert new empty json at desired position
		for (let i = 0; i < len; i++) {
			let thisArray = tempNotesList[i];
			newNotesList.push(thisArray);

			if (i === idx) {
                // inserting the new empty json at desired position
				if (i === len - 1) {
                    //if last element
					let newPosition = parseInt(parseInt(thisArray["position"]) + parseInt(100000));
					emptyJSON["position"] = newPosition;
				} else {
                    //if any between elements
					let thisPosition = thisArray["position"];
					let nextPosition = tempNotesList[i+1]["position"];

					let newPosition = parseInt((parseInt(thisPosition) + parseInt(nextPosition))/2);
					emptyJSON["position"] = newPosition;
				}
				newNotesList.push(emptyJSON);
			}
		}

	    // updating the state
		setNotesListData([]);
		setNotesListData(newNotesList);
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
                                autoCapitalize="words"
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
                                    onClick={() => handleAddBtnClick(-1)}
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
                                        page={"CreateNote"}
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