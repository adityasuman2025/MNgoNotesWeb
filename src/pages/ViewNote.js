import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Hotkeys from 'react-hot-keys';
import { utils, SnackBar, LoadingAnimation } from "mngo-project-tools";
import { getListDataOfANote, deleteNotesListDataItem, deleteANote, updateNotesListData } from "../apis";
import { LOGGED_USER_TOKEN_COOKIE_NAME } from '../constants';

import NotesListDataItem from "../components/NotesListDataItem";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ViewNote({
    match: {
        params: {
            encrypted_notes_id: encryptedNotesId,
        } = {}
    } = {}
}) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);
    const [redirectToUserHome, setRedirectToUserHome] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmDialogText, setConfirmDialogText] = useState(false);

    const [deleteWhat, setDeleteWhat] = useState(null);
    const [notesListDataItemToDelete, setNotesListDataItemToDelete] = useState(null);

    const [notesType, setNotesType] = useState(null);
    const [notesData, setNotesData] = useState({ title: "", hasChanged: false });

    const [notesListData, setNotesListData] = useState([]);
    const [tempNotesOldList, setTempNotesOldList] = useState([]);
    const [counter, setCounter] = useState(-1);

    const [inputFieldPositionToFocusOn, setInputFieldPositionToFocusOn] = useState(-1);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //handling back btn press
    const [isBackButtonClicked, setBackbuttonPress] = useState(false)

    // useEffect(() => {
    //     window.history.pushState(null, null, window.location.pathname);
    //     window.addEventListener('popstate', onBackButtonEvent);
    //     return () => {
    //         window.removeEventListener('popstate', onBackButtonEvent);
    //     }
    // }, []);

    // async function onBackButtonEvent(e) {
    //     e.preventDefault();

    //     //checking is some change has been done in notes data or not
    //     const hasChanged = await checkIfNotesDataIsChanged();
    //     console.log(hasChanged);
    //     if (hasChanged === false) {
    //         console.log("no change");
    //         //no any change has occured
    //         //redirecting back to user's home page
    //         props.history.goBack();
    //     } else {
    //         //some changes has occured
    //         console.log("some changes has occured");

    //         if (!isBackButtonClicked) {
    //             //asking user to save his changes
    //             setDeleteWhat("backPressHandler");

    //             setConfirmDialogText("Do you want to save your changes?");
    //             setIsConfirmDialogOpen(true);
    //         }
    //     }
    // }

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserToken = utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
            if (encryptedNotesId && mngoNotesLoggedUserToken) {
                //fetching user's notes list data from api
                fetchNotesListData(mngoNotesLoggedUserToken, encryptedNotesId);
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
    async function fetchNotesListData(loggedUserToken, encryptedNotesId) {
        //sending rqst to api
        const response = await getListDataOfANote(loggedUserToken, encryptedNotesId);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                const title = data.title;
                const type = data.type;
                const notesList = data.notes_list || [];
                setNotesData({
                    "title": title,
                    "hasChanged": false,
                });
                setNotesType(parseInt(type));
                setNotesListData(notesList);
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
        let newPosition;
        //if to be added at beginning
        if (idx === -1) {
            let nextPosition = 100000; //if list is empty
            if (len !== 0) {
                //if list is not empty
                nextPosition = tempNotesList[0]["position"];
            }

            newPosition = parseInt((parseInt(0) + parseInt(nextPosition)) / 2);

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
                    newPosition = parseInt(parseInt(thisArray["position"]) + parseInt(100000));
                    emptyJSON["position"] = newPosition;
                } else {
                    //if any between elements
                    let thisPosition = thisArray["position"];
                    let nextPosition = tempNotesList[i + 1]["position"];

                    newPosition = parseInt((parseInt(thisPosition) + parseInt(nextPosition)) / 2);
                    emptyJSON["position"] = newPosition;
                }

                newNotesList.push(emptyJSON);
            }
        }

        //updating the state
        setInputFieldPositionToFocusOn(newPosition);
        setNotesListData([]);
        setNotesListData(newNotesList);

        setCounter(counter - 1);
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
    function handleRemoveClick(idx, rowId) {
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
            const response = await deleteNotesListDataItem(utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME), rowId);
            if (response.statusCode === 200) {
                setNotesListData((prevNotesOldList) => {
                    return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id != rowId); // !== is not working
                });
            } else {
                makeSnackBar(response.msg);
            }

            setDisplayLoader(false);
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

    //function to hadle when enter is pressed in any input field
    function handleSubmitInputField(e, idx) {
        e.preventDefault();

        if (notesType === 2) {
            //if type is checkbox
            handleAddBtnClick(idx);
        }
    }

    //function to handle when delete note btn is pressed
    function handleDeleteNoteClick() {
        setDeleteWhat("note");

        setConfirmDialogText("Are you sure to delete " + notesData.title + "?");
        setIsConfirmDialogOpen(true);
    }

    //function to delete a note
    async function deleteNote() {
        setDisplayLoader(true);

        //sending rqst to api
        const response = await deleteANote(utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME), encryptedNotesId);
        if (response.statusCode === 200) {
            // props.history.goBack(); //going back to user's home page
            setRedirectToUserHome(true);
            return;
        } else {
            makeSnackBar(response.msg);
        }

        setDisplayLoader(false);
    }

    //function to close the confirm dialog box
    function handleConfirmDialogClose() {
        setIsConfirmDialogOpen(false);

        //if confirm dialog has appeared for confirm saving change
        if (deleteWhat === "backPressHandler") {
            window.history.pushState(null, null, window.location.pathname);
            setBackbuttonPress(false);
        }
    }

    //funtion to confirm the confirm dialog //when yes is pressed
    function handleConfirmDialogConfirm() {
        setIsConfirmDialogOpen(false);

        if (deleteWhat === "notesListDataItem") {
            deleteANotesListDataItem(notesListDataItemToDelete);
        } else if (deleteWhat === "note") {
            deleteNote();
        } else if (deleteWhat === "backPressHandler") {
            //if confirm dialog has appeared for confirm saving change
            //going back
            setBackbuttonPress(true);
            handleSaveNoteClick();
        }
    }

    //function to handle when save btn is clicked on
    async function handleSaveNoteClick(action) {
        if (!displayLoader) {
            //checking is some change has been done in notes data or not
            const hasChanged = await checkIfNotesDataIsChanged();
            if (hasChanged === false) {
                //no any change has occured
                //checking if saving using shortcut key
                if (action === "shortcutKey") {
                    makeSnackBar("Nothing to save", "info");
                } else {
                    //redirecting back to user's home page
                    // props.history.goBack();
                    setRedirectToUserHome(true);
                    return;
                }
            } else {
                //some changes has occured
                try {
                    const notesDataDb = hasChanged.notesDataDb;
                    const notesListDataDb = hasChanged.notesListDataDb;

                    //sending rqst to api
                    if (notesDataDb || notesListDataDb) {
                        setDisplayLoader(true);
                        updateANotesListData(notesDataDb, notesListDataDb, action);
                    }
                } catch {
                    makeSnackBar("Something went wrong");
                }
            }
        }
    }

    //function to check is changes in notes data has taken place
    async function checkIfNotesDataIsChanged() {
        //checking if notes title has changed or not
        let notesDataDb = notesData;

        let notesTitleChanged = notesData.hasChanged;
        if (!notesTitleChanged) {
            notesDataDb = 0;
        }

        //deciding list datas which is to be sent to server
        //for old lists checking if some change has occur // for new list simply pushing it
        let notesListDataDb = [];

        let len = Object.keys(notesListData).length;
        for (let i = 0; i < len; i++) {
            let id = notesListData[i].id;
            let hasChanged = notesListData[i].hasChanged;

            if (parseInt(id) > 0) {
                //if notes list is old
                if (hasChanged) {
                    notesListDataDb.push(notesListData[i]);
                }
            } else {
                //if notes list is new
                notesListDataDb.push(notesListData[i]);
            }
        }

        var listLength = Object.keys(notesListDataDb).length;
        if (listLength === 0) {
            notesListDataDb = 0;
        }

        //checking is some change has been done in notes data or not
        if (notesDataDb === 0 && notesListDataDb === 0) {
            //no any change is done by user
            return false;
        } else {
            //some change has occured
            return {
                "notesDataDb": notesDataDb,
                "notesListDataDb": notesListDataDb,
            }
        }
    }

    //function to handle update notes list data
    async function updateANotesListData(notesDataDb, notesListDataDb, action) {
        //sending rqst to api
        const response = await updateNotesListData(
            utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME),
            encryptedNotesId,
            JSON.stringify(notesDataDb),
            JSON.stringify(notesListDataDb),
        );
        if (response.statusCode === 200) {
            //checking if saving using shortcut key
            if (action === "shortcutKey") {
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            } else {
                //going back to user's home page after .7s
                //so that success toast can be visible for some time
                setTimeout(function() {
                    // props.history.goBack();
                    setRedirectToUserHome(true);
                    return;
                }, 700);
            }
        } else {
            makeSnackBar(response.msg);
            setDisplayLoader(false);
        }
    }

    //function to handle when "ctrl + s" is pressed
    function handleShortcutKeyPress(keyName, e, handle) {
        e.preventDefault(); //prevent default action of that shortcut key

        makeSnackBar("Saving...", "info");
        handleSaveNoteClick("shortcutKey");
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
                                placeholder="Title"
                                autoCapitalize="words"
                                value={notesData.title}
                                onChange={(e) => setNotesData({ title: e.target.value, hasChanged: true })}
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
                            notesListData.map(function(item, idx) {
                                return (
                                    <NotesListDataItem
                                        key={idx}
                                        idx={idx}
                                        notesType={notesType}
                                        positionToFocus={inputFieldPositionToFocusOn}
                                        rowId={parseInt(item.id)}
                                        isActive={parseInt(item.is_active)}
                                        position={parseInt(item.position)}
                                        title={item.list_title}
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
        <Hotkeys
            keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
            onKeyDown={handleShortcutKeyPress}
            // onKeyUp={onKeyUp}
            filter={(event) => {
                return true; //to enable shortcut key inside input, textarea and select too
            }}
        >
            {
                //redirecting to landing page
                redirectToLandingPage ? <Redirect to="/" /> : null
            }

            {
                //redirecting to user's home page
                redirectToUserHome ? <Redirect to="/home" /> : null
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
                    <LoadingAnimation loading={displayLoader} />
                    :
                    renderPageContent()
            }
        </Hotkeys>
    )
}