import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import WithoutAuth from "mngo-project-tools/hocs/WithoutAuth";
import LoginForm from "mngo-project-tools/comps/LoginForm";
import InstallPWABtn from "mngo-project-tools/comps/InstallPWABtn";
import SnackBar from "mngo-project-tools/comps/SnackBar";
import { makeCookie } from "mngo-project-tools/utils";
import { PROJECT_NAME, LOGGED_USER_TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_TIME, EXTENSION_URL, EXTENSION_ENV_NAME, EXTENSION_ENV_VAL, WEB_URL } from '../constants';
import { verifyUser } from "../apis";

const isExtension = process.env[EXTENSION_ENV_NAME] === EXTENSION_ENV_VAL;

function LoginPage(props) {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [snackBarData, setSnackBarData] = useState({ visisible: false, msg: "", type: "" });

    function handleSignUpClick() {
        if (isExtension) window.open(WEB_URL + "register")
        else props.history.push("/register");
    }

    async function handleLoginClick(username, password) {
        setDisplayLoader(true);
        try {
            const { data: { userToken } = {} } = await verifyUser(username, password);

            if (userToken) {
                makeCookie(LOGGED_USER_TOKEN_COOKIE_NAME, userToken, COOKIE_EXPIRATION_TIME)
                return props.history.push("/home");
            } else {
                makeSnackBar("Something went wrong");
            }
        } catch (e) {
            makeSnackBar(e.message);
        }
        setDisplayLoader(false);
    }

    function makeSnackBar(msg, type = "error") {
        setSnackBarData({ visisible: true, msg, type });
    }

    return (
        <>
            <div className='loginSignUpPage'>
                <LoginForm
                    styles={{ inputClassName: "inputBox" }}
                    projectTitle={PROJECT_NAME}
                    isLoggingUser={displayLoader}
                    showError={(error) => { makeSnackBar(error) }}
                    onLoginClick={(username, password) => { handleLoginClick(username, password) }}
                    onSignUpClick={handleSignUpClick}
                >
                    {
                        isExtension ? null :
                            <>
                                <a href={EXTENSION_URL} target="_blank" className='extLink' rel="noopener noreferrer">
                                    <img width={50} height={50} src={require("../img/chrome.webp")} alt="chromeImg" />
                                    Download Extension
                                </a>
                                <InstallPWABtn styles={{ className: "pwaInsBtn" }} />
                            </>
                    }
                </LoginForm>
            </div>

            <SnackBar
                open={snackBarData.visisible}
                msg={snackBarData.msg}
                type={snackBarData.type}
                onClose={() => setSnackBarData({ visisible: false })}
            />
        </>
    )
}


function redirectToHome() {
    // window.location.href = "/home"; // windiw.location.href was not working in chrome extension

    return <Redirect to="/home" />;
}

export default WithoutAuth(LoginPage, LOGGED_USER_TOKEN_COOKIE_NAME, redirectToHome);