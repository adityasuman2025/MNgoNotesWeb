import { encryptionUtil } from "mngo-project-tools";
import { userNotesRef } from "./firebaseConfig";
import { API_FAILED_ERROR, ENCRYPTION_KEY } from "./constants";

export async function getUserNotes(userToken) {
    console.log("getUserNotes")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "" };

        const userNotesToken = encryptionUtil.md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
        await userNotesRef
            .child(userNotesToken)
            .once('value')
            .then(async (resp) => {
                const response = resp.val();

                toReturn.statusCode = 200;
                toReturn.msg = "success";
                toReturn.data = { notesList: [] };
                if (response) toReturn.data.notesList = Object.values(response).reduce((acc, item) => [...acc, {
                    ...item,
                    title: encryptionUtil.decryptText(item.title, ENCRYPTION_KEY)
                }], []);
            })
            .catch((error) => { toReturn.msg = error.message });
        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function getUserNoteById(userToken, userNoteId) {
    console.log("getUserNoteById")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "" };

        const userNotesToken = encryptionUtil.md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
        await userNotesRef
            .child(userNotesToken)
            .child(userNoteId)
            .once('value')
            .then(async (resp) => {
                const response = resp.val();

                if (response) {
                    toReturn.statusCode = 200;
                    toReturn.msg = "success";
                    const { id = "", title = "", type = 1, noteContentItems: items = [] } = response;
                    toReturn.data = {
                        id, type,
                        title: encryptionUtil.decryptText(title, ENCRYPTION_KEY),
                        noteContentItems: items.map(i => ({ ...i, text: encryptionUtil.decryptText(i.text, ENCRYPTION_KEY) }))
                    };
                } else {
                    toReturn.msg = "user's note not found";
                }
            })
            .catch((error) => { toReturn.msg = error.message });
        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function deleteUserNote(userToken, userNoteId) {
    console.log("deleteUserNote")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "" };

        const userNotesToken = encryptionUtil.md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);

        await userNotesRef
            .child(userNotesToken)
            .child(userNoteId)
            .set(null);

        toReturn.statusCode = 200;
        toReturn.msg = "success";

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function updateUserNote(userToken, userNoteId, toSet) {
    console.log("updateUserNote")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "" };

        const userNotesToken = encryptionUtil.md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
        await userNotesRef
            .child(userNotesToken)
            .child(userNoteId)
            .set(toSet)
            .catch((error) => { toReturn.msg = error.message });

        toReturn.statusCode = 200;
        toReturn.msg = "success";

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}

export async function createUserNote(userToken, userNoteId) {
    console.log("createUserNote")
    try {
        let toReturn = { statusCode: 500, data: {}, msg: "" };

        const userNotesToken = encryptionUtil.md5Hash(userToken + "_notes_" + ENCRYPTION_KEY);
        await userNotesRef
            .child(userNotesToken)
            .child(userNoteId)
            .set({ title: "", type: 1, id: userNoteId, noteContentItems: [{ text: "" }] })
            .catch((error) => { toReturn.msg = error.message });

        toReturn.statusCode = 200;
        toReturn.msg = "success";

        return toReturn;
    } catch {
        return API_FAILED_ERROR;
    }
}