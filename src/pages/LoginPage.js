import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import LoginForm from "mngo-project-tools/comps/LoginForm";
import InstallPWABtn from "mngo-project-tools/comps/InstallPWABtn";
import LoadingAnimation from "mngo-project-tools/comps/LoadingAnimation";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import { makeCookie, getCookieValue } from "mngo-project-tools/utils";
import { verifyLogin } from "mngo-project-tools/authApis";
import { PROJECT_NAME, ENCRYPTION_KEY, FIREBASE_REST_API_BASE_URL, USERS_REF, LOGGED_USER_TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_TIME, EXTENSION_ENV_NAME, EXTENSION_ENV_VAL, WEB_URL } from '../constants';

export default function LoginPage(props) {
    const [redirectToUserHome, setRedirectToUserHome] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [displayLoader, setDisplayLoader] = useState(true);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    useEffect(() => {
        //checking if someone is already logged in
        if (getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME)) {
            //redirect to user's home page
            setRedirectToUserHome(true);
            return;
        }

        setDisplayLoader(false);
        setIsContentVisible(true);
    }, []);

    function handleSignUpClick() {
        if (process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL) {
            window.open(WEB_URL + "register")
        } else {
            props.history.push("/register");
        }
    }

    async function handleLoginClick(username, password) {
        setDisplayLoader(true);
        const response = await verifyLogin(FIREBASE_REST_API_BASE_URL, USERS_REF, username, password, ENCRYPTION_KEY);
        if (response.statusCode === 200) {
            const token = response.token;
            if (token) {
                //setting cookie and redirecting to user's home page
                if (await makeCookie(LOGGED_USER_TOKEN_COOKIE_NAME, token, COOKIE_EXPIRATION_TIME)) {
                    setRedirectToUserHome(true);
                    return;
                } else {
                    makeSnackBar("Something went wrong");
                }
            } else {
                makeSnackBar("Something went wrong");
            }
        } else {
            makeSnackBar(response.msg);
        }
        setDisplayLoader(false);
    }

    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }

    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    function renderPageContent() {
        return (
            <div className='loginSignUpPage'>
                <LoginForm
                    styles={{ inputClassName: "inputBox" }}
                    projectTitle={PROJECT_NAME}
                    isLoggingUser={displayLoader}
                    showError={(error) => { makeSnackBar(error) }}
                    onLoginClick={(username, password) => { handleLoginClick(username, password) }}
                    onSignUpClick={handleSignUpClick}
                >
                    <>
                        <a href='https://chrome.google.com/webstore/detail/mngo-notes-text-notes-to/ennpnglofmhmbpijnambnccoaklahfno' target="_blank" className='extLink' rel="noopener noreferrer">
                            <img width={50} height={50} src={require("../img/chrome.webp")} alt="chromeImg" />
                            Download Extension
                        </a>
                        <br />
                        {
                            process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL ? null :
                                <InstallPWABtn styles={{ className: "pwaInsBtn" }} />
                        }
                    </>
                </LoginForm>
            </div>
        )
    }

    return (
        <>
            {redirectToUserHome ? <Redirect to="/home" /> : null}

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />

            {isContentVisible ? renderPageContent() : <LoadingAnimation loading={displayLoader} />}
        </>
    )
}