import React, { useState } from 'react';
import RegisterForm from "mngo-project-tools/comps/RegisterForm";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import { registerNewUser } from "mngo-project-tools/authApis";
import { PROJECT_NAME, ENCRYPTION_KEY, FIREBASE_REST_API_BASE_URL, USERS_REF, } from '../constants';

export default function RegisterPage() {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //function to handle when register btn is clicked
    async function handleRegisterClick(username, name, email, password, passCode) {
        setDisplayLoader(true);
        const response = await registerNewUser(FIREBASE_REST_API_BASE_URL, USERS_REF, username, name, email, password, passCode, ENCRYPTION_KEY);
        if (response.statusCode === 200) {
            makeSnackBar("Sucessfully registered. Please Login to continue", "success");
        } else {
            makeSnackBar(response.msg);
        }

        setDisplayLoader(false);
    }

    //function to make a snack-bar
    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }

    //function to close snack-bar
    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    return (
        <>
            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />

            <div className='loginSignUpPage'>
                <RegisterForm
                    inputClassName="inputBox"
                    projectTitle={PROJECT_NAME}
                    isRegisteringUser={displayLoader}
                    showError={(error) => { makeSnackBar(error) }}
                    onRegisterClick={handleRegisterClick}
                />
            </div>
        </>
    )
}