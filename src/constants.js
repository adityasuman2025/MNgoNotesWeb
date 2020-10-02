
// variables for setting cookie expiratiom tym
export const cookie_expiration_mins = 30 * 24 * 60; // 30 days

let cookie_expiration_tym = new Date();
cookie_expiration_tym.setTime( cookie_expiration_tym.getTime() + ( cookie_expiration_mins*60*1000 ));
export const cookie_expiration_time = cookie_expiration_tym;

//general variables
export const api_url_address = "https://mngo.in/notes_api/";

export const project_name = "MNgo Notes";
export const encryption_key = "mngo_notes_is_lub";

export const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];