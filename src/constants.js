// variables for setting cookie expiratiom tym
export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

export const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
export const IS_PASS_CODE_REQUIRED = process.env.REACT_APP_IS_PASS_CODE_REQUIRED;

//general variables
export const PROJECT_NAME = "MNgo Notes";
export const LOGGED_USER_TOKEN_COOKIE_NAME = "mngoNotesLoggedUserToken";
export const API_FAILED_ERROR = { msg: "API Connection Failed" };
export const TYPE_TO_DO = 2;

export const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];