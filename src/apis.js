import axios from "axios";

import { AUTH_API_URL_ADDRESS, API_URL_ADDRESS } from "./constants"

export async function VerifyLogin(username, password) {
    //sending rqst to api
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_user.php";
        const response = await axios.post(requestAddress, {
            username: username,
            password: password,
        });

        const data = (response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function registerNewUser(username, name, email, password, passcode) {
    //sending rqst to api
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "register_user.php";
        const response = await axios.post(requestAddress, {
            username,
            name,
            email,
            password,
            passcode,
            registeringFor: "NotesApp",
        });

        const data = (response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function getUserNotes(userId) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "getUserNotes.php";
        const response = await axios.post(requestAddress, {
            user_id: userId,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function getListDataOfANote(notesId) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "getListDataOfANote.php";
        const response = await axios.post(requestAddress, {
            notes_id: notesId,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function deleteNotesListDataItem(rowId) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "deleteNotesListFromDB.php";
        const response = await axios.post(requestAddress, {
            row_id: rowId,
        });

        const data = (response.data).toString();
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function deleteANote(userId, notesId) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "deleteANote.php";
        const response = await axios.post(requestAddress, {
            user_id: userId,
            notes_id: notesId,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function updateNotesListData(userId, notesId, notesDataDb, notesListDataDb) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "updateNotesList.php";
        const response = await axios.post(requestAddress, {
            user_id: userId,
            notes_id: notesId,
            notesData_db: notesDataDb,
            notesOldList_db: notesListDataDb,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function addUserNotes(userId, notesData, notesListData) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "addUserNotesInDB.php";
        const response = await axios.post(requestAddress, {
            user_id: userId,
            notesData: notesData,
            notesList: notesListData,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}
