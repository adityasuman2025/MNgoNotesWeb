import { sendRequestToAPI } from "mngo-project-tools/utils";
import { API_BASE_URL, API_USERS_REF, API_USER_NOTES_REF } from "./constants";

export async function verifyUser(username, password) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USERS_REF}/verify?username=${username}&password=${password}`);
}

export async function registerUser(username, name, email, password, passcode) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USERS_REF}/register`, "post", { username, name, email, password, passcode });
}

export async function getUserNotes(userToken) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USER_NOTES_REF}?userToken=${userToken}`);
}

export async function createUserNote(userToken) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USER_NOTES_REF}?userToken=${userToken}`, "post");
}

export async function deleteUserNote(userToken, userNoteId) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USER_NOTES_REF}?userToken=${userToken}&userNoteId=${userNoteId}`, "delete");
}

export async function updateUserNote(userToken, userNoteId, noteDetails) {
    return await sendRequestToAPI(API_BASE_URL, `${API_USER_NOTES_REF}?userToken=${userToken}&userNoteId=${userNoteId}`, "put", { noteDetails });
}