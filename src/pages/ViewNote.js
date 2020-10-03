import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";
import NotesListDataItem from "../components/NotesListDataItem";
import ConfirmDialog from "../components/ConfirmDialog";

import { getListDataOfANote, deleteNotesListDataItem, deleteANote } from "../apis";
import { getDecryptedCookieValue } from '../utils';

export default function ViewNote(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmDialogText, setConfirmDialogText] = useState(false);
    
    const [deleteWhat, setDeleteWhat] = useState(null);
    const [notesListDataItemToDelete, setNotesListDataItemToDelete] = useState(null);

    const [notesType, setNotesType] = useState(null);
    const [notesData, setNotesData] = useState({title: "", hasChanged: false});
   
    const [notesListData, setNotesListData] = useState([]);
    const [tempNotesOldList, setTempNotesOldList] = useState([]);
    const [counter, setCounter] = useState(-1);

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
            } else if (response === "[]") {
                //if that note does not exist
                makeSnackBar("Invalid Request");
            } else {
                const jsonResponse = JSON.parse(response);
                setNotesListData(jsonResponse);
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

    //function to handle when checkbox icon is clicked
    function hanldeCheckBoxClick(idx, rowId, toSet) {
        rowId = parseInt(rowId);

        //marking its checkbox condition  	
		var oldJSON = notesListData[idx];
		oldJSON["is_active"] = toSet;
		oldJSON["hasChanged"] = true;

	//updating the textInputs according to the latest user input 
		setTempNotesOldList(notesListData);
		setTempNotesOldList((prevNotesOldList) => {
	      return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
	    });

	    //i don't know how its happening, but its really happening.
		//that textinput remains at the same place and we can alwo type there freely
    }

    //function to handle when remove icon is clicked
    function handleRemoveClick(rowId) {
        //if that textinput is newly added
        rowId = parseInt(rowId);
        if (rowId < 0) {
		    //removing that textInput
			setNotesListData((prevNotesOldList) => {
		        return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id !== rowId);
		    });
		} else {
            //if that textinput is old fetched from database
            setNotesListDataItemToDelete(rowId);
            setDeleteWhat("notesListDataItem");

            setConfirmDialogText("Are you sure to delete this item?");
			setIsConfirmDialogOpen(true);
		}		
    }

    //function to delete a notes list data  item
    async function deleteANotesListDataItem(rowId) {
        rowId = parseInt(rowId);
        if (rowId) {
            setDisplayLoader(true);

            //sending rqst to api
            try {
                const response = await deleteNotesListDataItem(rowId);
                if (response === "-10") {
                    makeSnackBar("Internal Server Error");
                } else if (response === "-1") {
                    makeSnackBar("Something went wrong");
                } else if (response === "0") {
                    makeSnackBar("Fail to delete notes list item");
                } else if (response === "1") {
                    // await window.location.reload();
                    //removing that notes list data item
                    setNotesListData((prevNotesOldList) =>  {
                        return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id != rowId); // !== is not working
                    });
                } else {
                    makeSnackBar("Unknown error");
                }
            } catch {
                makeSnackBar("Something went wrong");
            }

            setDisplayLoader(false);
        }
    }

    //function to close the confirm dialog box
    function handleConfirmDialogClose() {
        setIsConfirmDialogOpen(false);
    }

    //funtion to confirm the confirm dialog //when yes is pressed
    function handleConfirmDialogConfirm() {
        setIsConfirmDialogOpen(false);

        if (deleteWhat === "notesListDataItem") {
            deleteANotesListDataItem(notesListDataItemToDelete);
        } else if (deleteWhat === "note") {
            deleteNote();
        }
    }

    //function to handle when notes data list input field is changed
    function handleInputFieldChange(idx, rowId, value) {
        rowId = parseInt(rowId);

        var oldJSON = notesListData[idx];
		oldJSON["list_title"] = value;
		oldJSON["hasChanged"] = true;
	
	//updating the textInputs according to the latest user input 
		setTempNotesOldList(notesListData);
		setTempNotesOldList((prevNotesOldList) => {
	        return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
	    });
	    //i don't know how its happening, but its really happening.
		//that textinput remains at the same place and we can alwo type there freely
    }

    //function to handle when delete note btn is pressed
    function handleDeleteNoteClick() {
        setDeleteWhat("note");

        setConfirmDialogText("Are you sure to delete " + notesData.title + "?");
        setIsConfirmDialogOpen(true);
    }

    //function to delete a note
    async function deleteNote() {
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        const mngoNotesSelectedNotesId = getDecryptedCookieValue("mngoNotesSelectedNotesId");
        if (mngoNotesLoggedUserId && mngoNotesSelectedNotesId) {
            setDisplayLoader(true);

            //sending rqst to api
            try {
                const response = await deleteANote(mngoNotesLoggedUserId, mngoNotesSelectedNotesId);
                if (response === "-10") {
                    makeSnackBar("Internal Server Error");
                } else if (response === "-1") {
                    makeSnackBar("Something went wrong");
                } else if (response === "-2") {
                    makeSnackBar("Fail to get updated data");
                } else if (response === "0") {
                    makeSnackBar("Fail to delete note");
                } else {
                    props.history.goBack(); //going back to user's home page
                }
            } catch {
                makeSnackBar("Something went wrong");
            }

            setDisplayLoader(false);
        }
    }

    //function to handle when save btn is clicked on
    function handleSaveNoteClick() {
        console.log("saved");
    }

    //function to handle when add item btn is clicked on
	function handleAddBtnClick(idx) {
        idx = parseInt(idx);

	    //creating a new empty json object
		let emptyJSON = {};
		emptyJSON["id"] = counter;
		emptyJSON["position"] = "";
		emptyJSON["list_title"] = "";
		emptyJSON["type"] = notesType;
		emptyJSON["is_active"] = 1;
		emptyJSON["hasChanged"] = true;

	    //storing the noteslist	data in a temp array
        let tempNotesList = [...notesListData];
        let len = Object.keys(tempNotesList).length;

		let newNotesList = [];

	    //if to be added at beginning
		if (idx === -1) {
            let nextPosition = tempNotesList[0]["position"];
			if (len === 0) {
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

			if(i === idx) {
                // inserting the new empty json at desired position
				if(i === len - 1) {
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
		
	    //updating the state
        setNotesListData([]);
		setNotesListData(newNotesList);

		setCounter(counter-1);
	}

    //function to hadle when enter is pressed in any input field
    function handleSubmitInputField(e, idx) {
        e.preventDefault();

        if (notesType === 2) {
            //if type is checkbox
			handleAddBtnClick(idx);
		}
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
                                onClick={handleSaveNoteClick}
                            />

                            <input
                                type="text"
                                className="notesInputBox"
                                placeholder= "Title"
                                value={notesData.title}
                                onChange={(e) => setNotesData( {title: e.target.value, hasChanged: true} )}
                            />
                        </div>

                        <img
                            alt="deleteNotesImg"
                            className="deleteNotesImg"
                            src={require('../img/delete.png')}
                            onClick={handleDeleteNoteClick}
                        />
                    </div>
                </div>
                <br />

                <div className="notesListContainer">
                    <div className="notesFormContainer" >
                        {
                            //if notes type is checkbox then displaying Add Item btn
                            notesType === 2 ?
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
                                        notesType={notesType}
                                        notesListData={item}
                                        onCheckBoxClick={hanldeCheckBoxClick}
                                        onRemoveClick={handleRemoveClick}
                                        onInputFieldChange={handleInputFieldChange}
                                        onSubmitInputField={handleSubmitInputField}
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

            <ConfirmDialog
                isDialogOpen={isConfirmDialogOpen}
                dialogText={confirmDialogText}
                onClose={handleConfirmDialogClose}
                onConfirm={handleConfirmDialogConfirm}
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