import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";

import CircularButton from "../components/CircularButton";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { VerifyLogin } from "../apis";
import { makeEncryptedCookie, getDecryptedCookieValue } from "../utils";
import { PROJECT_NAME } from '../constants';

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
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (mngoNotesLoggedUserId) {
            //redirect to user's home page
            setRedirectToUserHome(true);
        }
        
        setDisplayLoader(false);
        setIsContentVisible(true);
    }, []);

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
                    const response = await VerifyLogin(username,  password);
                    if (response === "-10") {
                        makeSnackBar("Internal Server Error");
                    } else if (response === "-1") {
                        makeSnackBar("Something went wrong");
                    } else if (response === "0") {
                        makeSnackBar("Login credentials is not correct");
                    } else {
                        //setting cookie and redirecting to user's home page
                        const mngoNotesLoggedUserIdCookie = await makeEncryptedCookie("mngoNotesLoggedUserId", response);
                        if (mngoNotesLoggedUserIdCookie) {
                            setRedirectToUserHome(true);
                            return;
                        } else {
                            makeSnackBar("Something went wrong");
                        }
                    }
                } catch {
                    makeSnackBar("Something went wrong");
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

                        <LoadingAnimation loading={displayLoader} />
                        
                        <br /><br /><br />
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
                :
                    <LoadingAnimation loading={displayLoader} />
            }
        </>
    )
}