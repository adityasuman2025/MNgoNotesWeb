import { sendRequestToAPI } from "mngo-project-tools/utils";
import { md5Hash, decryptText } from "mngo-project-tools/encryptionUtil";
import { API_FAILED_ERROR, ENCRYPTION_KEY, FIREBASE_REST_API_BASE_URL, DUMMY_NEW_NOTE, USER_NOTES_REF } from "./constants";

export async function getUserNotes(userToken) {
    console.log("getUserNotes")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "something went wrong" };

        if (FIREBASE_REST_API_BASE_URL) {
            const userNotesToken = md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
            const response = await sendRequestToAPI(FIREBASE_REST_API_BASE_URL, `/${USER_NOTES_REF}/${userNotesToken}.json`) || {};

            toReturn = { ...toReturn, statusCode: 200, msg: "success" };
            toReturn.data = { notesList: [] };
            toReturn.data.notesList = Object.values(response)
                .reduce((acc, item) => [...acc, {
                    ...item,
                    title: decryptText(item.title, ENCRYPTION_KEY),
                    noteContentItems: (item.noteContentItems || []).map(i => ({ ...i, text: decryptText(i.text, ENCRYPTION_KEY) }))
                }], [])
                .sort((a, b) => b.ts - a.ts); // for sorting by timestamps(ts)
        }

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function deleteUserNote(userToken, userNoteId) {
    console.log("deleteUserNote", userNoteId)
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "something went wrong" };

        if (FIREBASE_REST_API_BASE_URL) {
            const userNotesToken = md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
            await sendRequestToAPI(FIREBASE_REST_API_BASE_URL, `/${USER_NOTES_REF}/${userNotesToken}/${userNoteId}.json`, "DELETE");

            toReturn = { ...toReturn, statusCode: 200, msg: "success" };
        }
        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function updateUserNote(userToken, userNoteId, toSet) {
    console.log("updateUserNote", userNoteId)
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "something went wrong" };

        if (FIREBASE_REST_API_BASE_URL) {
            const userNotesToken = md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
            await sendRequestToAPI(FIREBASE_REST_API_BASE_URL, `/${USER_NOTES_REF}/${userNotesToken}/${userNoteId}.json`, "PUT", toSet)

            toReturn = { ...toReturn, statusCode: 200, msg: "success" };
        }

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function createUserNote(userToken, userNoteId) {
    console.log("createUserNote", userNoteId)
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "something went wrong" };

        if (FIREBASE_REST_API_BASE_URL) {
            const userNotesToken = md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
            await sendRequestToAPI(FIREBASE_REST_API_BASE_URL, `/${USER_NOTES_REF}/${userNotesToken}/${userNoteId}.json`, "PUT", DUMMY_NEW_NOTE(userNoteId))

            toReturn = { ...toReturn, statusCode: 200, msg: "success" };
        }

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}