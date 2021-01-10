import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Hotkeys from 'react-hot-keys';

import NotesListDataItem from "../components/NotesListDataItem";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { addUserNotes } from "../apis";
import { getCookieValue } from '../utils';

export default function CreateNote(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);
    const [redirectToUserHome, setRedirectToUserHome] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [notesData, setNotesData] = useState({ title: "", type: 1 });
    const [notesListData, setNotesListData] = useState([{ position: 100000, title: "", is_active: 1 }]);
    const [tempNotesListData, setTempNotesListData] = useState([]);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        try {
            //checking if someone is logged or not
            const mngoNotesLoggedUserToken = getCookieValue("mngoNotesLoggedUserToken");
            if (mngoNotesLoggedUserToken) {
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
            let nextPosition = 100000; //if list is empty
            if (len !== 0) {
                //if list is not empty
                nextPosition = tempNotesList[0]["position"];
            }

            let newPosition = parseInt((parseInt(0) + parseInt(nextPosition)) / 2);

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
                    let nextPosition = tempNotesList[i + 1]["position"];

                    let newPosition = parseInt((parseInt(thisPosition) + parseInt(nextPosition)) / 2);
                    emptyJSON["position"] = newPosition;
                }
                newNotesList.push(emptyJSON);
            }
        }

        // updating the state
        setNotesListData([]);
        setNotesListData(newNotesList);
    }

    //function to hanlde when checkbox is cliked on
    function hanldeCheckBoxClick(idx, rowId, toSet) {
        //getting the old data
        let oldJSON = notesListData;
        let oldJsonForThatKey = oldJSON[idx];

        //update the old data
        let newJSONForThatKey = {
            "position": oldJsonForThatKey.position,
            "title": oldJsonForThatKey.title,
            "is_active": toSet
        };
        oldJSON[idx] = newJSONForThatKey;

        //set the state with new updated data
        setTempNotesListData(notesListData);
        setTempNotesListData((prevtemNotestFields) => {
            return prevtemNotestFields.filter(newInputFields => newInputFields.position !== idx)
        });
        // //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can also type there freely
    }

    //function to handle when remove btn is clicked on for any list data input field
    function handleRemoveClick(idx, rowId) {
        //removing that list val from data
        let oldJSON = notesListData;
        if (idx > -1) {
            oldJSON.splice(idx, 1);
        }

        // updating the state
        setTempNotesListData(notesListData);
        setTempNotesListData((prevtemNotestFields) => {
            return prevtemNotestFields.filter(newInputFields => newInputFields.position !== idx)
        });
        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can also type there freely
    }

    //function to handle when typed in notes list data field
    function handleInputFieldChange(idx, rowId, val) {
        //getting the old data
        let oldJSON = notesListData;
        let oldJsonForThatKey = oldJSON[idx];

        //update the old data
        let newJSONForThatKey = {
            "position": oldJsonForThatKey.position,
            "title": val,
            "is_active": oldJsonForThatKey.is_active
        };
        oldJSON[idx] = newJSONForThatKey;

        //updating the textInputs according to the latest user input
        setTempNotesListData(notesListData);
        setTempNotesListData((prevNotesOldList) => {
            return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
        });
        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can alwo type there freely
    }

    //function to hadle when enter is pressed in any input field
    function handleSubmitInputField(e, idx) {
        e.preventDefault();

        if (notesData.type === 2) {
            //if type is checkbox
            handleAddBtnClick(idx);
        }
    }

    //function yo handle when save btn is clicked on
    async function handleSaveNoteClick() {
        if (!displayLoader) {
            const title = notesData.title;
            const type = notesData.type;

            if (title !== "" && type !== "") {
                setDisplayLoader(true);
                //sending rqst to api
                const response = await addUserNotes(
                    getCookieValue("mngoNotesLoggedUserToken"),
                    JSON.stringify(notesData),
                    JSON.stringify(notesListData),
                );
                if (response.statusCode === 200) {
                    makeSnackBar("Saved", "success");

                    //going back to user's home page after .7s
                    //so that success toast can be visible for some moment
                    setTimeout(function() {
                        // props.history.goBack();
                        setRedirectToUserHome(true);
                        return;
                    }, 700);
                } else {
                    makeSnackBar(response.msg);
                    setDisplayLoader(false);
                }
            } else {
                makeSnackBar("Title or Type can't be empty");
            }
        }
    }

    //function to handle when "ctrl + s" is pressed
    function handleShortcutKeyPress(keyName, e, handle) {
        e.preventDefault(); //prevent default action of that shortcut key

        makeSnackBar("Saving...", "info");
        handleSaveNoteClick();
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
                            notesListData.map(function(item, idx) {
                                return (
                                    <NotesListDataItem
                                        key={idx}
                                        idx={idx}
                                        notesType={notesData.type}
                                        page={"CreateNote"}
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


            {
                displayLoader ?
                    <LoadingAnimation loading={displayLoader} />
                    :
                    renderPageContent()
            }
        </Hotkeys>
    )
}