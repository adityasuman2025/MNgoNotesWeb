import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";

import { ENCRYPTION_KEY, COOKIE_EXPIRATION_TIME, MONTH_LIST } from "./constants";
const cookies = new Cookies();

//function to get a cookie value, decrypt it and return real value
export function getDecryptedCookieValue (cookie_name) {
    let value = null;
    try {
        const cookieValue = cookies.get(cookie_name);
        if (cookieValue) {
            const decrypted = CryptoJS.AES.decrypt(cookieValue, ENCRYPTION_KEY);
            value = CryptoJS.enc.Utf8.stringify(decrypted);
        }
    } catch {
        value = null;
    }

    return value;
}

//function to set cookie after encrypting the value
export function makeEncryptedCookie (key, value) {
    try {
        const encryptedValue = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
        cookies.set(key, encryptedValue, { path: "/", expires: COOKIE_EXPIRATION_TIME, });

        return true;
    } catch {
        return false;
    }
};

//function to validate name, contact no and email
export function validateUsername (name) {
    var re = /^[a-zA-Z]*$/;
    return re.test(name);
};

export function validateContactNo (number) {
    var re = /^[0-9]*$/;
    return re.test(number);
};