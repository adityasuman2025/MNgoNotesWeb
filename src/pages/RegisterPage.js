import React, { useState } from 'react';
import RegisterForm from "mngo-project-tools/comps/RegisterForm";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import { PROJECT_NAME } from '../constants';
import { registerUser } from "../apis";

export default function RegisterPage() {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //function to handle when register btn is clicked
    async function handleRegisterClick(username, name, email, password, passcode) {
        setDisplayLoader(true);
        try {
            await registerUser(username, name, email, password, passcode);
            makeSnackBar("Sucessfully registered. Please Login to continue", "success");
        } catch (e) {
            makeSnackBar(e.message);
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
                onClose={handleSnackBarClose}
            />

            <div className='loginSignUpPage'>
                <RegisterForm
                    styles={{ inputClassName: "inputBox" }}
                    projectTitle={PROJECT_NAME}
                    isRegisteringUser={displayLoader}
                    showError={(error) => { makeSnackBar(error) }}
                    onRegisterClick={handleRegisterClick}
                />
            </div>
        </>
    )
}