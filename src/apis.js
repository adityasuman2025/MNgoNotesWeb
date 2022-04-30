import { API_URL_ADDRESS, API_FAILED_ERROR } from "./constants";

async function sendRequestToAPI(endpoint, body, isAuth) {
    try {
        const requestAddress = API_URL_ADDRESS + endpoint;
        const response = await fetch(requestAddress, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function getUserNotes(logged_user_token) {
    return await sendRequestToAPI("get_user_notes.php", {
        logged_user_token
    });
}

export async function getListDataOfANote(logged_user_token, encrypted_notes_id) {
    return await sendRequestToAPI("get_note_list_data.php", {
        logged_user_token,
        encrypted_notes_id,
    });
}

export async function deleteNotesListDataItem(logged_user_token, note_list_id) {
    return await sendRequestToAPI("delete_note_list_data_item.php", {
        logged_user_token,
        note_list_id,
    });
}

export async function deleteANote(logged_user_token, encrypted_notes_id) {
    return await sendRequestToAPI("delete_note.php", {
        logged_user_token,
        encrypted_notes_id,
    });
}

export async function updateNotesListData(logged_user_token, encrypted_notes_id, notesData_db, notesOldList_db) {
    return await sendRequestToAPI("update_note.php", {
        logged_user_token,
        encrypted_notes_id,
        notesData_db,
        notesOldList_db
    });
}

export async function addUserNotes(logged_user_token, notesData, notesList) {
    return await sendRequestToAPI("create_note.php", {
        logged_user_token,
        notesData,
        notesList
    });
}