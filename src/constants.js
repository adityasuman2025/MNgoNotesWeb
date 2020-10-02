
// variables for setting cookie expiratiom tym
export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime( COOKIE_EXPIRATION_TYM.getTime() + ( COOKIE_EXPIRATION_MINS*60*1000 ));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

//general variables
export const API_URL_ADDRESS = "https://mngo.in/notes_api/";

export const PROJECT_NAME = "MNgo Notes";
export const ENCRYPTION_KEY = "mngo_notes_is_lub";

export const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];