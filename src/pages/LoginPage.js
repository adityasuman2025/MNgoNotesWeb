import React, { useState } from 'react';
import { Redirect } from "react-router-dom";

import CircularButton from "../components/CircularButton";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { VerifyLogin } from "../apis";
import { makeEncryptedCookie } from "../utils";
import { PROJECT_NAME } from '../constants';

export default function LoginPage(props) {
    //hooks variables
    const [redirectToUserDashboard, setRedirectToUserDashboard] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(false);
    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //function to handle when signup is clicked
    function handleSignUpClick() {
        props.history.push("/register");
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
                try {
                    const response = parseInt(await VerifyLogin(username,  password));
                    if (response === -1) {
                        makeSnackBar("Something went wrong", "error");
                    } else if ( response === 0 ) {
                        makeSnackBar("Login credentials is not correct", "error");
                    } else {
                        //setting cookie and redirecting to user's dashboard
                        const mngoNotesLoggedUserIdCookie = await makeEncryptedCookie("mngoNotesLoggedUserId", response.toString());
                        if (mngoNotesLoggedUserIdCookie) {
                            setRedirectToUserDashboard(true);
                            return;
                        } else {
                            makeSnackBar("Something went wrong", "error");
                        }
                    }
                } catch {
                    makeSnackBar("Something went wrong", "error");
                }
            } else {
                makeSnackBar("Please fill all details", "error");
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

//component rendering
    return (
        <>
            {
                //redirecting to admin login page
                redirectToUserDashboard ? <Redirect to="/dashboard" /> : null
            }

            <form 
                className="loginPageContent"
                onSubmit={handleLoginClick} 
            >
                <img
                    alt="logo img"
                    className="logoIcon"
                    src={require("../img/logo.png")}
                />
                <div className="logoTitle">
                    {PROJECT_NAME}
                </div>
                {/* <br /> */}

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

                <CircularButton >
                    <span className="buttonText">Login</span>
                </CircularButton>
                <br />

                <LoadingAnimation loading={displayLoader}/>

                <div className="signupText">
                    {"Don't have an account yet? "}
                    <span 
                        className="signupButton" 
                        onClick={handleSignUpClick}
                    > 
                    Signup
                    </span>
                </div>
            </form>

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />
        </>
    )
}