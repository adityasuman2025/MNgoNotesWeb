import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";

import { encryption_key, cookie_expiration_time, monthList } from "./constants";
const cookies = new Cookies();

//function to get a cookie value, decrypt it and return real value
export function getDecryptedCookieValue (cookie_name) {
    let value = null;
    try {
        const cookie_value = cookies.get(cookie_name);
        if (cookie_value) {
            const decrypted = CryptoJS.AES.decrypt(
            cookie_value,
            encryption_key
            );
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
        const encrypted_value = CryptoJS.AES.encrypt(
            value,
            encryption_key
        ).toString();
        cookies.set(key, encrypted_value, {
            path: "/",
            expires: cookie_expiration_time,
        });

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