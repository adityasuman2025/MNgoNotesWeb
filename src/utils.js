import React from 'react';
import Cookies from "universal-cookie";
import Slide from '@material-ui/core/Slide';

import { COOKIE_EXPIRATION_TIME, AUTH_API_URL_ADDRESS, API_URL_ADDRESS, API_FAILED_ERROR } from "./constants";
const cookies = new Cookies();

//animation for apperance of dialog box
export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//function to get cookie value
export function getCookieValue(cookie_name) {
    let value = null;
    try {
        const cookieValue = cookies.get(cookie_name);
        if (cookieValue) {
            value = cookieValue;
        }
    } catch {
        value = null;
    }

    return value;
};

//function to set cookie 
export function makeCookie(key, value) {
    try {
        cookies.set(key, value, { path: "/", expires: COOKIE_EXPIRATION_TIME, });

        return true;
    } catch {
        return false;
    }
};

//function to validate name, contact no and email
export function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
};

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export function validateContactNo(number) {
    var re = /^[0-9]*$/;
    return re.test(number);
};

export async function sendRequestToAPI(endpoint, body, isAuth) {
    try {
        const requestAddress = (isAuth ? AUTH_API_URL_ADDRESS : API_URL_ADDRESS) + endpoint;
        const response = await fetch(requestAddress, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch {
        return API_FAILED_ERROR;
    }
}

//function to logout
export async function logout() {
    await cookies.remove("mngoNotesLoggedUserToken", { path: "/", expires: COOKIE_EXPIRATION_TIME });
};
