import { getCookieValue } from "mngo-project-tools/utils";
import { encryptText } from "mngo-project-tools/encryptionUtil";
import { getCachedFromLStorage, cacheInLStorage } from "mngo-project-tools/cachingUtil";
import { updateUserNote } from "./apis";
import { ENCRYPTION_KEY, LOGGED_USER_TOKEN_COOKIE_NAME, STORAGE_PENDING_PUSH_KEY } from './constants';

export async function updateNoteInDb(userNoteId, noteDetails) {
    const { title = "", noteContentItems = [] } = noteDetails || {};

    return await updateUserNote(getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME), userNoteId, {
        ...noteDetails,
        id: userNoteId,
        title: encryptText(title, ENCRYPTION_KEY),
        noteContentItems: noteContentItems.map((item, idx) => ({
            ...item, id: userNoteId + "_content_" + idx,
            text: encryptText(item.text, ENCRYPTION_KEY),
        }))
    });
}

export async function removeNoteIdFromPendingPush(userNoteId) {
    let oldData1 = getCachedFromLStorage(STORAGE_PENDING_PUSH_KEY, ENCRYPTION_KEY);
    const noteIds = Object.keys(oldData1).reduce((acc, key) => { if (key !== userNoteId) acc[key] = 1; return acc }, {})
    await cacheInLStorage(STORAGE_PENDING_PUSH_KEY, noteIds, ENCRYPTION_KEY);
}