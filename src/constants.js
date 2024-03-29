export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

export const REGISTER_URL = "https://profile.mngo.in/register";
export const API_BASE_URL = "https://apis.mngo.in";
export const API_USERS_REF = "/api/users";
export const API_USER_NOTES_REF = "/api/userNotes";

export const PROJECT_NAME = "MNgo Notes";
export const TYPE_TO_DO = 2;

export const EXTENSION_URL = "https://chrome.google.com/webstore/detail/mngo-notes-text-notes-to/ennpnglofmhmbpijnambnccoaklahfno";
export const EXTENSION_ENV_NAME = "REACT_APP_EXT";
export const EXTENSION_ENV_VAL = "ext";

export const LOGGED_USER_TOKEN_COOKIE_NAME = "MNgoNotesLoggedUserToken";
export const STORAGE_KEY = "notesList";
export const STORAGE_PENDING_PUSH_KEY = "notesListPendingPushtoDb";

export const TINY_MCE_API_KEY = "kwys3bhkrnbgyeg1vu2k97u2gmf2scfb30ocz0prz20mhz9e";

/*
{
    "short_name": "MNgo Notes",
    "name": "MNgo Notes: Text Notes & To Dos",
    "description": "A notes Web App & Chrome Extension to write in. Can be used to maintain to dos and texts.",
    "version": "0.0.1",
    "manifest_version": 2,
    "browser_action": {
        "default_popup": "index.html",
        "default_title": "Open the popup"
    },
    "icons": {
        "16": "xxxs.png",
        "32": "xxxs.png",
        "48": "xxxs.png",
        "128": "xxxs.png",
        "192": "xxxs.png",
        "512": "xxxs.png"
    },
    "permissions": [],
    "content_security_policy": "script-src 'self' https://cdn.firebase.com https://*.firebaseio.com; object-src 'self'"
}
*/

/*
{
    "short_name": "MNgo Notes",
    "name": "MNgo Notes: Text Notes & To Dos",
    "description": "A notes Web App & Chrome Extension to write in. Can be used to maintain to dos and texts.",
    "version": "0.0.1",
    "manifest_version": 3,
    "action": {
        "default_popup": "index.html",
        "default_title": "Open the popup"
    },
    "icons": {
        "16": "xxxs.png",
        "32": "xxxs.png",
        "48": "xxxs.png",
        "128": "xxxs.png",
        "192": "xxxs.png",
        "512": "xxxs.png"
    },
    "permissions": []
}

ref: 
https://stackoverflow.com/questions/30889154/how-to-set-content-security-policy-in-chrome-extension-manifest-json-in-order-fo
https://developer.chrome.com/docs/extensions/mv3/mv3-migration/
https://dev.to/swimmingkiim/chrome-extension-with-firebase-manifest-v3-27gc
*/