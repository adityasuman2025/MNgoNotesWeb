import axios from "axios";

import { API_URL_ADDRESS } from "./constants"

export async function VerifyLogin(username, password) {
    //sending rqst to api
    try {
        const requestAddress = API_URL_ADDRESS + "verifyLogin.php";
        const response = await axios.post(requestAddress, {
            username: username,
            password: password
        });

        var data = (response.data).toString();

        return data;
    } catch {
        return -10; //inernal server error
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

        var data = (response.data).toString();

        return data;
    } catch {
        return -10; //inernal server error
    }
}