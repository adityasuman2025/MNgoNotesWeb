import axios from "axios";

import { API_URL_ADDRESS } from "./constants"

export async function VerifyLogin(username, password) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "verifyLogin.php";
        const response = await axios.post(requestAddress, {
            username: username,
            password: password,
        });

        const data = (response.data).toString();
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function registerNewUser(username, email, password, passcode) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "registerNewUser.php";
        const response = await axios.post(requestAddress, {
            username: username,
            email: email,
            password: password,
            passcode: passcode,
        });

        const data = (response.data).toString();
        return data;
    } catch {
        return "-10"; //internal server error
    }
}

export async function getUserNotes(userId) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "getUserNotes.php";
        const response = await axios.post(requestAddress, {
            user_id: userId,
        });

        const data = JSON.stringify(response.data);
        return data;
    } catch {
        return "-10"; //internal server error
    }
}