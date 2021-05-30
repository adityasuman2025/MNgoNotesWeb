
// variables for setting cookie expiratiom tym
export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

//auth variables
export const API_URL_ADDRESS = "https://mngo.in/notes_api2/";
export const AUTH_API_URL_ADDRESS = "https://mngo.in/auth_api/";

//general variables
export const PROJECT_NAME = "MNgo Notes";
export const API_FAILED_ERROR = { msg: "API Connection Failed" };

export const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];