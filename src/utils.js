import { getCachedFromLStorage, cacheInLStorage } from "mngo-project-tools/cachingUtil";
import { ENCRYPTION_KEY, STORAGE_PENDING_PUSH_KEY } from './constants';

export async function removeNoteIdFromPendingPush(userNoteId) {
    let oldData1 = getCachedFromLStorage(STORAGE_PENDING_PUSH_KEY, ENCRYPTION_KEY);
    const noteIds = Object.keys(oldData1).reduce((acc, key) => { if (key !== userNoteId) acc[key] = 1; return acc }, {})
    await cacheInLStorage(STORAGE_PENDING_PUSH_KEY, noteIds, ENCRYPTION_KEY);
}