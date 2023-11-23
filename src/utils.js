import { getCacheRegular, setCacheRegular } from "mngo-project-tools/cachingUtil";
import { STORAGE_PENDING_PUSH_KEY } from './constants';

export async function removeNoteIdFromPendingPush(userNoteId) {
    let oldData1 = getCacheRegular(STORAGE_PENDING_PUSH_KEY);
    const noteIds = Object.keys(oldData1).reduce((acc, key) => { if (key !== userNoteId) acc[key] = 1; return acc }, {})
    setCacheRegular(STORAGE_PENDING_PUSH_KEY, noteIds);
}