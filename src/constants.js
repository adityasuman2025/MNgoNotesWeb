export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

export const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
export const IS_PASS_CODE_REQUIRED = process.env.REACT_APP_IS_PASS_CODE_REQUIRED;
export const FIREBASE_REST_API_BASE_URL = process.env.REACT_APP_DB_URL;
export const USER_NOTES_REF = "userNotes";
export const USERS_REF = "users";
export const PROJECT_NAME = "MNgo Notes";
export const LOGGED_USER_TOKEN_COOKIE_NAME = "mngoNotesLoggedUserToken";
export const API_FAILED_ERROR = { msg: "API Connection Failed", status: 400 };
export const TYPE_TO_DO = 2;
export const EXTENSION_ENV_NAME = "REACT_APP_EXT";
export const EXTENSION_ENV_VAL = "ext";
export const WEB_URL = "https://notes.mngo.in/";
export const DUMMY_NEW_NOTE = (userNoteId) => ({
  title: "", type: 1, id: userNoteId,
  ts: new Date().getTime(),
  noteContentItems: [{ text: "" }]
});
export const STORAGE_KEY = "notesList";
export const STORAGE_PENDING_PUSH_KEY = "notesListPendingPushtoDb";

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
    "16": "logo.png",
    "32": "logo.png",
    "48": "logo.png",
    "128": "logo.png",
    "192": "logo.png",
    "512": "logo.png"
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
    "16": "logo.png",
    "32": "logo.png",
    "48": "logo.png",
    "128": "logo.png",
    "192": "logo.png",
    "512": "logo.png"
  },
  "permissions": []
}

ref: 
https://stackoverflow.com/questions/30889154/how-to-set-content-security-policy-in-chrome-extension-manifest-json-in-order-fo
https://developer.chrome.com/docs/extensions/mv3/mv3-migration/
https://dev.to/swimmingkiim/chrome-extension-with-firebase-manifest-v3-27gc
*/