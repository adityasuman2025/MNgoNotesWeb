import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { authApis, utils, SnackBar, LoadingAnimation, PWAInstallProvider } from "mngo-project-tools";
import { PROJECT_NAME, ENCRYPTION_KEY, FIREBASE_REST_API_BASE_URL, USERS_REF, LOGGED_USER_TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_TIME, EXTENSION_ENV_NAME, EXTENSION_ENV_VAL, WEB_URL } from '../constants';
import InstallPWABtn from "../components/InstallPWABtn";
import CircularButton from "../components/CircularButton";

export default function LoginPage(props) {
    //hooks variables
    const [redirectToUserHome, setRedirectToUserHome] = useState(false);

    const [isContentVisible, setIsContentVisible] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //componentDidMount
    useEffect(() => {
        //checking if someone is already logged in
        if (utils.getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME)) {
            //redirect to user's home page
            setRedirectToUserHome(true);
            return;
        }

        setDisplayLoader(false);
        setIsContentVisible(true);
    }, []);

    //function to handle when signup is clicked
    function handleSignUpClick() {
        if (process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL) {
            window.open(WEB_URL + "register")
        } else {
            props.history.push("/register");
        }
    }

    //function to handle when login btn is clicked
    async function handleLoginClick(e) {
        e.preventDefault();

        //hanling stuffs if login is not already clicked
        if (!displayLoader) {
            setDisplayLoader(true);

            //verifying the entered data
            const username = enteredUsername.trim();
            const password = enteredPassword.trim();
            if (username !== "" && password !== "") {
                //sending rqst to api
                const response = await authApis.verifyLogin(FIREBASE_REST_API_BASE_URL, USERS_REF, username, password, ENCRYPTION_KEY);
                if (response.statusCode === 200) {
                    const token = response.token;
                    if (token) {
                        //setting cookie and redirecting to user's home page
                        if (await utils.makeCookie(LOGGED_USER_TOKEN_COOKIE_NAME, token, COOKIE_EXPIRATION_TIME)) {
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
            } else {
                makeSnackBar("Please fill all details");
            }
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

    //function to render page contenr
    function renderPageContent() {
        return (
            <form className="loginPageContent" onSubmit={handleLoginClick} >
                <img alt="logoImg" className="logoIcon" width={200} height={200} src={require("../img/logo.webp")} />
                <div className="logoTitle">{PROJECT_NAME}</div>

                <input
                    className="inputBox"
                    type="text"
                    placeholder="Username"
                    value={enteredUsername}
                    autoFocus
                    onChange={(e) => setEnteredUsername(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                />

                <CircularButton ><span className="buttonText">Login</span></CircularButton>
                <br />

                <LoadingAnimation loading={displayLoader} />

                <br /><br /><br />
                <div className="signupText">
                    Don't have an account yet?
                    <span className="signupButton" onClick={handleSignUpClick}> Signup</span>
                </div>
                <br />

                <a href='https://chrome.google.com/webstore/detail/mngo-notes-text-notes-to/ennpnglofmhmbpijnambnccoaklahfno' target="_blank" className='extLink' rel="noopener noreferrer">
                    <img width={50} height={50} src={require("../img/chrome.webp")} alt="chromeImg" />
                    Download Extension
                </a>

                <br />
                <PWAInstallProvider>
                    <InstallPWABtn />
                </PWAInstallProvider>
                <br />

            </form >
        )
    }

    //component rendering
    return (
        <>
            {
                //redirecting to user's home page
                redirectToUserHome ? <Redirect to="/home" /> : null
            }

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />

            {
                isContentVisible ?
                    renderPageContent()
                    :
                    <LoadingAnimation loading={displayLoader} />
            }
        </>
    )
}